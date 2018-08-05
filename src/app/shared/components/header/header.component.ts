import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app'
import { AuthService } from './../../auth/auth.service';
import { SettingsService } from './../../services/settings.service';
import { FirestoreService } from './../../services/firestore.service';
import { User } from './../../models/user.model';
import 'rxjs/Rx';
import { map, take, tap, filter, scan, switchMap } from 'rxjs/operators';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggleOpen: boolean;
  theme: string;
  user;

  constructor(
    private auth: AuthService,
    private settingsService: SettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.auth.user.subscribe(user => this.user = user['email']);

    this.getDisplayName();

    this.settingsService.themeSetting.subscribe(theme => this.theme = theme);
    this.settingsService.toggleStatus.subscribe(toggle => this.toggleOpen = toggle)
  }

  setTheme(theme: string) {
    this.theme = 'scorpion-theme-' + theme;
    this.settingsService.changeTheme(this.theme);
  }

  toggleSidebar() {
    this.toggleOpen = !this.toggleOpen;
    this.settingsService.toggle(this.toggleOpen);
  }

  getDisplayName() {
    this.auth.user.subscribe(user => {
      if (user) {
        if (user['username']) {
          this.user = user['username'];
        } else {
          this.user = user['firstName'] + ' ' + user['lastName'];
        }
      } else {
        this.user = '';
      }
    })
  }

  login() {
    this.router.navigateByUrl('/home');
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.auth.signOut()
  }

}
