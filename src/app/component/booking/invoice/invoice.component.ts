import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  passenger: any;

  flightInfo: any;
  passengers: any;
  bookingInfo: any;
  contactInfo: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      booking: any;
      passenger: any;
      itinerary: any;
    };
    this.flighItinerary = state.itinerary;
    this.booking = state.booking;
    this.passenger = state.passenger;

    this.setInvoice();
    console.log(state);
  }

  ngOnInit() {}
  invoiceNumber = 'INV-2024-001';

  setInvoice() {
    this.flightInfo = {
      departure: this.flighItinerary.legs[0].origin_name,
      arrival: this.flighItinerary.legs[0].destination_name,
      date: this.flighItinerary.legs[0].departure_time,
      flightNumber: this.flighItinerary.legs[0].segments.flight_number,
    };

    this.passengers = [
      {
        name: this.passenger.first_name + ' ' + this.passenger.last_name,
        type: 'Adult',
        seat: '12A',
      },
    ];

    this.bookingInfo = {
      reference: '#' + this.booking.booking_id,
      date: this.booking.booking_date,
      status: this.booking.status,
    };

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
