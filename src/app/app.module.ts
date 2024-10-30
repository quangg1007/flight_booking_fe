import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { PasswordResetComponent } from './component/login/password-reset/password-reset.component';
import { RegisterComponent } from './component/login/register/register.component';
import { userService } from './services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { EmailResetPasswordComponent } from './component/login/email-reset-password/email-reset-password.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { FlightServiceAPI } from './services/flight.service';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { NgClass, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { LoginPageComponent } from './component/login/login-page/login-page.component';
import { LoginComponent } from './component/login/login/login.component';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { RetryInterceptor } from './interceptor/retry.interceptor';
import { TokenInterceptor } from './interceptor/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PasswordResetComponent,
    RegisterComponent,
    EmailResetPasswordComponent,
    NotFoundComponent,
    LoginPageComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NgOptimizedImage,
    NgTemplateOutlet,
    NgClass,
    LoginComponent,
  ],
  providers: [
    userService,
    FlightServiceAPI,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
