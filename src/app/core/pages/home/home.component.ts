import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from './../../../shared/auth/auth.service';
import { SettingsService } from './../../../shared/services/settings.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase/app'
import { map, take, tap, filter, scan, switchMap } from 'rxjs/operators';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private settingsService: SettingsService,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.auth.user
      .subscribe(user => {
        if (user) {
          this.applyUserSettings(user.uid);
        }
    });
  }

  // TODO: on refresh theme reverts back to deafault
  // if user is on a different page
  applyUserSettings(uid: string) {
    this.db.doc$(`user_settings/${uid}`)
      .subscribe(theme => {
        if (theme) {
          this.settingsService.changeTheme(theme['theme']);
        }
    })
  }

}
