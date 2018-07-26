import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CsvParserService } from './../../../shared/services/csv-parser.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { Security } from './../../../shared/models/security.model';
import { AddSecurityComponent } from './../../trades/add-security/add-security.component';

@Component({
  selector: 'app-security-info',
  templateUrl: './security-info.component.html',
  styleUrls: ['./security-info.component.scss']
})
export class SecurityInfoComponent implements OnInit {

  timePeriod: string;

  securityCode: string;
  securityOpen: number;
  securityHigh: number;
  securityLow: number;
  securityVolume: number;
  securityDescriptive: string[];

  companyName: string;
  companyIndustry: string;

  constructor(
    private route: ActivatedRoute,
    private csvService: CsvParserService,
    private securityService: SecurityDataService,
    private dialog: MatDialog
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
        this.securityVolume = data['volume']
      })
  }

  openDialog() {
      const dialogRef = this.dialog.open(AddSecurityComponent, {
        width: '330px',
        height: '410px',
        data: {
          name: this.companyName,
          code: this.securityCode,
          industry: this.companyIndustry,
          price: this.securityOpen
        }
      });

      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   this.animal = result;
      // });
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
