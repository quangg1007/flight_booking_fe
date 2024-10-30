import { Component, input, Input, signal } from '@angular/core';
import { BrandFlight, FlightLegInfo } from 'src/app/models/cardList.model';
import {
  convertMinutesToHoursAndMinutes,
  convertToAMPMFormat,
} from 'src/app/util/time';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  flightCard = input.required<any>();
  isDetailVisible: boolean = false;
  tagsFlight: string[] = [];

  legs: FlightLegInfo[] = [];

  constructor() {}

  ngOnInit() {
    // console.log(this.flightCard());
    this.formatTagFlight(this.flightCard().tags);

    this.legs = this.flightCard().legs.map((leg: any) => {
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

  formatTagFlight(tags: any) {
    tags?.map((tag: any) => {
      this.tagsFlight.push(tag);
    });
  }

  formatBrandFlight(brandFlight: any) {
    return brandFlight.map((brand: BrandFlight) => brand.name).join(', ');

    // return brandFlight.join(', ');
  }

  formatDepDesCode(leg: any): string {
    return `${leg?.origin.id} - ${leg?.destination.id}`;
  }
}
