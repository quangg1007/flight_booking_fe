import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css',
})
export class CardDetailComponent {
  @Input() itineraryId: string = '';
  isLoading: boolean = true;

  isDetailSegmentAmenities: boolean[] = [];

  flightSegmentInfo: FlightSegmentInfo[] = [];
  layoverInfo: LayoverInfo[] = [];

  fullDurationSegment: string = '';
  departureDate: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.loadFlightDetails(this.itineraryId);
  }

  loadFlightDetails(segments: any) {
    this.isLoading = true;
    this.isDetailSegmentAmenities = new Array(
      this.flightSegmentInfo.length
    ).fill(false);

    this.flightService.searchDetail(segments).subscribe(
      (res) => {
        if (res.status) {
          this.createCommonFlightInfo(res.data.itinerary);

          this.flightSegmentInfo = this.createFlightSegment(
            res.data.itinerary.legs[0].segments
          );
        }
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  createCommonFlightInfo(itinerary: any) {
    this.fullDurationSegment = convertMinutesToHoursAndMinutes(
      itinerary.legs[0].duration
    );
    this.departureDate = formatDateToShortString(itinerary.legs[0].departure);
  }

  createFlightSegment(segments: any) {
    this.layoverInfo = [];

    return segments.map((segment: any, index: number, array: any[]) => {
      const departureTime = convertToAMPMFormat(segment.departure);
      const arrivalTime = convertToAMPMFormat(segment.arrival);
      const duration = convertMinutesToHoursAndMinutes(segment.duration);
      const flightLogoBrand = segment.marketingCarrier.logo;
      const flightLogoBrandName = segment.marketingCarrier.name;
      const departureAirport =
        segment.origin.name + ' (' + segment.origin.displayCode + ')';
      const arrivalAirport =
        segment.destination.name + ' (' + segment.destination.displayCode + ')';

      if (index < array.length - 1) {
        const nextSegment = array[index + 1];
        const layoverDuration = calculateLayoverDuration(
          nextSegment.departure,
          segment.arrival
        );
        this.layoverInfo.push({
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
    });
  }

  toggleDetail(index: number) {
    this.isDetailSegmentAmenities[index] =
      !this.isDetailSegmentAmenities[index];
  }
}
