import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/components/base-form.component';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseFormComponent {
  title?: string;
  loginResponse?: LoginResponse;
  accountLocked = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    super();
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    const loginRequest = <LoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;

    this.authService.login(loginRequest).subscribe({
      next: result => {
        this.loginResponse = result;
        if (result.success) {
          this.snackBar.open('Sesión iniciada con éxito');
          this.router.navigate(['/']);
        }
      },
      error: error => {
        console.log(error);

        this.form.reset();

        if (
          error.status === HttpStatusCode.Unauthorized ||
          error.status === HttpStatusCode.BadRequest
        ) {
          this.loginResponse = error.error;
        }

        if (error.status === HttpStatusCode.Unauthorized) {
          this.accountLocked = true;
        }
      },
    });
  }
}
