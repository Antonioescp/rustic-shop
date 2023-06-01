import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import PasswordResetData from './password-reset-data';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent
  extends BaseFormComponent
  implements OnInit
{
  username!: string;
  token!: string;
  hidePassword = true;
  hideConfirmPassword = true;
  isBusy = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();

    // TODO agregar verificaciones Async para asegurarse de que la contrase;a es correcta
    this.form = new FormGroup({
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.validatePassword,
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        CustomValidators.matchField('password'),
      ]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(map => {
      this.username = map['Username'];
      this.token = map['Token'];
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isBusy = true;

    const request = <PasswordResetData>{
      password: this.form.controls['password'].value,
      confirmPassword: this.form.controls['confirmPassword'].value,
      username: this.username,
      token: this.token,
    };

    console.dir(request, { depth: null, colors: true });

    this.authService.resetPassword(request).subscribe({
      next: res => {
        this.isBusy = false;
        if (res.ok) {
          this.router.navigate(['/Users/auth/login']);
          this.snackBar.open('Contraseña restablecida con éxito.');
        }
      },
      error: err => {
        this.isBusy = false;
        this.snackBar.open(
          'La contraseña no se ha podido restablecer, intenta de nuevo'
        );
        this.router.navigate(['Users/auth/request-password-reset']);
        console.error(err);
      },
    });
  }
}
