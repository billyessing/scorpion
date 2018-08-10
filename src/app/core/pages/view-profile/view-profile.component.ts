import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { AuthService } from './../../../shared/auth/auth.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { Observable } from 'rxjs';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  username: string;
  user: Observable<User[]>;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private db: FirestoreService
  ) {
    this.route.params
      .subscribe(params => {
        this.username = params.username
      });
  }

  ngOnInit() {
    this.user = this.db.col$<User>(`user_details`, ref => ref.where('username', '==', this.username))
  }

  onAdd() {
    this.db.col$<User>(`user_details`, ref => ref.where('username', '==', this.username))
      .subscribe(userToAdd => {
        return this.addUser(userToAdd[0])
      })
  }

  addUser(userToAdd: User) {
    this.auth.user
      .subscribe(user => {
        this.db.set(`user_friends/${user.uid}/friends/${userToAdd.uid}`, userToAdd);
      })
  }

}
