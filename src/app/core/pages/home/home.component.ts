import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from './../../../shared/auth/auth.service';
import { SettingsService } from './../../../shared/services/settings.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase/app'
import { map, take, tap, filter, scan, switchMap } from 'rxjs/operators';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: firebase.User;

  constructor(
    private auth: AuthService,
    private settingsService: SettingsService,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.applyUserSettings();
  }

  applyUserSettings() {
    this.user = firebase.auth().currentUser;

    this.db.doc$(`user_settings/${this.user.uid}`)
      .subscribe(theme => {
        if (theme) {
          this.settingsService.changeTheme(theme['theme']);
        }
    })
  }

}
