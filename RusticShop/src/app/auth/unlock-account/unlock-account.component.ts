import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-unlock-account',
  templateUrl: './unlock-account.component.html',
  styleUrls: ['./unlock-account.component.scss'],
})
export class UnlockAccountComponent implements OnInit {
  unlocked = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(map => {
      const username = map['Username'];
      const token = map['Token'];

      if (!username || !token) return;

      this.authService.unlockAccount({ username, token }).subscribe({
        next: res => {
          if (res.ok) {
            this.snackBar.open('Cuenta desbloqueada con éxito');
            this.unlocked = true;
            setTimeout(() => {
              this.router.navigate(['/Users/auth/login']);
            }, 2000);
          }
        },
        error: err => {
          this.snackBar.open(
            '¡Uh, Oh! No se ha podido desbloquear la cuenta, intenta de nuevo'
          );
          this.router.navigate(['Users/auth/request-account-unlock']);
          console.error(err);
        },
      });
    });
  }
}
