import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-past-booking',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './past-booking.component.html',
  styleUrl: './past-booking.component.css',
})
export class PastBookingComponent {
  activeTab = input<'upcoming' | 'past'>();
}
