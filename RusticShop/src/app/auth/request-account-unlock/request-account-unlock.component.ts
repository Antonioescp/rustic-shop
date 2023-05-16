import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import RequestAccountUnlockRequest from './request-account-unlock-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-account-unlock',
  templateUrl: './request-account-unlock.component.html',
  styleUrls: ['./request-account-unlock.component.scss'],
})
export class RequestAccountUnlockComponent extends BaseFormComponent {
  constructor(private authService: AuthService, private router: Router) {
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

    const data = <RequestAccountUnlockRequest>{
      email: this.form.controls['email'].value,
    };

    this.authService.requestAccountUnlock(data).subscribe({
      next: (res) => {
        if (res.ok) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => console.error(err),
    });
  }
}
