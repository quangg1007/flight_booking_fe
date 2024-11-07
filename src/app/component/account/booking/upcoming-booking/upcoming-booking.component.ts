import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { DurationFormatPipe } from '../../../../pipe/duration-format.pipe';
import { TimeFormatPipe } from '../../../../pipe/time-format.pipe';
import { ShortDatePipe } from '../../../../pipe/short-date.pipe';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { LegDetailComponent } from '../leg-detail/leg-detail.component';

@Component({
  selector: 'app-upcoming-booking',
  standalone: true,
  imports: [
    CommonModule,
    DurationFormatPipe,
    TimeFormatPipe,
    NgOptimizedImage,
    ShortDatePipe,
    BookingDetailComponent,
    LegDetailComponent,
  ],
  templateUrl: './upcoming-booking.component.html',
  styleUrl: './upcoming-booking.component.css',
})
export class UpcomingBookingComponent {
  cancelButtons = viewChildren<ElementRef<HTMLButtonElement>>('cancelBtn');
  bookings = input.required<any[]>();
  selectedBookingId: string | null = null;

  bookingsChanged = output<string>();

  formatedDepDes = computed(() => {
    return this.bookings().map((booking: any) => {
      if (booking?.itinerary?.legs[0]?.segments[0]) {
        const legs = booking?.itinerary.legs;
        if (legs.length > 1) {
          let depDesTemp: string = '';
          legs.forEach((leg: any, index: number) => {
            depDesTemp +=
              `${leg.origin_iata} - ${leg.destination_iata}` +
              `${index < legs.length - 1 ? ' | ' : ''}`;
          });
          return depDesTemp;
        } else {
          return `${booking?.itinerary?.legs[0]?.origin_iata} - ${booking?.itinerary?.legs[0]?.destination_iata}`;
        }
      }
      return '';
    });
  });

  activeTab = input<'upcoming' | 'past'>();

  expandedIndex: number = -1;

  constructor() {
    effect(() => {
      const buttons = this.cancelButtons();
      buttons.forEach((button, index) => {
        // Work with each button element
        const booking_id = button.nativeElement.getAttribute('booking-id');
        button.nativeElement.addEventListener(
          'click',
          () => this.showModal(booking_id)
          // this.cancelBtn(booking_id)
        );
      });
    });
  }

  showModal(booking_id: string | null) {
    this.selectedBookingId = booking_id;
    const modal = document.getElementById('cancel_modal') as HTMLDialogElement;
    modal.showModal();
  }

  confirmCancel() {
    if (this.selectedBookingId) {
      this.bookingsChanged.emit(this.selectedBookingId);
    }
  }

  toggleFlightDetails(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}
