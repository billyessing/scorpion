import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Security } from './../../../shared/models/security.model';

import { FirestoreService } from './../../../shared/services/firestore.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { Trade } from './../../../shared/models/trade.model';


@Component({
  selector: 'app-new-security',
  templateUrl: './new-security.component.html',
  styleUrls: ['./new-security.component.scss']
})
export class NewSecurityComponent implements OnInit {

  @ViewChild(FormGroupDirective) fgDirective;

  tradeForm: FormGroup;
  code: FormControl;
  volume: FormControl;
  purchasePrice: FormControl;

  previewed = false;

  constructor(
    private db: FirestoreService,
    private securityData: SecurityDataService
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.code = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]);
    this.volume = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.tradeForm = new FormGroup({
      code: this.code,
      volume: this.volume,
      purchasePrice: new FormControl(),
    });
  }

  getDetails() {
    let code = this.tradeForm.get('code').value.toUpperCase();
    let volume = this.tradeForm.get('volume').value

    this.securityData.getSecurityData(code)
      .subscribe(data => {
        let price = data['close']
        return this.setPrice(code, volume, price)
      },
      err => {
        console.log('ERROR: failed to retrieve security price')
        return this.setPrice(code, volume, -1)
      })
  }

  setPrice(code: string, volume: number, price: number) {
    if (price !== -1) {
      this.previewed = true
      return this.onSubmit(code, volume, price);
    } else {
      return "N/A";
    }
  }

  onSubmit(code: string, volume: number, price: number) {
    this.tradeForm.patchValue({
      code: code,
      volume: Number(volume),
      purchasePrice: Number(price)
    });

    console.log("code: " + this.tradeForm.get('code').value);
    console.log("volume: " + this.tradeForm.get('volume').value);
    console.log("price: " + this.tradeForm.get('purchasePrice').value);

    // Used set to override the provided autoID by firestore
    this.db.set<Security>(`holdings/${code}`, this.tradeForm.value);
    this.fgDirective.resetForm();
  }

}
