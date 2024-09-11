import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  get currentUser() {
    return of({ username: 'Minh Quang' });
  }

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
}
