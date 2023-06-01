import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import RequestAccountUnlockRequest from './request-account-unlock-request';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-account-unlock',
  templateUrl: './request-account-unlock.component.html',
  styleUrls: ['./request-account-unlock.component.scss'],
})
export class RequestAccountUnlockComponent extends BaseFormComponent {
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

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isBusy = true;

    const data = <RequestAccountUnlockRequest>{
      email: this.form.controls['email'].value,
    };

    this.authService.requestAccountUnlock(data).subscribe({
      next: res => {
        this.isBusy = false;
        if (res.ok) {
          this.snackBar.open('Solicitud enviada, revisa tu correo electrónico');
          this.router.navigate(['/Users/auth/login']);
        }
      },
      error: err => {
        this.isBusy = false;
        this.snackBar.open(
          '¡Uh, Oh! Ocurrió un error, la solicitud no pudo ser generada, intenta de nuevo.'
        );
        this.router.navigate(['/Users/auth/request-account-unlock']);
        console.error(err);
      },
    });
  }
}
