import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';
import { PaymentsComponent } from './payments/payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationFormatPipe } from 'src/app/pipe/duration-format.pipe';
import { ShortDatePipe } from 'src/app/pipe/short-date.pipe';
import { TimeFormatPipe } from 'src/app/pipe/time-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DurationFormatPipe,
    ShortDatePipe,
    TimeFormatPipe,
    NgOptimizedImage,
    BookingDetailComponent,
  ],
  declarations: [
    BookingsComponent,
    ProfileComponent,
    AccountComponent,
    PaymentsComponent,
  ],
})
export class AccountModule {}
