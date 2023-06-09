import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BaseFormComponent } from '../../shared/components/base-form.component';
import { RegistrationRequest } from './registration-request';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { RegistrationResponse } from './registration-response';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends BaseFormComponent implements OnInit {
  registrationResponse?: RegistrationResponse;
  hidePassword = true;
  hideConfirmPassword = true;
  isBusy = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  public get hasErrors() {
    return this.form.errors != null;
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(
        '',
        [Validators.required, Validators.minLength(8)],
        this.isUserAvailable()
      ),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        this.isEmailAvailable()
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.validatePassword,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        CustomValidators.matchField('password'),
      ]),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const registrationRequest = <RegistrationRequest>{};

    registrationRequest.username = this.form.controls['username'].value;
    registrationRequest.email = this.form.controls['email'].value;
    registrationRequest.password = this.form.controls['password'].value;
    registrationRequest.confirmPassword =
      this.form.controls['confirmPassword'].value;

    this.isBusy = true;

    this.authService.register(registrationRequest).subscribe({
      next: res => {
        this.registrationResponse = res;
        if (res.success) {
          this.snackBar.open(
            'Cuenta creada con éxito, revisa tu correo electrónico.'
          );
          this.router.navigate(['/']);
        }
      },
      error: error => {
        this.snackBar.open('Ha ocurrido un error.');
        if (error.status === 400) {
          this.registrationResponse = error.error;
        }
      },
      complete: () => {
        this.isBusy = false;
      },
    });
  }

  isUserAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const request = this.authService.isUserNameAvailable(control.value);
      const piped = request.pipe(
        map(available => {
          return !available ? { usernameNotAvailable: true } : null;
        })
      );

      return piped;
    };
  }

  isEmailAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const request = this.authService.isEmailAvailable(control.value);
      const piped = request.pipe(
        map(available => {
          return !available ? { emailNotAvailable: true } : null;
        })
      );

      return piped;
    };
  }
}
