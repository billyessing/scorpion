import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from './../../../shared/auth/auth.service';

type UserFields = 'emailOrUsername' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild(FormGroupDirective) fgDirective;

  userForm: FormGroup;
  passwordReset = false;
  formErrors: FormErrors = {
    'emailOrUsername': '',
    'password': ''
  };
  validationMessages = {
    'emailOrUsername': {
      'required': 'Email or username is required'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password include one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.'
    }
  };

  ngOnInit() {
    this.buildForm();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService
  ) { }

  // Social logins

  async signInWithGithub() {
    await this.auth.githubLogin();
    return await this.afterSignIn();
  }

  async signInWithGoogle() {
    await this.auth.googleLogin();
    return await this.afterSignIn();
  }

  async signInWithFacebook() {
    await this.auth.facebookLogin();
    return await this.afterSignIn();
  }

  async signInWithTwitter() {
    await this.auth.twitterLogin();
    return await this.afterSignIn();
  }

  // Email and password

  async login() {
    await this.auth.emailLogin(this.userForm.value['emailOrUsername'], this.userForm.value['password']);
    return await this.afterSignIn();
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['emailOrUsername'])
      .then(() => this.passwordReset = true);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'emailOrUsername': ['', [
        Validators.required,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });
  }

  // Shared

  private afterSignIn() {
    // Do after login stuff here.
    return this.router.navigate(['/home']);
  }
}
