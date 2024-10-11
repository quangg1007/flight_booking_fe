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
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  @Input() flightCard: any;
  isDetailVisible: boolean = false;

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

  toggleDetail() {
    this.isDetailVisible = !this.isDetailVisible;
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
