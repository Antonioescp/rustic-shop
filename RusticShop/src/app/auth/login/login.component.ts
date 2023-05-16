import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { BaseFormComponent } from '../../shared/components/base-form.component';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { HttpStatusCode } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  title?: string;
  loginResponse?: LoginResponse;
  accountLocked: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    var loginRequest = <LoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;

    this.authService.login(loginRequest).subscribe({
      next: (result) => {
        this.loginResponse = result;
        if (result.success) {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
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
