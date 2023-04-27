import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { BaseFormComponent } from '../../shared/components/base-form.component';
import { RegistrationRequest } from './registration-request';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { RegistrationResponse } from './registration-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends BaseFormComponent implements OnInit {

  registrationResponse?: RegistrationResponse

  constructor(
    private authService: AuthService,
    private router: Router
  ) { super(); }

  public get hasErrors() {
    return this.form.errors != null;
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    }, { validators: [
      CustomValidators.matchFields('password', 'confirmPassword')
    ]});
  }

  onSubmit() {
    var registrationRequest = <RegistrationRequest>{};

    if (this.form.invalid) {
      console.error('invalid form');
      return;
    }

    registrationRequest.username = this.form.controls['username'].value;
    registrationRequest.email = this.form.controls['email'].value;
    registrationRequest.password = this.form.controls['password'].value;
    registrationRequest.confirmPassword = this.form.controls['confirmPassword'].value;

    this.authService.register(registrationRequest).subscribe({
      next: (res) => {
        this.registrationResponse = res;
        if (res.success) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        if (error.status === 400) {
          this.registrationResponse = error.error;
        }
      }
    });
  }

}
