import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from './../../../shared/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    // this.auth.user
    //   .subscribe(res => {
    //     console.log(res);
    //     console.log(res['email'])
    //   })
  }
}
