import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models';

@Injectable()
export class userService {
  private apiUrl = 'http://localhost:8081/api';
  public $refreshToken = new Subject<boolean>();
  public $refreshTokenReceived = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  validateEmail(email: string): Observable<boolean> {
    console.log('Trigger API call');
    return this.checkEmailExists(email).pipe(
      map((user: UserModel) => !!user),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  checkEmailExists(email: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/users/search`, {
      params: { email: email },
    });
  }

  register(user: UserModel): Observable<any> {
    return this.http.post<UserModel>(`${this.apiUrl}/auth/register`, user);
  }

  login(user: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user, {
      withCredentials: true,
    });
  }

  logout(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, email, {
      withCredentials: true,
    });
  }
  getUserByEmail(email: string) {
    return this.http.get<UserModel>(`${this.apiUrl}/users/search`, {
      params: { email: email },
    });
  }
}
