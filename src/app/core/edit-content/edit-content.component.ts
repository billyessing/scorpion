import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Security } from './../../shared/models/security.model';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent {

  newEmail: string;
  newQuantity: number;

  constructor(
    private db: FirestoreService,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<EditContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Security) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEmail(): void {
    this.afs.collection('holdings').doc(this.data._id).update({ email: this.newEmail })
    this.dialogRef.close();
  }

  toUpdate;

  updateTransaction() {
    // console.log(this.data.uid.subcribe(res => {
    //   console.log(res);
    // }))

    this.afs.collection('holdings').doc(this.data._id).update({ code: this.newQuantity })
    this.dialogRef.close();

    this.db.update(this.toUpdate.id, ({
      code: this.data.code,
      quantity: this.data.quantity
    }));
  }
}
