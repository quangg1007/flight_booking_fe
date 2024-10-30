import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { userService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  navItems = [
    { path: 'profile', icon: 'account_circle', label: 'Profile' },
    { path: 'bookings', icon: 'airplane_ticket', label: 'My Bookings' },
    {
      path: 'payment-methods',
      icon: 'credit_card',
      label: 'Payment Methods',
    },
  ];

  constructor(
    private userService: userService,
    private tokenService: TokenService
  ) {}
  logout() {
    const token = this.tokenService.getAccessToken();
    let tokenPayload;
    if (token) {
      tokenPayload = JSON.parse(atob(token.split('.')[1]));
    }
    const email = tokenPayload.email;
    console.log(tokenPayload);
    this.userService
      .logout(email)
      .pipe(
        tap(() => {
          this.tokenService.clearTokens();
          window.location.reload();
        })
      )
      .subscribe();
  }
}
