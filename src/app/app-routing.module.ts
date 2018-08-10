import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/pages/home/home.component';
import { FriendsComponent } from './core/pages/friends/friends.component';
import { ViewProfileComponent } from './core/pages/view-profile/view-profile.component';
import { SecurityInfoComponent } from './core/pages/security-info/security-info.component';
import { LoginComponent } from './core/pages/login/login.component';
import { SignupComponent } from './core/pages/signup/signup.component';

import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
    {
      path: 'home',
      component: HomeComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'friends',
      component: FriendsComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'signup',
      component: SignupComponent
    },
    {
      path: 'share/:securityCode',
      component: SecurityInfoComponent
    },
    {
      path: 'view-profile/:username',
      component: ViewProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [

    ]
  })
export class AppRoutingModule { }
