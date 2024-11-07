import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  signal,
  viewChildren,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { FlightItineraryService } from 'src/app/services/flight-itinerary.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent {
  modifyButtonArray = viewChildren<ElementRef>('.booking-detail-drawer');

  bookings = signal<any[]>([]); // Array to store bookings

  activeTab: 'upcoming' | 'past' = 'upcoming';
  ticketUrl =
    'https://c8.alamy.com/comp/2AFH8GT/vector-boarding-pass-modern-airline-ticket-for-a-flight-2AFH8GT.jpg'; // or image URL

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getBookingByUserId(13).subscribe((bookingData) => {
      this.bookings.set(bookingData);
    });
  }

  downloadTicket() {
    // Implementation for downloading the ticket
    window.open(this.ticketUrl, '_blank');
  }

  deleteBooking(bookingId: string) {
    console.log('bookingId', bookingId);
    this.bookingService
      .removeBookingByUserIdAndBookingId('13', bookingId)
      .subscribe((res) => {
        if (res.status == 200) {
          this.bookings.set(
            this.bookings().filter(
              (booking) => parseInt(booking.booking_id) !== parseInt(bookingId)
            )
          );
          console.log(this.bookings());
        }
      });
  }
}
