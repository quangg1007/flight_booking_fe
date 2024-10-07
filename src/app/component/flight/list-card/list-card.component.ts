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

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css',
})
export class ListCardComponent {
  @Input() flightCard: any;

  brandFlight: BrandFlight[] = [];
  brandNameFlight: string = '';

  formatedDepDesCode: string = '';

  timeDeparture: string = '';
  timeArrival: string = '';
  duration: string = '';
  stopCount: number = 0;

  constructor() {}

  ngOnInit() {
    this.timeDeparture = convertToAMPMFormat(
      this.flightCard?.legs[0]?.departure
    );
    this.timeArrival = convertToAMPMFormat(this.flightCard?.legs[0]?.arrival);
    this.duration = convertMinutesToHoursAndMinutes(
      this.flightCard?.legs[0]?.durationInMinutes
    );

    this.stopCount = this.flightCard?.legs[0]?.stopCount;
    this.brandFlight = this.flightCard?.legs[0]?.carriers?.marketing;
    this.formatBrandFlight(this.brandFlight);
    this.formatedDepDesCode = this.formatDepDesCode();
  }

  formatBrandFlight(brandFlight: any) {
    this.brandNameFlight = brandFlight
      .map((brand: BrandFlight) => brand.name)
      .join(', ');

    // return brandFlight.join(', ');
  }

  formatDepDesCode(): string {
    return `${this.flightCard?.legs[0]?.origin.id} - ${this.flightCard?.legs[0]?.destination.id}`;
  }
}
