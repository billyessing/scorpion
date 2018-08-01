import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { SecurityInfoComponent } from './../../pages/security-info/security-info.component'
import { Security } from './../../../shared/models/security.model';
import * as firebase from 'firebase/app'

export interface DialogData {
  securityCode: string,
  securityOpen: number
}

@Component({
  selector: 'app-add-security',
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.scss']
})
export class AddSecurityComponent implements OnInit {

  user: firebase.User;
  volume: number;

  constructor(
    private db: FirestoreService,
    public dialogRef: MatDialogRef<AddSecurityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.user = firebase.auth().currentUser;
  }

  onConfirm(): void {
    let securityDetails = {
      code: this.data['code'].toUpperCase(),
      companyName: this.data['name'],
      industry: this.data['industry'],
      purchasePrice: Number(this.data['price']),
      volume: Number(this.volume)
    }

    this.db.set<Security>(`users_data/${this.user.uid}/holdings/${securityDetails.code}`, securityDetails);
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getCost(): number {
    let totalCost = this.volume * this.data['price'];
    return totalCost;
  }

}
