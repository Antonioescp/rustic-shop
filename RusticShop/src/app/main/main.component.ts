import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    public auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/Users/auth/login');
    this.snackBar.open('Sesión cerrada con éxito');
  }
}
