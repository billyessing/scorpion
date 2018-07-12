import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FirestoreService } from './../../../shared/services/firestore.service';
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
  quantity: FormControl;
  timestamp: FormControl;

  constructor(
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  getHoldings() {
    this.db.col$('holdings').subscribe(holdings => {
      console.log(holdings);
    });
  }

  createFormControls() {
    this.code = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]);
    this.quantity = new FormControl('', [
      Validators.required
    ]);
    this.timestamp = new FormControl()
  }


  createForm() {
    this.tradeForm = new FormGroup({
      code: this.code,
      quantity: this.quantity,
      timestamp: this.timestamp
    });
  }

  onPreview() {
    console.log(this.tradeForm.get('code').value);
  }

  onSubmit() {
    this.tradeForm.patchValue({
      code: this.tradeForm.get('code').value.toUpperCase(),
    });
    this.db.add('holdings', this.tradeForm.value);
    this.fgDirective.resetForm();
  }

}
