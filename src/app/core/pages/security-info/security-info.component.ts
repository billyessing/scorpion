import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CsvParserService } from './../../../shared/services/csv-parser.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { Security } from './../../../shared/models/security.model';
import { AddSecurityComponent } from './../../trades/add-security/add-security.component';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-security-info',
  templateUrl: './security-info.component.html',
  styleUrls: ['./security-info.component.scss']
})
export class SecurityInfoComponent implements OnInit {

  theme = 'scorpion-theme-dark';

  timePeriod: string;

  securityCode: string;
  securityOpen: number;
  securityHigh: number;
  securityLow: number;
  securityClose: number;
  securityVolume: number;
  securityDescriptive: string[];

  companyName: string;
  companyIndustry: string;

  constructor(
    private route: ActivatedRoute,
    private csvService: CsvParserService,
    private securityService: SecurityDataService,
    private dialog: MatDialog,
    private overlayContainer: OverlayContainer
  ) {
    this.route.params
      .subscribe(params => {
        this.securityCode = params.securityCode
      });
  }

  ngOnInit() {
    this.getSecurityDescriptive();
    this.getSecurityData();
  }

  getSecurityDescriptive() {
    this.csvService.getSecurityDescriptive(this.securityCode)
      .subscribe(data => {
        this.companyName = data['name'];
        this.companyIndustry = data['industry'];
      })
  }

  getSecurityData() {
    this.securityService.getSecurityData(this.securityCode)
      .subscribe(data => {
        this.securityOpen = data['open']
        this.securityHigh = data['high']
        this.securityLow = data['low']
        this.securityClose = data['close']
        this.securityVolume = data['volume']
      },
      err => console.log("could not fetch daily data...")
    )
  }

  openDialog() {
      const dialogRef = this.dialog.open(AddSecurityComponent, {
        width: '330px',
        height: '410px',
        data: {
          name: this.companyName,
          code: this.securityCode,
          industry: this.companyIndustry,
          price: this.securityClose
        }
      });

      // dialogRef.afterClosed().subscribe(result => { });
    }

  imageExists(imgUrl) {
    let img = new Image();
    img.src = imgUrl;
    return (img.height != 0);
  }

  getImage(code: string): string {
    let imgUrl = 'https://www.asx.com.au/asx/1/image/logo/' + code + '?image_size=L&v=1382327267000'
    return imgUrl;
  }
}
