import { Component, computed, input, output, signal } from '@angular/core';
import { DateSliderComponent } from '../../common/date-slider/date-slider.component';
import { CommonModule } from '@angular/common';
import { convertTimestampToISOString } from 'src/app/util/time';
import { SliderComponent } from '../../common/slider/slider.component';
import { FilterStats } from 'src/app/models/cardFilter.model';
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
  filterStats = input.required<FilterStats>();

  // Price Change
  priceData = signal<number>(0);
  priceData$ = toObservable(this.priceData);
  pricesChange = output<number>();

  // State Departure Time Range
  minTimeDeparture = signal<string>('');
  maxTimeDeparture = signal<string>('');
  allStateDeparture = signal([this.minTimeDeparture, this.maxTimeDeparture]);
  latestStateDeparture = computed(() =>
    this.allStateDeparture().map((x) => x())
  );
  latestStateDeparture$ = toObservable(this.latestStateDeparture);
  timeDepartureRangeChange = output<{
    minTimeDeparture: string;
    maxTimeDeparture: string;
  }>();

  // State Landing Time Range
  minTimeLanding = signal<string>('');
  maxTimeLanding = signal<string>('');
  allStateLanding = signal([this.minTimeLanding, this.maxTimeLanding]);
  latestStateLanding = computed(() => this.allStateLanding().map((x) => x()));
  latestStateLanding$ = toObservable(this.latestStateLanding);
  timeLandingRangeChange = output<{
    minTimeLanding: string;
    maxTimeLanding: string;
  }>();

  ngOnInit(): void {
    this.minTimeDeparture.set(this.filterStats().timeRange.minTimeDeparture);
    this.maxTimeDeparture.set(this.filterStats().timeRange.maxTimeDeparture);

    this.minTimeLanding.set(this.filterStats().timeRange.minTimeLanding);
    this.maxTimeLanding.set(this.filterStats().timeRange.maxTimeLanding);

    this.handleEmitChange();
  }

  handleEmitChange() {
    this.handleEmitLanding();
    this.handleEmitDeparture();
    this.handleEmitPriceChange();
  }

  handleEmitLanding() {
    this.latestStateLanding$
      .pipe(skip(1), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.timeLandingRangeChange.emit({
          minTimeLanding: this.minTimeLanding(),
          maxTimeLanding: this.maxTimeLanding(),
        });
      });
  }

  handleEmitDeparture() {
    this.latestStateDeparture$
      .pipe(skip(1), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.timeDepartureRangeChange.emit({
          minTimeDeparture: this.minTimeDeparture(),
          maxTimeDeparture: this.maxTimeDeparture(),
        });
      });
  }

  handleEmitPriceChange() {
    this.priceData$
      .pipe(skip(2), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pricesChange.emit(this.priceData());
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
    this.priceData.set(value);
  }

  onStopSelect(event: any) {
    console.log(event.target.value);
    console.log(event.target.checked);
  }

  onAirlinesSelect(event: any) {
    console.log(event.target.value);
    console.log(event.target.checked);
  }

  onAirportSelect(event: any) {
    console.log(event.target.value);
    console.log(event.target.checked);
  }
}
