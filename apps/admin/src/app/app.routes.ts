import { Route } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { UserPageComponent } from './component/user-page/user-page.component';
import { FlightPageComponent } from './component/flight-page/flight-page.component';
import { BookingPageComponent } from './component/booking-page/booking-page.component';
import { NotificationPageComponent } from './component/notification-page/notification-page.component';
import { SystemMonitoringComponent } from './component/system-monitoring-page/system-monitoring-page.component';
import { AdminPageComponent } from './component/admin-page/admin-page.component';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'user',
    component: UserPageComponent,
  },
  {
    path: 'flight',
    loadComponent: () =>
      import('@flight_booking_fe/modules/flights').then(
        (c) => c.FlightsComponent
      ),
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('@flight_booking_fe/modules/bookings').then(
        (c) => c.BookingsComponent
      ),
  },
  {
    path: 'user',
    component: UserPageComponent,
  },
  {
    path: 'notification',
    component: NotificationPageComponent,
  },
  {
    path: 'system-monitoring',
    component: SystemMonitoringComponent,
  },
  {
    path: 'admin',
    component: AdminPageComponent,
  },
];
