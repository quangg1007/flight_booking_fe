import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login/login.component';
import { RegisterComponent } from './component/login/register/register.component';
import { PasswordResetComponent } from './component/login/password-reset/password-reset.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'flight',
    loadChildren: () =>
      import('./component/flight/flight.module').then((m) => m.FlightModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./component/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
