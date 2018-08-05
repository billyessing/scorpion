import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from './../models/user.model';
import { FirestoreService } from './firestore.service';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  user: firebase.User;

  // default settings
  private toggleOpen = new BehaviorSubject(false);
  private theme = new BehaviorSubject('scorpion-theme-light');

  toggleStatus = this.toggleOpen.asObservable();
  themeSetting = this.theme.asObservable();

  constructor(private db: FirestoreService) { }

  changeTheme(themeChange: string) {

    this.theme.next(themeChange);

    // update user preference
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.db.update(`users_data/${this.user.uid}/settings/theme_setting`, {theme: themeChange})
        .catch(() => {
          // new user...
          this.db.set(`users_data/${this.user.uid}/settings/theme_setting`, {theme: themeChange});
        })
    }
  }

  toggle(toggleChange: boolean) {
    this.toggleOpen.next(toggleChange);
  }

}
