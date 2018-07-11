import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FirestoreService } from './../../../shared/services/firestore.service';
import { Transaction } from './../../../shared/models/transaction.model';

@Component({
  selector: 'app-make-transaction',
  templateUrl: './make-transaction.component.html',
  styleUrls: ['./make-transaction.component.scss']
})
export class MakeTransactionComponent implements OnInit {
  @ViewChild(FormGroupDirective) fgDirective;

  transactions: Transaction[];

  transaction: Transaction;
  transactionForm: FormGroup;
  type: FormControl;
  code: FormControl;
  quantity: FormControl;
  timestamp: FormControl;

  submitTransaction: Subscription;

  editState: boolean = false;
  transactionToEdit: Transaction;

  constructor(
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.getTransactions();

    this.transaction = new Transaction('', '');
    this.createFormControls();
    this.createForm();
  }

  getTransactions() {
    this.db.col$('transactions').subscribe(transactions => {
      console.log(transactions);
      this.transactions = transactions;
    });
  }

  createFormControls() {
    this.type = new FormControl('', [
      Validators.required
    ]);
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
    this.transactionForm = new FormGroup({
      type: this.type,
      code: this.code,
      quantity: this.quantity,
      timestamp: this.timestamp
    });
  }

  onPreview() {
    console.log(this.transactionForm.get('code').value);
  }

  onSubmit() {
    this.transactionForm.patchValue({
      code: this.transactionForm.get('code').value.toUpperCase(),
      timestamp: new Date().toLocaleString()
    });
    this.db.add('transactions', this.transactionForm.value);
    this.fgDirective.resetForm();
  }

  // updateTransaction(transaction: Transaction) {
  //   this.dataService.updateTransaction(transaction);
  // }

  editTransaction(event, transaction: Transaction) {
    this.editState = true;
    this.transactionToEdit = transaction;
  }

  // fix
  deleteTransaction(event, transaction: Transaction) {
    this.clearState();
    this.db.delete(transaction.id);
  }

  clearState(){
    this.editState = false;
    this.transactionToEdit = null;
  }
}
