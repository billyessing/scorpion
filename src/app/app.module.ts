// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireFunctionsModule } from 'angularfire2/functions';


import { AuthModule } from './shared/auth/auth.module';

//Angular Material Components
import {
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatStepperModule,
  MatTabsModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule } from '@angular/material';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './core/pages/home/home.component';
import { SecurityInfoComponent } from './core/pages/security-info/security-info.component';
import { PieChartComponent } from './core/charts/pie-chart/pie-chart.component';
import { SearchBoxComponent } from './core/search-box/search-box.component';
import { LineChartComponent } from './core/charts/line-chart/line-chart.component';
import { AddSecurityComponent } from './core/trades/add-security/add-security.component';
import { HoldingsTableComponent } from './core/holdings-table/holdings-table.component';
import { NewSecurityComponent } from './core/trades/new-security/new-security.component';
import { ExistingSecurityComponent } from './core/trades/existing-security/existing-security.component';
import { LoginComponent } from './core/pages/login/login.component';

// Services
import { FirestoreService } from './shared/services/firestore.service';
import { SettingsService } from './shared/services/settings.service';

// Other
import { environment } from '../environments/environment';
import { CdkDetailRowDirective } from './core/holdings-table/cdk-detail-row.directive';
import { CompareDirective } from './core/pages/signup/compare.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { SignupComponent } from './core/pages/signup/signup.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FriendsComponent } from './core/pages/friends/friends.component';
import { ViewProfileComponent } from './core/pages/view-profile/view-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HoldingsTableComponent,
    NewSecurityComponent,
    ExistingSecurityComponent,
    SecurityInfoComponent,
    PieChartComponent,
    SearchBoxComponent,
    LineChartComponent,
    AddSecurityComponent,
    LoginComponent,
    SignupComponent,
    CdkDetailRowDirective,
    CompareDirective,
    SidebarComponent,
    FriendsComponent,
    ViewProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    OverlayModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AuthModule,
  ],
  providers: [
    FirestoreService,
    SettingsService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ExistingSecurityComponent,
    HoldingsTableComponent,
    AddSecurityComponent
  ]
})
export class AppModule { }
