import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login/login.component';
import { PasswordResetComponent } from './component/login/password-reset/password-reset.component';
import { RegisterComponent } from './component/login/register/register.component';
import { userService } from './services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { EmailResetPasswordComponent } from './component/login/email-reset-password/email-reset-password.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { FlightService } from './services/flight.service';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { RetryInterceptor } from './interceptor/retry.interceptor';

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

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
