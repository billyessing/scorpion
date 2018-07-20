import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';
import { FirestoreService } from './../../shared/services/firestore.service';
import { SecurityDataService } from './../../shared/services/security-data.service';
import { ExistingSecurityComponent } from './../trades/existing-security/existing-security.component';
import { Security } from './../../shared/models/security.model';
import { map, take, tap, filter, scan  } from 'rxjs/operators';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/Rx';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class HoldingsTableComponent implements OnInit {

  dataSource: MatTableDataSource<Security>;
  displayedColumns = ['code', 'purchasePrice', 'lastPrice', 'volume', 'value', 'gain', 'gainAsPercentage', 'updatedAt'];
  dateString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private db: FirestoreService,
    private securityData: SecurityDataService) { }

  ngOnInit() {
    this.getSecurityData();
    this.getPortfolio();
    this.preSort();
  }

  getPortfolio() {
    this.db.col$<Security>('holdings')
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  preSort() {
    this.sort.sort(<MatSortable>{
        id: 'updatedAt',
        start: 'desc'
      }
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getSecurityData() {
    this.db.col$<Security>('holdings')
      .subscribe(col => {
        col.forEach(security => {
          this.securityData.getSecurityData(security.code)
            .subscribe(securityData => {
              return this.updateSecurity(security, securityData)
            },
            err => console.log('ERROR: failed to retrieve live portfolio data'),
            () => console.log('successfully retrieved portfolio data...'))
        })
      })
  }

  updateSecurity(security: Security, securityData: {}) {
    let open = securityData['open'];
    let high = securityData['high'];
    let low = securityData['low'];
    let lastPrice = securityData['close'];
    let volumeDaily = securityData['volume'];
    let value = (lastPrice * security.volume).toFixed(2)

    this.db.update(`holdings/${security.code}`, ({
      lastPrice: Number(lastPrice),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      volumeDaily: Number(volumeDaily),
      value: Number(value)
    }), false);
  }
}
