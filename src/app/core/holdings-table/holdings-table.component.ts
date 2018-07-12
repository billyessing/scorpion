import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ExistingSecurityComponent } from './../trades/existing-security/existing-security.component'

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
    this.afs.collection<any>('holdings').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, header) => data[header]
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(ExistingSecurityComponent, {
      width: '350px',
      data: data
    });
  }

}
