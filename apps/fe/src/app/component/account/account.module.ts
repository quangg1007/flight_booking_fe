import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookingDetailComponent } from './booking/booking-detail/booking-detail.component';
import { BookingsComponent } from './booking/bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';
import { PaymentsComponent } from './payments/payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationFormatPipe } from '../../pipe/duration-format.pipe';
import { ShortDatePipe } from '../../pipe/short-date.pipe';import { TimeFormatPipe } from '../../pipe/time-format.pipe';
import { UpcomingBookingComponent } from './booking/upcoming-booking/upcoming-booking.component';
import { PastBookingComponent } from './booking/past-booking/past-booking.component';
import { LegDetailComponent } from './booking/leg-detail/leg-detail.component';
import { TimeZoneSettingsComponent } from '../util/time-zone-settings/time-zone-settings.component';

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
    UpcomingBookingComponent,
    PastBookingComponent,
    LegDetailComponent,
    TimeZoneSettingsComponent,
  ],
  declarations: [
    BookingsComponent,
    ProfileComponent,
    AccountComponent,
    PaymentsComponent,
  ],
})
export class AccountModule {}
