import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/pages/home/home.component';
import { SecurityInfoComponent } from './core/pages/security-info/security-info.component';
import { LoginComponent } from './core/pages/login/login.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { SignupComponent } from './core/pages/signup/signup.component';

const routes: Routes = [
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard]
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [

    ]
  })
export class AppRoutingModule { }
