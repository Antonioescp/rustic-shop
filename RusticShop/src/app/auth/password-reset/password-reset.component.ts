import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { BaseFormComponent } from 'src/app/base-form.component';
import PasswordResetData from './password-reset-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends BaseFormComponent implements OnInit {

  username!: string;
  token!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();

    // TODO agregar verificaciones Async para asegurarse de que la contrase;a es correcta
    this.form = new FormGroup({
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        // TODO(Add validator for type of characters required)
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        // TODO(Add validator for matching fields)
      ])
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe( map => {
      this.username = map['Username'];
      this.token = map['Token'];
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const request = <PasswordResetData>{
      password: this.form.controls['password'].value,
      confirmPassword: this.form.controls['confirmPassword'].value,
      username: this.username,
      token: this.token
    };

    console.dir(request, { depth: null, colors: true });

    this.authService.resetPassword(request).subscribe({
      next: res => {
        if (res.ok) {
          this.router.navigate(['/']);
        }
      },
      error: err => console.error(err)
    });
  }

}
