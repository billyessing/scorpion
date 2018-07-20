import { Component, OnInit } from '@angular/core';
import { SecurityDataService } from './../../../shared/services/security-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private securityData: SecurityDataService) {

  }

  ngOnInit() {

  }

}
