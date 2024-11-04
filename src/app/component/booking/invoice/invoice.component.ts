import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  flighItinerary: any;
  booking: any;
  passengers: any;

  flightInfo: any;
  passengersInfo: any;
  bookingInfo: any;
  contactInfo: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  invoiceNumber = 'INV-2024-001';
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['booking_id']) {
        const booking_id = params['booking_id'];
        this.bookingService.getBookingById(booking_id).subscribe((data) => {
          this.booking = data;
          this.flighItinerary = data.itinerary;
          this.passengers = data.passengers;

          this.setInvoice();
        });
      } else {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as {
          booking: any;
          passenger: any;
          itinerary: any;
        };
        this.flighItinerary = state.itinerary;
        this.booking = state.booking;
        this.passengers = state.passenger;

        this.setInvoice();
        console.log(state);
      }
    });
  }

  setInvoice() {
    console.log('booking: ', this.booking);
    this.flightInfo = {
      departure: this.flighItinerary.legs[0].origin_name,
      arrival: this.flighItinerary.legs[0].destination_name,
      date: this.flighItinerary.legs[0].departure_time,
      flightNumber: this.flighItinerary.legs[0].segments.flight_number,
    };

    this.passengersInfo = [
      {
        name:
          this.passengers[0].first_name + ' ' + this.passengers[0].last_name,
        type: 'Adult',
        seat: '12A',
      },
    ];
    console.log('passengers info: ', this.passengersInfo);

    this.bookingInfo = {
      reference: '#' + this.booking.booking_id,
      date: this.booking.booking_date,
      status: this.booking.status,
    };

    console.log('booking info: ', this.bookingInfo);

    this.contactInfo = {
      email: this.booking.user.email,
      phone: this.booking.user.phone_number,
    };
  }

  downloadInvoice() {
    // Implement download logic
  }

  printInvoice() {
    window.print();
  }
}
