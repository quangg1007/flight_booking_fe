import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models';

@Injectable()
export class userService {
  private apiUrl = 'http://localhost:8080/api';
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
    return this.http.post(`${this.apiUrl}/auth/login`, user);
  }

  getRefreshToken() {
    let loggedUserData: any;
    const localData = localStorage.getItem('tookenData');
    if (localData != null) {
      loggedUserData = JSON.parse(localData);
    }
    const obj = {
      emailId: localStorage.getItem('tookenEmail'),
      token: '',
      refreshToken: loggedUserData.refreshToken,
    };
    this.http.post(`${this.apiUrl}/users`, obj).subscribe((Res: any) => {
      localStorage.setItem('tookenData', JSON.stringify(Res.data));
      this.$refreshTokenReceived.next(true);
    });
  }

  getUsers() {
    // return this.http.get("https://freeapi.gerasim.in/api/JWT/GetAllUsers")
  }
}
