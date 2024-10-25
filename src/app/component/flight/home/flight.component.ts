import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterStats, PriceRange } from 'src/app/models/cardFilter.model';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  isLoading = true;
  flightListResult = signal<any[]>([]);
  filterStats = signal<FilterStats>({} as FilterStats);

  paramSearch: any;

  pageSize = 10;
  currentPage = 1;
  allFlights: any[] = [];

  scrollDistance = 1;
  throttle = 300;

  selectedPrice = signal<PriceRange>({} as PriceRange);

  selectedDepartureTime = {
    minTimeDeparture: '2024-10-30T01:40:00',
    maxTimeDeparture: '2024-10-30T23:59:00',
  };

  selectedLandingTime = {
    minTimeLanding: '2024-10-31T02:40:00',
    maxTimeLanding: '2024-10-31T23:59:00',
  };

  constructor(
    private route: ActivatedRoute,
    private _flightService: FlightService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.route.queryParams.subscribe((params) => {
      const {
        from_departure_id,
        to_destination_id,
        from_departure,
        to_destination,
        depart_date,
        return_date,
        class_type,
        traveller_type,
      } = params;

      this.paramSearch = {
        from_departure_id,
        to_destination_id,
        from_departure,
        to_destination,
        depart_date,
        return_date,
      };

      if (return_date && depart_date) {
        this.searchRoundTrip(
          from_departure_id,
          to_destination_id,
          depart_date,
          return_date,
          class_type,
          traveller_type
        );
      } else {
        this.searchOneWay(
          from_departure_id,
          to_destination_id,
          depart_date,
          class_type,
          traveller_type
        );
      }
    });
  }

  searchRoundTrip(
    departureEntityId: string,
    arrivalEntityId: string,
    departDate: string,
    returnDate: string,
    classType: string,
    travellerType: string
  ) {
    this._flightService
      .searchRoundTrip({
        departureEntityId,
        arrivalEntityId,
        departDate,
        returnDate,
        classType,
        travellerType,
      })
      .subscribe(
        (results) => {
          this.allFlights = results.data.itineraries;

          this.setFilterStats(results);

          this.flightListResult.set(this.allFlights.slice(0, this.pageSize));

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching flight results:', error);
          this.isLoading = false;
        }
      );
  }

  searchOneWay(
    departureEntityId: string,
    arrivalEntityId: string,
    departDate: string,
    classType: string,
    travellerType: string
  ) {
    this._flightService
      .searchOneWay({
        departureEntityId,
        arrivalEntityId,
        departDate,
        classType,
        travellerType,
      })
      .subscribe(
        (results) => {
          this.allFlights = results.data.itineraries;

          this.setFilterStats(results);

          this.flightListResult.set(this.allFlights.slice(0, this.pageSize));

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching flight results:', error);
          this.isLoading = false;
          // Handle error (e.g., show error message)
        }
      );
  }

  setFilterStats(results: any) {
    this.filterStats.update(() => {
      const { duration, airports, carriers, stopPrices } =
        results.data.filterStats;

      const { minTime: minTimeDeparture, maxTime: maxTimeDeparture } =
        this.getMinMaxTimes(results.data.itineraries, 'departure');

      const { minTime: minTimeLanding, maxTime: maxTimeLanding } =
        this.getMinMaxTimes(results.data.itineraries, 'departure');

      const timeRange = {
        minTimeDeparture,
        maxTimeDeparture,
        minTimeLanding,
        maxTimeLanding,
      };

      this.selectedDepartureTime = {
        minTimeDeparture,
        maxTimeDeparture,
      };

      this.selectedLandingTime = {
        minTimeLanding,
        maxTimeLanding,
      };

      const priceRange: PriceRange = this.getMinMaxPrice(
        results.data.itineraries
      );
      return {
        duration,
        airports,
        carriers,
        stopPrices,
        timeRange,
        priceRange,
      };
    });

    this.selectedPrice.set(this.getMinMaxPrice(results.data.itineraries));
  }

  getMinMaxTimes(
    itineraries: any[],
    field: string
  ): {
    minTime: string;
    maxTime: string;
  } {
    const timesRange = itineraries.map((itinerary) => itinerary.legs[0][field]);

    const sortedTimes = timesRange.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      minTime: sortedTimes[0],
      maxTime: sortedTimes[sortedTimes.length - 1],
    };
  }

  getMinMaxPrice(itineraries: any[]): PriceRange {
    const prices: number[] = itineraries.map((itinerary: any) =>
      Math.round(itinerary.price.raw)
    );
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }

  onTimeDepartureRangeChange(value: any) {
    console.log(value);
  }

  onTimeLandingRangeChange(value: any) {
    console.log(value);
  }

  onPriceChange(value: any) {
    console.log(value);
  }

  onScroll() {
    const nextPage = this.currentPage + 1;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const nextFlights = this.allFlights.slice(startIndex, endIndex);

    if (nextFlights.length > 0) {
      this.currentPage = nextPage;
      this.flightListResult.update((current) => [...current, ...nextFlights]);
    }
  }
}
