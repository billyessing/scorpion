import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from './../../shared/services/firestore.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent {

  newEmail: string;
  newQuantity: number;

  constructor(
    private firestoreService: FirestoreService,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<EditContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEmail(): void {
    this.afs.collection('transactions').doc(this.data.uid).update({ email: this.newEmail })
    this.dialogRef.close();
  }

  updateTransaction() {
    this.firestoreService.update(this.data.uid, ({
      code: this.data.code,
      quantity: this.data.quantity
    }));
    this.dialogRef.close();
  }
}
