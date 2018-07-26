import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { SecurityInfoComponent } from './../../pages/security-info/security-info.component'
import { Security } from './../../../shared/models/security.model';

export interface DialogData {
  securityCode: string,
  securityOpen: number
}

@Component({
  selector: 'app-add-security',
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.scss']
})
export class AddSecurityComponent {

  volume: number;

  constructor(
    private db: FirestoreService,
    public dialogRef: MatDialogRef<AddSecurityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onConfirm(): void {
    let securityDetails = {
      code: this.data['code'].toUpperCase(),
      industry: this.data['industry'],
      purchasePrice: Number(this.data['price']),
      volume: Number(this.volume)
    }

    this.db.set<Security>(`holdings/${securityDetails.code}`, securityDetails);
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
