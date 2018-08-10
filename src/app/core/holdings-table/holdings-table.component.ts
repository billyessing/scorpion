import { Component, AfterViewInit, OnInit, ViewChild, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';

import { Observable } from 'rxjs';
import { map, take, filter, scan, delay, throttleTime } from 'rxjs/operators';

import { ExistingSecurityComponent } from './../trades/existing-security/existing-security.component';
import { FirestoreService } from './../../shared/services/firestore.service';
import { SecurityDataService } from './../../shared/services/security-data.service';
import { AuthService } from './../../shared/auth/auth.service';
import { Security } from './../../shared/models/security.model';
import { User } from './../../shared/models/user.model';


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

  @Input() user: Observable<User>;
  username: string;

  dataSource: MatTableDataSource<Security>;
  displayedColumns = ['code', 'purchasePrice', 'lastPrice', 'volume', 'value', 'gain', 'gainAsPercentage', 'updatedAt'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalVolume = 0;
  totalValue = 0;
  totalGain = 0;
  totalGainAsPercentage = 0;

  constructor(
    private db: FirestoreService,
    private sds: SecurityDataService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getUserData();
    this.preSort();
  }

  getUserData() {
    if (!this.user) {
      this.auth.user.subscribe(user => {
        if (user) {
          this.getPortfolio(user.uid);
        }
      });
    }

    // view another users profile
    else {
      this.user.subscribe(userDetails => {
        this.username = userDetails[0].username;
        this.getPortfolio(userDetails[0].uid);
      });
    }
  }

  getPortfolio(uid: string) {
    this.db.col$<Security>(`user_holdings/${uid}/holdings`)
      .take(1)
      .subscribe(holdings => {
        return this.updatePortfolio(uid, holdings);
      })

  }

  updatePortfolio(uid: string, holdings) {
    holdings.forEach(security => {
      this.sds.getSecurityData(security.code)
        .subscribe(updatedData => {
          this.updateSecurity(uid, security, updatedData)
        })

      this.totalVolume += security.volume;
      this.totalValue += security.value;
      this.totalGain += security.gain;
      this.totalGainAsPercentage =
        ((this.totalValue - (this.totalValue - this.totalGain)) * 100) / (this.totalValue - this.totalGain);

      // TODO: is there a less expensive way of doing this
      this.fillTable(uid)
    })

    this.updatePerformance(uid, ({
      volume: this.totalVolume,
      value: this.totalValue,
      gain: this.totalGain,
      gainAsPercentage: this.totalGainAsPercentage
    }));
  }

  fillTable(uid) {
    this.db.col$<Security>(`user_holdings/${uid}/holdings`)
      .take(1)
      .subscribe(holdings => {
        this.dataSource = new MatTableDataSource(holdings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  // update data in firestore
  updateSecurity(uid: string, security: Security, securityData: any) {
    let open = securityData['open'];
    let high = securityData['high'];
    let low = securityData['low'];
    let lastPrice = securityData['close'];
    let volumeDaily = securityData['volume'];

    // calculations
    let value = Number((lastPrice) * security.volume)
    let gain = ((lastPrice - security.purchasePrice) * security.volume)
    let gainAsPercentage = ((gain) * 100 / (security.purchasePrice * security.volume))

    this.db.update<Security>(`user_holdings/${uid}/holdings/${security.code}`, ({
      lastPrice: Number(lastPrice),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      volumeDaily: Number(volumeDaily),
      value: Number(value),
      gain: Number(gain),
      gainAsPercentage: Number(gainAsPercentage)
    }));
  }

  updatePerformance(uid: string, performance: any) {
    this.db.set(`user_performance/${uid}`, { performance });
  }

  // presort table by last updated
  preSort() {
    this.sort.sort(<MatSortable>{
      id: 'updatedAt',
      start: 'desc'
    });
  }

  // holdings table search bar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
