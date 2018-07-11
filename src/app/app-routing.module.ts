import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/pages/home/home.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [

    ]
  })
export class AppRoutingModule { }
