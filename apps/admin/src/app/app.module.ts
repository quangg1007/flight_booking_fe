import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { UserPageComponent } from './component/user-page/user-page.component';
import { SideBarComponent } from './component/common/side-bar/side-bar.component';

@NgModule({
  declarations: [DashboardComponent, UserPageComponent],
  imports: [CommonModule, SideBarComponent],
})
export class AppModule {}
