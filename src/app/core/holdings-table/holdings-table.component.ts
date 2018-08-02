import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';

import 'rxjs/Rx';
import { map, take, tap, filter, scan, switchMap } from 'rxjs/operators';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';

import { ExistingSecurityComponent } from './../trades/existing-security/existing-security.component';
import { FirestoreService } from './../../shared/services/firestore.service';
import { SecurityDataService } from './../../shared/services/security-data.service';
import { Security } from './../../shared/models/security.model';
import { AuthService } from './../../shared/auth/auth.service';
import * as firebase from 'firebase/app'

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

  user: firebase.User;

  dataSource: MatTableDataSource<Security>;
  displayedColumns = ['code', 'purchasePrice', 'lastPrice', 'volume', 'value', 'gain', 'gainAsPercentage', 'updatedAt'];
  dateString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private db: FirestoreService,
    private securityData: SecurityDataService,
    private auth: AuthService) { }

  ngOnInit() {
    this.user = firebase.auth().currentUser;

    this.getPortfolio();
    this.getSecurityData();
    this.preSort();
  }

  getPortfolio() {
    this.db.col$<Security>(`users_data/${this.user.uid}/holdings`)
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  // presort table by last updated
  preSort() {
    this.sort.sort(<MatSortable>{
        id: 'updatedAt',
        start: 'desc'
      }
    );
  }

  // holdings table search bar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // uses security data api to fetch real time data
  // getSecurityData() {
  //   this.db.col$<Security>(`users_data/${this.user.uid}/holdings`)
  //     .subscribe(col => {
  //       col.forEach(security => {
  //         // checks if last price is undefined or null
  //         // i.e. if the stock was just added
  //         if (security.lastPrice == null) {
  //           // console.log(security.code);
  //           this.securityData.getSecurityData(security.code)
  //             .subscribe(data => {
  //               return this.updateSecurity(security, data)
  //             },
  //             err => console.log('ERROR: failed to retrieve data for ' + security.code),
  //             () => console.log('successful for: ' + security.code)
  //           )
  //         }
  //       })
  //     })
  // }

  // simplifed attempt of above
  // still doesn't work right
  getSecurityData() {
    this.db.col$<Security>(`users_data/${this.user.uid}/holdings`)
      .switchMap(col => {
        return col;
      })
      .subscribe(security => {
        if (security.lastPrice == null) {
          this.securityData.getSecurityData(security.code)
            .subscribe(data => {
              console.log(data)
              this.updateSecurity(security, data);
            });
        }
      })
  }

  // update data in firestore
  updateSecurity(security: Security, securityData: {}) {
    let open = securityData['open'];
    let high = securityData['high'];
    let low = securityData['low'];
    let lastPrice = securityData['close'];
    let volumeDaily = securityData['volume'];

    // calculations
    let value = Number((lastPrice) * security.volume)
    let gain = ((lastPrice - security.purchasePrice) * security.volume)
    let gainAsPercentage = ((gain) * 100 / (security.purchasePrice * security.volume))

    this.db.update<Security>(`users_data/${this.user.uid}/holdings/${security.code}`, ({
      lastPrice: Number(lastPrice),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      volumeDaily: Number(volumeDaily),
      value: Number(value),
      gain: Number(gain),
      gainAsPercentage: Number(gainAsPercentage)
    }), false);
  }
}
