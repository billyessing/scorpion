import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../shared/auth/auth.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friends: User[];
  friendsPerformance = [];

  constructor(
    private auth: AuthService,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.getFriends(user.uid)
    })
  }

  getFriends(uid: string) {
    this.db.col$<User>(`user_friends/${uid}/friends`)
      .subscribe(friends => {

        this.friends = friends;
        return this.getPerformance(friends);

      })
  }

  getPerformance(friends) {
    friends.forEach(friend => {
      this.db.doc$(`user_performance/${friend.uid}`)
        .subscribe(performance => {
          console.log(this.friendsPerformance);
          this.friendsPerformance.push({
            username: friend.username,
            name: friend.firstName ? friend.firstName + ' ' + friend.lastName : friend.username,
            value: JSON.stringify(performance['performance']['value']),
            gain: JSON.stringify(performance['performance']['gain']),
            gainAsPercentage: JSON.stringify(performance['performance']['gainAsPercentage'])
          })
        })
    })

  }
}
