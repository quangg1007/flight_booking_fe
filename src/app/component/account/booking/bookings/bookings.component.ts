import { Component, ElementRef, signal, viewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent {
  modifyButtonArray = viewChildren<ElementRef>('.booking-detail-drawer');

  bookings = signal<any[]>([]); // Array to store bookings
  upcomingBookings = signal<any[]>([]);
  pastBookings = signal<any[]>([]);

  activeTab: 'upcoming' | 'past' = 'upcoming';
  ticketUrl =
    'https://c8.alamy.com/comp/2AFH8GT/vector-boarding-pass-modern-airline-ticket-for-a-flight-2AFH8GT.jpg'; // or image URL

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getBookingByUserId(13).subscribe((bookingData) => {
      const now = new Date();

      const filteredBookings = bookingData.reduce(
        (acc: any, booking: any) => {
          const legs = booking.itinerary.legs;
          const lastLeg = legs[legs.length - 1];
          console.log(lastLeg);
          const lastDepartureTime = new Date(lastLeg.departure_time);

          if (lastDepartureTime > now) {
            acc.upcoming.push(booking);
          } else {
            acc.past.push(booking);
          }

          return acc;
        },
        { upcoming: [], past: [] }
      );

      console.log(filteredBookings.past);

      this.upcomingBookings.set(filteredBookings.upcoming);
      this.pastBookings.set(filteredBookings.past);

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

  bookingDetailChange(bookingData: any) {
    console.log('bookingData', bookingData);
    this.bookingService
      .updateBokingById(bookingData.booking_id, bookingData.booking_data)
      .subscribe((booking) => {
        console.log('booking', booking);
      });
  }
}
