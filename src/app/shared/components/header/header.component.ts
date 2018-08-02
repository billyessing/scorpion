import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app'
import { AuthService } from './../../auth/auth.service';
import { SidebarService } from './../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggleOpen: boolean;
  // @Output() toggleEvent = new EventEmitter<boolean>();


  constructor(
    public auth: AuthService,
    public sb: SidebarService) { }

  ngOnInit() {
    // setInterval(() => console.log(firebase.auth().currentUser), 5000);
    this.sb.toggleStatus.subscribe(toggle => this.toggleOpen = toggle)
  }

  logout() {
    this.auth.signOut()
  }

  toggleSidebar() {
    console.log(this.toggleOpen);
    this.toggleOpen = !this.toggleOpen;
    // this.toggleEvent.emit(this.toggleOpen);
    this.sb.toggle(this.toggleOpen);
  }

}
