import { Route } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { UserPageComponent } from './component/user-page/user-page.component';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'user',
    component: UserPageComponent,
  },
];
