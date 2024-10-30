import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  sendEmailResetPassword(userEmail: string): Observable<any> {
    console.log('sendEmailResetPassword', userEmail);
    return this.http.post<any>(`${this.apiUrl}/auth/request-password-reset`, {
      email: userEmail,
    });
  }

  validateToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/password/edit`, {
      token: token,
    });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, {
      token: token,
      password: password,
    });
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      return of(false);
    }
    // Check token expiration
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    const isTokenValid = tokenPayload.email ? true : false;
    return of(isTokenValid);
  }

  isTokenExpired(): boolean {
    const token = this.tokenService.getAccessToken();
    if (!token) return true;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= tokenPayload.exp * 1000;
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
        },
      }
    );
  }

  isRefreshTokenExpired(): Observable<boolean> {
    return this.http
      .get<any>(`${this.apiUrl}/auth/check-refresh-token`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          console.log(response);
          if (response.expired) {
            // this.tokenService.clearTokens();
            // this.router.navigate(['/login']);
            return true;
          }
          return false;
        }),
        catchError(() => {
          // this.tokenService.clearTokens();
          // this.router.navigate(['/login']);
          return of(true);
        })
      );
  }

  getDataFromAccessToken(): Observable<any> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return of(null);
    }
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return of(tokenPayload);
  }
}
