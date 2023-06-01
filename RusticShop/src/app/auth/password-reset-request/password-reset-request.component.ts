import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
})
export class PasswordResetRequestComponent extends BaseFormComponent {
  isBusy = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();

    this.form = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isBusy = true;

    const email: string = this.form.controls['email'].value;

    this.authService
      .requestPasswordReset({
        email,
      })
      .subscribe({
        next: () => {
          this.isBusy = false;
          this.snackBar.open(
            `Restablecimiento de contraseña enviado a ${email}.`
          );
          this.router.navigate(['/']);
        },
        error: error => {
          console.error(error);
          this.snackBar.open(`Ha ocurrido un error, intenta de nuevo.`);
          this.isBusy = false;
        },
      });
  }
}
