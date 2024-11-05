import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import {
  convertToAMPMFormat,
  formatDateToShortString,
} from 'src/app/util/time';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent {
  bookings: any[] = []; // Array to store bookings

  formatedDepDes: string[] = [];

  activeTab: 'upcoming' | 'past' = 'upcoming';
  ticketUrl =
    'https://c8.alamy.com/comp/2AFH8GT/vector-boarding-pass-modern-airline-ticket-for-a-flight-2AFH8GT.jpg'; // or image URL

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getBookingByUserId(13).subscribe((bookingData) => {
      this.bookings = bookingData;
      bookingData.map((booking, index) => {
        this.formatedDepDes.push(
          `${booking?.itinerary?.legs[0]?.origin_iata} - ${booking?.itinerary?.legs[0]?.destination_iata}`
        );
      });
      console.log('Booking retrieved successfully', bookingData);
    });
  }
  downloadTicket() {
    // Implementation for downloading the ticket
    window.open(this.ticketUrl, '_blank');
  }
}
