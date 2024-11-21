import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  navItems = [
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'user', icon: 'account_circle', label: 'User' },
    { path: 'flight', icon: 'travel', label: 'Flight' },
    { path: 'booking', icon: 'airplane_ticket', label: 'Booking' },
    { path: 'notification', icon: 'chat', label: 'Notification' },
    {
      path: 'system-monitoring',
      icon: 'bar_chart_4_bars',
      label: 'System Monitoring',
    },
    {
      path: 'admin',
      icon: 'shield_person',
      label: 'Admin',
    },
  ];
  constructor() {}

  ngOnInit() {}

  logout() {
    console.log('something');
  }
}
