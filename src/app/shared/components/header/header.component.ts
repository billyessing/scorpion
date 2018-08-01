import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
    // setInterval(() => console.log(firebase.auth().currentUser), 5000);
  }

  logout() {
    this.auth.signOut()
  }

}
