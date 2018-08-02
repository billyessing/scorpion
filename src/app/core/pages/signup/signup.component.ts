import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroupDirective, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './../../../shared/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  userForm: FormGroup;
  isNonLinear = false;
  isNonEditable = false;
  hide = true

  namesForm: FormGroup;
  emailAndPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.namesForm = this.fb.group({
      firstNameFormCtrl: ['',
        Validators.required
      ],
      lastNameFormCtrl: ['',
        Validators.required
      ],
      usernameFormCtrl: ['',
        // Validators.required
      ]
    });

    this.emailAndPasswordForm = this.fb.group({
      emailFormCtrl: ['',
        Validators.required
      ],
      passwordFormCtrl: ['',
        Validators.required
      ],
      confirmPasswordFormCtrl: ['',
        Validators.required
      ]
    })
  }

  signup() {
    this.auth.emailSignUp(
      this.emailAndPasswordForm.value['emailFormCtrl'],
      this.emailAndPasswordForm.value['passwordFormCtrl'],
      this.namesForm.value
    );
  }
}
