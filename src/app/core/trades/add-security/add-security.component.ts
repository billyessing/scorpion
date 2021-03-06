import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { AuthService } from './../../../shared/auth/auth.service';
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
    private auth: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddSecurityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {  }

  onConfirm(): void {
    let securityDetails = {
      code: this.data['code'].toUpperCase(),
      companyName: this.data['name'],
      industry: this.data['industry'],
      purchasePrice: Number(this.data['price']),
      volume: Number(this.volume),
      updatedAt: new Date()
    }

    this.auth.user
      .subscribe(user => {
        this.db.set<Security>(`user_holdings/${user.uid}/holdings/${securityDetails.code}`, securityDetails);
      })

    this.dialogRef.close();

    this.openSnackBar(securityDetails);
  }

  openSnackBar(trade: any) {
    let msg = 'Successfully added ' + trade.volume + ' ' + trade.code + ' shares to your portfolio.'
    this.snackBar.open(msg, '', {duration: 5000})
  }

  onCancel(): void {

    this.dialogRef.close();
  }

  getCost(): number {
    let totalCost = this.volume * this.data['price'];
    return totalCost;
  }

}
