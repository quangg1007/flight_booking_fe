import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AccountComponent } from './account/account.component';
import { PaymentsComponent } from './payments/payments.component';
import { RoleGuard } from 'src/app/guard/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin',
    },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'bookings',
        component: BookingsComponent,
      },
      {
        path: 'bookings/:id',
        component: BookingDetailComponent,
      },
      {
        path: 'payment-methods',
        component: PaymentsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
