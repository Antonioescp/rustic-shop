import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(public auth: AuthService, private snackBar: MatSnackBar) {}

  logout() {
    this.auth.logout();
    this.snackBar.open('Sesión cerrada con éxito');
  }
}
