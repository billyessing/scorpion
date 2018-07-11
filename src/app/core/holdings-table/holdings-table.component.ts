import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';

import { EditContentComponent } from './../edit-content/edit-content.component'

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements AfterViewInit {

  displayedColumns = ['code', 'purchasePrice', 'volume', 'trade'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.afs.collection<any>('transactions').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(EditContentComponent, {
      width: '350px',
      data: data
    });
  }

}
