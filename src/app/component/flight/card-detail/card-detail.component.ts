import { Component, input, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import {
  FlightSegmentInfo,
  LayoverInfo,
  LegInfo,
} from 'src/app/models/cardDetail.model';
import { BookingService } from 'src/app/services/booking.service';
import { FlightServiceAPI } from 'src/app/services/flight.service';
import { calculateDuration, convertToUserTimezone } from 'src/app/util/time';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css',
})
export class CardDetailComponent {
  itineraryId = input<string>('');
  isLoading: boolean = true;

  flightSegmentInfo: FlightSegmentInfo[] = [];
  layoverInfo: LayoverInfo[] = [];

  fullDurationSegment: string = '';
  departureDate: string = '';

  legInfo: LegInfo[] = [];

  toastMessages: string[] = [];

  constructor(
    private flightServiceAPI: FlightServiceAPI,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.loadFlightDetails();
  }

  loadFlightDetails() {
    this.isLoading = true;

    console.log(this.itineraryId());
    this.flightServiceAPI.searchDetail(this.itineraryId()).subscribe((res) => {
      console.log("res", res);
      if (res.status) {
        this.legInfo = res.data.itinerary.legs.map((leg: any) => {
          const fullDurationSegment = leg.duration;
          const headerDate = leg.departure;

          const { flightSegmentInfo, layoverInfo } = this.createFlightSegment(
            leg.segments
          );

          const isDetailSegmentAmenities = new Array(
            this.flightSegmentInfo.length
          ).fill(false);

          return {
            flightSegmentInfo,
            layoverInfo,
            fullDurationSegment,
            headerDate,
            isDetailSegmentAmenities,
          };
        });
      }
      this.isLoading = false;
    });
  }

  createFlightSegment(segments: any) {
    const layoverInfo: LayoverInfo[] = [];
    let flightSegmentInfo: FlightSegmentInfo[];

    flightSegmentInfo = segments.map(
      (segment: any, index: number, array: any[]) => {
        const departureTime = convertToUserTimezone(segment.departure);
        const arrivalTime = convertToUserTimezone(segment.arrival);
        const duration = segment.duration;
        const flightLogoBrand = segment.marketingCarrier.logo;
        const flightLogoBrandName = segment.marketingCarrier.name;
        const departureAirport =
          segment.origin.name + ' (' + segment.origin.displayCode + ')';
        const arrivalAirport =
          segment.destination.name +
          ' (' +
          segment.destination.displayCode +
          ')';

        if (index < array.length - 1) {
          const nextSegment = array[index + 1];
          const layoverDuration = calculateDuration(
            nextSegment.departure,
            segment.arrival
          );
          layoverInfo.push({
            duration: layoverDuration,
            layoverAirport: arrivalAirport,
          });
        }

        return {
          departureTime,
          departureAirport,
          arrivalTime,
          arrivalAirport,
          duration,
          flightLogoBrand,
          flightLogoBrandName,
        };
      }
    );

    return {
      flightSegmentInfo,
      layoverInfo,
    };
  }

  navigateToBooking() {
    this.bookingService
      .availabilitySeat(this.itineraryId())
      .pipe(
        tap((data: any) => {
          const isAvailableSeat = data.isAvailableSeat;
          console.log('noAvailableSeat', data.isAvailableSeat);

          if (isAvailableSeat) {
            this.router.navigate(['/booking'], {
              queryParams: {
                itineraryId: this.itineraryId(),
              },
              state: {
                legInfo: this.legInfo,
              },
            });
          } else {
            this.showToast('No available seats for this flight.');
          }
        })
      )
      .subscribe();
  }

  showToast(message: string) {
    this.toastMessages.push(message);
    setTimeout(() => {
      this.toastMessages.pop();
    }, 3000);
  }
}
