import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/pages/home/home.component';
import { SecurityInfoComponent } from './core/pages/security-info/security-info.component';

const routes: Routes = [
    {
      path: 'home',
      component: HomeComponent
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
