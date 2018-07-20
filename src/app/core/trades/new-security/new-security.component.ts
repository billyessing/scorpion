import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Security } from './../../../shared/models/security.model';

import { FirestoreService } from './../../../shared/services/firestore.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';

import { Trade } from './../../../shared/models/trade.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-new-security',
  templateUrl: './new-security.component.html',
  styleUrls: ['./new-security.component.scss']
})
export class NewSecurityComponent implements OnInit {

  @ViewChild(FormGroupDirective) fgDirective;

  tradeForm: FormGroup;
  tradeFormCode: FormControl;
  tradeFormVolume: FormControl;
  tradeFormPurchasePrice: FormControl;

  price: number;
  code: string;
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
    this.tradeFormCode = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]);
    this.tradeFormVolume = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.tradeForm = new FormGroup({
      code: this.tradeFormCode,
      volume: this.tradeFormVolume,
      purchasePrice: new FormControl(),
    });
  }

  getDetails() {
    let security = this.tradeForm.get('code').value;
    console.log(security)
    this.code = security.toUpperCase();

    this.securityData.getSecurityData(security)
      .subscribe(data => {
        let price = data['close']
        return this.setPrice(price)
      },
      err => {
        console.log('ERROR: failed to retrieve security price')
        return this.setPrice(-1)
      },
      () => console.log("successfully retrieved security price...")
      )
  }

  setPrice(securityPrice: number) {
    if (securityPrice !== -1) {
      console.log('preview: ' + securityPrice)
      this.price = securityPrice;
      this.previewed = true
    } else {
      return "N/A";
    }
  }

  onSubmit() {
    let code = this.tradeForm.get('code').value.toUpperCase();
    // this.getDetails(code)

    console.log("submit: " + this.price)
    this.tradeForm.patchValue({ code: code, purchasePrice: this.price });

    // Used set to override the provided autoID by firestore
    // this.db.set<Security>(`holdings/${code}`, this.tradeForm.value);
    this.fgDirective.resetForm();
  }

}
