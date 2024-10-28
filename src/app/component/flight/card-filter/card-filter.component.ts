import { Component, computed, input, output, signal } from '@angular/core';
import { DateSliderComponent } from '../../common/date-slider/date-slider.component';
import { CommonModule } from '@angular/common';
import { convertTimestampToISOString } from 'src/app/util/time';
import { SliderComponent } from '../../common/slider/slider.component';
import { Airlines, FilterStats, Stop } from 'src/app/models/cardFilter.model';
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

  // Stop Data
  stopData = signal<Stop>({} as Stop);

  // Airport Data
  airportData = signal<Location[]>([]);

  // Airline Data

  airlineData = signal<Airlines[]>([]);

  // Price Change
  priceData = signal<number>(0);

  // State Departure Time Range
  minTimeDeparture = signal<string>('');
  maxTimeDeparture = signal<string>('');

  // State Landing Time Range
  minTimeLanding = signal<string>('');
  maxTimeLanding = signal<string>('');

  allState = signal([
    this.priceData,
    this.minTimeDeparture,
    this.maxTimeDeparture,
    this.minTimeLanding,
    this.maxTimeLanding,
    this.stopData,
    this.airlineData,
  ]);

  latestState = computed(() => this.allState().map((x) => x()));
  latestState$ = toObservable(this.latestState);

  filterChange = output<FilterStats>();

  ngOnInit(): void {
    this.minTimeDeparture.set(this.filterStats().timeRange.minTimeDeparture);
    this.maxTimeDeparture.set(this.filterStats().timeRange.maxTimeDeparture);

    this.minTimeLanding.set(this.filterStats().timeRange.minTimeLanding);
    this.maxTimeLanding.set(this.filterStats().timeRange.maxTimeLanding);

    this.stopData.set(this.filterStats().stopPrices);

    this.airlineData.set(this.filterStats().carriers);

    this.handleFilterSecondChange();
  }

  handleFilterSecondChange() {
    this.latestState$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.handleFiterChange();
      });
  }

  handleFiterChange() {
    this.filterChange.emit({
      duration: this.filterStats().duration,
      airports: this.filterStats().airports,
      carriers: this.airlineData(),
      stopPrices: this.stopData(),
      timeRange: {
        minTimeDeparture: this.minTimeDeparture(),
        maxTimeDeparture: this.maxTimeDeparture(),
        minTimeLanding: this.minTimeLanding(),
        maxTimeLanding: this.maxTimeLanding(),
      },
      priceRange: {
        minPrice: this.filterStats().priceRange.minPrice,
        maxPrice: this.priceData(),
      },
    });
  }

  handleMinTimeDepartureValueChange(valueTime: number) {
    this.minTimeDeparture.set(convertTimestampToISOString(valueTime));
  }

  handleMaxTimeDepartureValueChange(valueTime: number) {
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
    const stopType = event.target.value as keyof Stop;

    this.stopData.update((prev) => {
      prev[stopType].isActive = event.target.checked;
      return prev;
    });
  }

  onAirlinesSelect(event: any) {
    console.log(event.target.value);
    console.log(event.target.checked);

    this.airlineData.update((airlines) => {
      airlines.forEach((airline) => {
        if (airline.id == event.target.value) {
          console.log('something');
          airline.isActive = event.target.checked;
        }
      });

      return airlines;
    });
  }

  onAirportSelect(event: any) {
    console.log(event.target.value);
    console.log(event.target.checked);
  }
}
