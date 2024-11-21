import { Component, ElementRef, signal, viewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'lib-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent {}
