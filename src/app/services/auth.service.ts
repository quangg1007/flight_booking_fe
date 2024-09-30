import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient, private tokenService: TokenService) {}

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
    const isTokenValid = Date.now() < tokenPayload.exp * 1000;
    return of(isTokenValid);
  }
}
