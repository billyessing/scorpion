import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this.auth.isAuthenticated()) {
        return true;
      } else {
        console.log('access denied...');
        this.router.navigate(['/login']);
      }

      // return this.auth.user.pipe(
      //   map(user => !!user),
      //   take(1),
      //   tap(loggedIn => {
      //     console.log(loggedIn);
      //     if (!loggedIn) {
      //       console.log('access denied...');
      //       this.notify.update('You must be logged in!', 'error');
      //       this.router.navigate(['/login']);
      //     }
      //   })
      // );
  }

}
