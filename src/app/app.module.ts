import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login/login.component';
import { PasswordResetComponent } from './component/login/password-reset/password-reset.component';
import { RegisterComponent } from './component/login/register/register.component';
import { ApiService } from './services/api.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    PasswordResetComponent,
    RegisterComponent,
  ],

  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
