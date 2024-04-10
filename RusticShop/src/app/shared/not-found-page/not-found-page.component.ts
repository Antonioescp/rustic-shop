import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent {
  constructor(private router: Router, private auth: AuthService) {}

  get destination(): string {
    return this.auth.isAdmin
      ? 'panel de administración'
      : 'pagina de inicio de sesión';
  }

  get destinationLink(): string {
    return this.auth.isAdmin ? '/admin/panel' : '/Users/auth/login';
  }
}
