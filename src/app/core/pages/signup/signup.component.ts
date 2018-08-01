import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroupDirective, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

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

  nameFormGroup: FormGroup;
  emailFormGroup: FormGroup;

  steps = [
    {label: 'Confirm your name', content: 'Last name, First name.'},
    {label: 'Confirm your contact information', content: '123-456-7890'},
    {label: 'Confirm your address', content: '1600 Amphitheater Pkwy MTV'},
    {label: 'You are now done', content: 'Finished!'}
  ];

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.userForm.get('formArray'); }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          firstNameFormCtrl: ['',
            Validators.required
          ],
          lastNameFormCtrl: ['',
            Validators.required
          ],
          usernameFormCtrl: ['', ]
        }),
        this.fb.group({
          emailFormCtrl: ['',
            // Validators.required,
            Validators.email
          ]
        }),
        // others...
      ])
    });

    this.nameFormGroup = this.fb.group({
      firstNameCtrl: ['',
        Validators.required
      ],
      lastNameCtrl: ['',
        Validators.required
      ],
      usernameNameCtrl: ['',

      ]
    });

    this.emailFormGroup = this.fb.group({
      emailCtrl: ['',
        // Validators.required,
        Validators.email
      ]
    })
  }

  signup() {
    console.log(this.userForm.value['formArray'][0]['firstNameFormCtrl']);
    console.log(this.userForm.value['formArray'][1]['emailFormCtrl']);

    // this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password']);
  }

}
