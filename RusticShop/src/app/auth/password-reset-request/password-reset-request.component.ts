import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { BaseFormComponent } from 'src/app/base-form.component';
import PasswordResetRequest from './password-reset-request';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent extends BaseFormComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    super();
    
    this.form = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email
      ])
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.authService.requestPasswordReset({
      email: this.form.controls['email'].value
    }).subscribe({
      next: res => {
        this.router.navigate(['/']);
      },
      error: error => console.error(error)
    });
  }
}
