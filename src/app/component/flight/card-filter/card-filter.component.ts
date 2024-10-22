import { LabelType, Options } from '@angular-slider/ngx-slider/options';
import { Component, signal } from '@angular/core';
import { DateSliderComponent } from '../../common/date-slider/date-slider.component';
import { CommonModule } from '@angular/common';
import { convertToAMPMFormat } from 'src/app/util/time';
import { SliderComponent } from '../../common/slider/slider.component';

interface Airlines {
  id: string;
  name: string;
  price: string;
}

interface Airport {
  id: string;
  name: string;
  price: string;
}

interface Stop {
  id: string;
  name: string;
  price: string;
}

interface FlightTimeDuration {
  minTime: Date;
  maxTime: Date;
  duration: number;
}

interface Price {
  minPrice: number;
  maxPrice: number;
}

@Component({
  selector: 'app-card-filter',
  standalone: true,
  imports: [CommonModule, DateSliderComponent, SliderComponent],
  templateUrl: './card-filter.component.html',
  styleUrl: './card-filter.component.css',
})
export class CardFilterComponent {
  selectedStop: Stop[] = [
    {
      id: '1',
      name: 'Non-stop',
      price: '1',
    },
    {
      id: '2',
      name: '1 Stop',
      price: '2',
    },
    {
      id: '3',
      name: '2 Stops +',
      price: '3',
    },
  ];

  minTimeDeparture = signal('2024-10-30T01:40:00');
  maxTimeDeparture = signal('2024-10-30T23:40:00');

  minPrice = signal(0);
  maxPrice = signal(10000);

  handleMinTimeValueChange(valueTime: number) {
    console.log('Min Time:', convertToAMPMFormat(valueTime));
    // Do something with the new time value
  }

  handleMaxTimeValueChange(valueTime: number) {
    // this.maxTimeValue.set(valueTime);
    console.log('Max Time:', convertToAMPMFormat(valueTime));
  }

  handlePriceChange(value: number) {
    console.log('Price:', value);
    // Do something with the new price value
  }
}
