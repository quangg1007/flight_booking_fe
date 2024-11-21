import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Airlines,
  FilterStats,
  Location,
  PriceRange,
} from '../../../models/cardFilter.model';
import { FlightSearchService } from '../../../services/flight-search.service';
import { FlightServiceAPI } from '../../../services/flight.service';
import { convertToUserTimezone } from '../../../util/time';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  isLoading = true;
  isLoadingFlight: boolean = false;
  flightListResult = signal<any[]>([]);
  filterStats = signal<FilterStats>({} as FilterStats);

  paramSearch: any;

  pageSize = 10;
  currentPage = 1;
  allFlights: any[] = [];
  filteredFlights: any[] = [];

  scrollDistance = 1;
  throttle = 300;

  constructor(
    private route: ActivatedRoute,
    private _flightServiceAPI: FlightServiceAPI,
    private _flightSearchService: FlightSearchService
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
    this._flightServiceAPI
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
          this.allFlights = this.convertToUserTimeZone(
            results.data.itineraries
          );

          this.filteredFlights = this.allFlights;

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
    this._flightServiceAPI
      .searchOneWay({
        departureEntityId,
        arrivalEntityId,
        departDate,
        classType,
        travellerType,
      })
      .subscribe(
        (results) => {
          this.allFlights = this.convertToUserTimeZone(
            results.data.itineraries
          );

          this.filteredFlights = this.allFlights;

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

  convertToUserTimeZone(flights: any[]) {
    return flights.map((flight) => ({
      ...flight,
      legs: flight.legs.map((leg: any) => ({
        ...leg,
        departure: convertToUserTimezone(leg.departure),
        arrival: convertToUserTimezone(leg.arrival),
        segments: leg.segments.map((segment: any) => ({
          ...segment,
          departure: convertToUserTimezone(segment.departure),
          arrival: convertToUserTimezone(segment.arrival),
        })),
      })),
    }));
  }

  setFilterStats(results: any) {
    this.filterStats.update(() => {
      const { duration, airports, carriers } = results.data.filterStats;

      const stopPrices = results.data.filterStats.stopPrices;
      stopPrices.direct.isActive = stopPrices.direct.isPresent;
      stopPrices.one.isActive = stopPrices.one.isPresent;
      stopPrices.twoOrMore.isActive = stopPrices.twoOrMore.isPresent;

      carriers.forEach((carrier: Airlines) => {
        carrier.isActive = true;
      });

      airports.forEach((location: Location) => {
        location.airports.forEach((airport) => {
          airport.isActive = true;
        });
      });

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

  filterStatsChange(filterStats: FilterStats) {
    this.isLoadingFlight = true;
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      this.filteredFlights = this._flightSearchService.filterFlights(
        this.allFlights,
        filterStats
      );

      this.currentPage = 1;
      this.flightListResult.set(this.filteredFlights.slice(0, this.pageSize));
      this.isLoadingFlight = false;
    }, 1000);
  }

  // Handle infinity scrolling.
  onScroll() {
    const nextPage = this.currentPage + 1;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const nextFlights = this.filteredFlights.slice(startIndex, endIndex);

    if (nextFlights.length > 0) {
      this.currentPage = nextPage;
      this.flightListResult.update((current) => [...current, ...nextFlights]);
    }
  }
}