import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login/login.component';
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
import { FlightService } from './services/flight.service';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { RetryInterceptor } from './interceptor/retry.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    PasswordResetComponent,
    RegisterComponent,
    EmailResetPasswordComponent,
    NotFoundComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NgOptimizedImage,
    NgTemplateOutlet
  ],
  providers: [
    userService,
    FlightService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
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
