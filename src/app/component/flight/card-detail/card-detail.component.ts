import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tap } from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';
import {
  calculateLayoverDuration,
  convertMinutesToHoursAndMinutes,
  convertToAMPMFormat,
  formatDateToShortString,
} from 'src/app/util/time';

export interface FlightSegmentInfo {
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  flightLogoBrand: string;
  flightLogoBrandName: string;
}

export interface LayoverInfo {
  duration: string;
  layoverAirport: string;
}

export interface LegInfo {
  isDetailSegmentAmenities: boolean[];
  flightSegmentInfo: FlightSegmentInfo[];
  layoverInfo: LayoverInfo[];
  fullDurationSegment: string;
  headerDate: string;
}

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css',
})
export class CardDetailComponent {
  @Input() itineraryId: string = '';
  isLoading: boolean = true;

  flightSegmentInfo: FlightSegmentInfo[] = [];
  layoverInfo: LayoverInfo[] = [];

  fullDurationSegment: string = '';
  departureDate: string = '';

  legInfo: LegInfo[] = [];

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.loadFlightDetails(this.itineraryId);
  }

  loadFlightDetails(itineraryId: string) {
    this.isLoading = true;

    this.flightService
      .searchDetail(itineraryId)
      .pipe(
        tap(
          (res) => {
            if (res.status) {
              this.legInfo = res.data.itinerary.legs.map((leg: any) => {
                const { fullDurationSegment, headerDate } =
                  this.createCommonFlightInfo(leg);

                const { flightSegmentInfo, layoverInfo } =
                  this.createFlightSegment(leg.segments);

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
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
          }
        )
      )
      .subscribe();
  }

  createCommonFlightInfo(leg: any) {
    const fullDurationSegment = convertMinutesToHoursAndMinutes(leg.duration);
    const headerDate = formatDateToShortString(leg.departure);
    return {
      fullDurationSegment,
      headerDate,
    };
  }

  createFlightSegment(segments: any) {
    const layoverInfo: LayoverInfo[] = [];
    let flightSegmentInfo: FlightSegmentInfo[];

    flightSegmentInfo = segments.map(
      (segment: any, index: number, array: any[]) => {
        const departureTime = convertToAMPMFormat(segment.departure);
        const arrivalTime = convertToAMPMFormat(segment.arrival);
        const duration = convertMinutesToHoursAndMinutes(segment.duration);
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
          const layoverDuration = calculateLayoverDuration(
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
}
