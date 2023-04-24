import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-unlock-account',
  templateUrl: './unlock-account.component.html',
  styleUrls: ['./unlock-account.component.scss']
})
export class UnlockAccountComponent implements OnInit {
  unlocked: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(map => {
      const username = map['Username'];
      const token = map['Token'];

      if (!username || !token) return;

      this.authService.unlockAccount({ username, token }).subscribe({
        next: res => {
          if (res.ok) {
            this.unlocked = true;
            this.router.navigate(['/Users/auth/login']);
          }
        },
        error: err => console.error(err)
      });
    });
  }
}
