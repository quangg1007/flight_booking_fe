import { Component, Input, signal } from '@angular/core';
import {
  convertMinutesToHoursAndMinutes,
  convertToAMPMFormat,
} from 'src/app/util/time';

interface BrandFlight {
  id: number;
  logoUrl: string;
  name: string;
}

interface FlightLegInfo {
  timeDeparture: string;
  timeArrival: string;
  duration: string;
  stopCount: number;
  brandFlight: BrandFlight[];
  brandNameFlight: string;
  formatedDepDesCode: string;
}
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  @Input() flightCard: any;
  isDetailVisible: boolean = false;

  legs: FlightLegInfo[] = [];

  constructor() {}

  ngOnInit() {
    this.legs = this.flightCard?.legs.map((leg: any) => {
      const timeDeparture = convertToAMPMFormat(leg.departure);
      const timeArrival = convertToAMPMFormat(leg.arrival);
      const duration = convertMinutesToHoursAndMinutes(leg.durationInMinutes);
      const stopCount = leg.stopCount;
      const brandFlight = leg.carriers.marketing;
      const brandNameFlight = this.formatBrandFlight(brandFlight);
      const formatedDepDesCode = this.formatDepDesCode(leg);

      return {
        timeDeparture,
        timeArrival,
        duration,
        stopCount,
        brandFlight,
        brandNameFlight,
        formatedDepDesCode,
      };
    });
  }

  toggleDetail() {
    this.isDetailVisible = !this.isDetailVisible;
  }

  formatBrandFlight(brandFlight: any) {
    return brandFlight.map((brand: BrandFlight) => brand.name).join(', ');

    // return brandFlight.join(', ');
  }

  formatDepDesCode(leg: any): string {
    return `${leg?.origin.id} - ${leg?.destination.id}`;
  }
}
