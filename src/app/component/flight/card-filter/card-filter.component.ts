import { LabelType, Options } from '@angular-slider/ngx-slider/options';
import { Component, computed, input, output, signal } from '@angular/core';
import { DateSliderComponent } from '../../common/date-slider/date-slider.component';
import { CommonModule } from '@angular/common';
import { convertTimestampToISOString } from 'src/app/util/time';
import { SliderComponent } from '../../common/slider/slider.component';
import { Airlines, Airport, Stop } from 'src/app/models/cardFilter.model';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card-filter',
  standalone: true,
  imports: [CommonModule, DateSliderComponent, SliderComponent],
  templateUrl: './card-filter.component.html',
  styleUrl: './card-filter.component.css',
})
export class CardFilterComponent {
  stops = input<Stop[]>();
  airlines = input<Airlines[]>();
  airports = input<Airport[]>();
  prices = input.required<{ min: number; max: number }>();
  takeOffTime = input.required<{
    minTimeDeparture: string;
    maxTimeDeparture: string;
  }>();
  landingTime = input.required<{
    minTimeLanding: string;
    maxTimeLanding: string;
  }>();

  timeDepartureRangeChange = output<{
    minTimeDeparture: string;
    maxTimeDeparture: string;
  }>();
  timeLandingRangeChange = output<{
    minTimeLanding: string;
    maxTimeLanding: string;
  }>();

  minTimeDeparture = signal<string>('');
  maxTimeDeparture = signal<string>('');

  minTimeLanding = signal<string>('');
  maxTimeLanding = signal<string>('');

  allStateDeparture = signal([this.minTimeDeparture, this.maxTimeDeparture]);
  latestStateDeparture = computed(() =>
    this.allStateDeparture().map((x) => x())
  );
  latestStateDeparture$ = toObservable(this.latestStateDeparture);

  allStateLanding = signal([this.minTimeLanding, this.maxTimeLanding]);
  latestStateLanding = computed(() => this.allStateLanding().map((x) => x()));
  latestStateLanding$ = toObservable(this.latestStateLanding);

  ngOnInit(): void {
    this.minTimeDeparture.set(this.takeOffTime().minTimeDeparture);
    this.maxTimeDeparture.set(this.takeOffTime().maxTimeDeparture);

    this.minTimeLanding.set(this.landingTime().minTimeLanding);
    this.maxTimeLanding.set(this.landingTime().maxTimeLanding);

    this.latestStateLanding$
      .pipe(skip(1), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.timeLandingRangeChange.emit({
          minTimeLanding: this.minTimeLanding(),
          maxTimeLanding: this.maxTimeLanding(),
        });
      });

    this.latestStateDeparture$
      .pipe(skip(1), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.timeDepartureRangeChange.emit({
          minTimeDeparture: this.minTimeDeparture(),
          maxTimeDeparture: this.maxTimeDeparture(),
        });
      });
  }

  handleMinTimeValueChange(valueTime: number) {
    this.minTimeDeparture.set(convertTimestampToISOString(valueTime));
  }

  handleMaxTimeValueChange(valueTime: number) {
    this.maxTimeDeparture.set(convertTimestampToISOString(valueTime));
  }

  handleMinTimeLandingValueChange(valueTime: number) {
    this.minTimeLanding.set(convertTimestampToISOString(valueTime));
  }

  handleMaxTimeLandingValueChange(valueTime: number) {
    this.maxTimeLanding.set(convertTimestampToISOString(valueTime));
  }

  handlePriceChange(value: number) {
    console.log('Price:', value);
    // Do something with the new price value
  }
}
