import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CsvParserService } from './../../../shared/services/csv-parser.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { Security } from './../../../shared/models/security.model';

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
    private securityService: SecurityDataService
  ) {
    this.route.params
      .subscribe(params => {
        this.securityCode = params.securityCode
      });
  }

  ngOnInit() {
    this.timePeriod = '1day';

    this.csvService.getSecurityDescriptive(this.securityCode)
      .subscribe(data => {
        this.companyName = data['name'];
        this.companyIndustry = data['industry'];
      })

    this.securityService.getSecurityData(this.securityCode)
      .subscribe(data => {
        this.securityOpen = data['open']
        this.securityHigh = data['high']
        this.securityLow = data['low']
        this.securityVolume = data['volume']
      })
  }

  onValueChange(value: string) {
    this.timePeriod = value;
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

  flag: boolean = false;

  updateFlag() {
    console.log("hello...")
    this.flag = true
  }
}
