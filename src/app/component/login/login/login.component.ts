import { Component, OnDestroy, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'src/app/util/auth';
import { UserModel } from 'src/app/models';
import { userService } from 'src/app/services/user.service';

import { validateForm } from 'src/app/util/validation';
import { TokenService } from 'src/app/services/token.service';
import { LoginResponse } from 'src/app/models/auth.model';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { TimezoneService } from 'src/app/services/timezone.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formSubmit$ = new Subject<any>();
  loginForm!: FormGroup;
  commonError: string = '';
  destroy$ = new Subject<void>();

  isAuth: boolean = false;
  isAuthChanged = output<boolean>();

  constructor(
    private _fb: FormBuilder,
    private userService: userService,
    private tokenService: TokenService,
    private timezoneService: TimezoneService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.formSubmit$
      .pipe(
        tap(() => this.loginForm.markAsDirty()),
        switchMap(() => validateForm(this.loginForm)),
        filter((isValid) => isValid),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.submitForm());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    console.log('Submit form');

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const user: UserModel = {
      email,
      password,
    };

    this.userService
      .login(user)
      .pipe(
        map((res: LoginResponse) => {
          console.log(res);
          if (res.accessToken && res.isAdmin && res.timezone) {
            // Save the user data to local storage
            this.tokenService.setAccessToken(res.accessToken);
            this.timezoneService.setTimezone(res.timezone);

            // Create a successfull notification
            console.log('Login successful');

            this.isAuth = true;
            this.isAuthChanged.emit(this.isAuth);

            // Redirect to the home page
            // this.router.navigate(['/home']);
          }
        }),
        catchError((err) => {
          console.log(err);
          // Handle login error
          this.setCommonError('Incorrect username or password');
          return of(null);
        })
      )
      .subscribe();
  }
  getCommonError(): string {
    return this.commonError;
  }

  setCommonError(error: string) {
    this.commonError = error;
  }

  initForm() {
    this.loginForm = this._fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
        ]),
        // this.validateEmailFromAPIDebounce.bind(this),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(PASSWORD_PATTERN),
        ]),
      ],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Invalid format';
      }
    }
    return '';
  }
}
