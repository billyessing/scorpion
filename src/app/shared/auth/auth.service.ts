import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import { firebase } from '@firebase/database';
import * as firebase from 'firebase/app'
// import { firebase } from '@firestore/app';
import { auth } from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

import { User } from './../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null>;
  token: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  // OAuth Methods

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        // this.getToken();
        this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  // Email / Password auth

  emailSignUp(email: string, password: string, userDetails: any) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential.user, userDetails);

        // TODO: is there a cleaner way to do this?
        return this.router.navigate(['/home']);
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        // this.getToken();
        this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  // Sends email allowing user to reset
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .catch(error => this.handleError(error));
  }

  signOut() {
    this.token = null;
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user, userDetails?) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    let firstName = null;
    let lastName = null;
    let username = null;

    if (user.username) {
      username = user.username;
    } else if (userDetails) {
      firstName = userDetails.firstNameFormCtrl;
      lastName = userDetails.lastNameFormCtrl;
      username = userDetails.usernameFormCtrl;
    }

    const data: User = {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName == null ? null : firstName,
      lastName: user.lastName == null ? null : lastName,
      username: username
    }

    return userRef.set(data, { merge: true })
  }

  isAuthenticated() {
    return this.afAuth.auth.currentUser != null;
  }

}
