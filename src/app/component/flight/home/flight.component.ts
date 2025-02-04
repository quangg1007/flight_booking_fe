import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, from, map, mergeMap, switchMap, tap, toArray } from 'rxjs';
import {
  Airlines,
  // Airlines,
  FilterStats,
  Location,
  PriceRange,
} from 'src/app/models/cardFilter.model';
import { OneWaySearchParams } from 'src/app/models/flightService.model';
import { FlightSearchService } from 'src/app/services/flight-search.service';
import { FlightServiceAPI } from 'src/app/services/flight.service';
import { convertToUserTimezone } from 'src/app/util/time';

interface Flight {
  id: string;
  airline: string;
  airlinePhoto: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  destination: string;
  stops: number;
  price: number;
}

interface Airline {
  id: string;
  name: string;
}


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
  tokenItinerary = signal<string>('');
  filteredFlights: any[] = [];

  scrollDistance = 1;
  throttle = 300;

  searchForm!: FormGroup;
  // flights: Flight[] = [
  //   {
  //     id: "1",
  //     airline: "Delta Airlines",
  //     airlinePhoto: "https://images.unsplash.com/photo-1615394695852-da39b8df8c90",
  //     flightNumber: "DL123",
  //     departureTime: "08:00 AM",
  //     arrivalTime: "11:30 AM",
  //     duration: "3h 30m",
  //     origin: "New York (JFK)",
  //     destination: "Los Angeles (LAX)",
  //     stops: 0,
  //     price: 299
  //   },
  //   {
  //     id: "2",
  //     airline: "United Airlines",
  //     airlinePhoto: "https://images.unsplash.com/photo-1542296332-2e4473faf563",
  //     flightNumber: "UA456",
  //     departureTime: "10:15 AM",
  //     arrivalTime: "02:45 PM",
  //     duration: "4h 30m",
  //     origin: "Chicago (ORD)",
  //     destination: "San Francisco (SFO)",
  //     stops: 1,
  //     price: 399
  //   }
  // ];

  flights: Flight[] = [
    {
      id: "VN405",
      airline: "Vietnam Airlines",
      airlinePhoto: "https://tinhocnews.com/wp-content/uploads/2024/06/vietnam-airlines-logo-png.jpg",
      flightNumber: "VN405",
      departureTime: "07:30 AM",
      arrivalTime: "02:15 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 450
    },
    {
      id: "KE684",
      airline: "Korean Air",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkdT4bGelSzZCzKQ4ika7oDt3wS4FYls3Kg&s",
      flightNumber: "KE684",
      departureTime: "10:45 AM",
      arrivalTime: "05:30 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 520
    },
    {
      id: "VJ862",
      airline: "VietJet Air",
      airlinePhoto: "https://brasol.vn/wp-content/uploads/2022/08/logo-vietjet-air.jpg",
      flightNumber: "VJ862",
      departureTime: "02:30 PM",
      arrivalTime: "11:15 PM",
      duration: "5h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 1,
      price: 320
    },
    {
      id: "OZ733",
      airline: "Asiana Airlines",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGKtwdxpqIcbjWdyM4jQmEm6fKO2w8Q3VMg&s",
      flightNumber: "OZ733",
      departureTime: "09:20 AM",
      arrivalTime: "04:05 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 490
    },
    {
      id: "VN403",
      airline: "Vietnam Airlines",
      airlinePhoto: "https://tinhocnews.com/wp-content/uploads/2024/06/vietnam-airlines-logo-png.jpg",
      flightNumber: "VN403",
      departureTime: "01:30 PM",
      arrivalTime: "08:15 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 475
    },
    {
      id: "KE686",
      airline: "Korean Air",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkdT4bGelSzZCzKQ4ika7oDt3wS4FYls3Kg&s",
      flightNumber: "KE686",
      departureTime: "03:45 PM",
      arrivalTime: "10:30 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 510
    },
    {
      id: "VJ864",
      airline: "VietJet Air",
      airlinePhoto: "https://brasol.vn/wp-content/uploads/2022/08/logo-vietjet-air.jpg",
      flightNumber: "VJ864",
      departureTime: "06:15 AM",
      arrivalTime: "03:00 PM",
      duration: "5h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 1,
      price: 310
    },
    {
      id: "OZ735",
      airline: "Asiana Airlines",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGKtwdxpqIcbjWdyM4jQmEm6fKO2w8Q3VMg&s",
      flightNumber: "OZ735",
      departureTime: "11:50 AM",
      arrivalTime: "06:35 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 495
    },
    {
      id: "VN407",
      airline: "Vietnam Airlines",
      airlinePhoto: "https://tinhocnews.com/wp-content/uploads/2024/06/vietnam-airlines-logo-png.jpg",
      flightNumber: "VN407",
      departureTime: "04:30 PM",
      arrivalTime: "11:15 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 460
    },
    {
      id: "KE688",
      airline: "Korean Air",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkdT4bGelSzZCzKQ4ika7oDt3wS4FYls3Kg&s",
      flightNumber: "KE688",
      departureTime: "08:15 AM",
      arrivalTime: "03:00 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 530
    },
    {
      id: "VJ866",
      airline: "VietJet Air",
      airlinePhoto: "https://brasol.vn/wp-content/uploads/2022/08/logo-vietjet-air.jpg",
      flightNumber: "VJ866",
      departureTime: "12:45 PM",
      arrivalTime: "09:30 PM",
      duration: "5h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 1,
      price: 315
    },
    {
      id: "OZ737",
      airline: "Asiana Airlines",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGKtwdxpqIcbjWdyM4jQmEm6fKO2w8Q3VMg&s",
      flightNumber: "OZ737",
      departureTime: "02:20 PM",
      arrivalTime: "09:05 PM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 485
    },
    {
      id: "VN409",
      airline: "Vietnam Airlines",
      airlinePhoto: "https://tinhocnews.com/wp-content/uploads/2024/06/vietnam-airlines-logo-png.jpg",
      flightNumber: "VN409",
      departureTime: "07:00 PM",
      arrivalTime: "01:45 AM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 440
    },
    {
      id: "KE690",
      airline: "Korean Air",
      airlinePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkdT4bGelSzZCzKQ4ika7oDt3wS4FYls3Kg&s",
      flightNumber: "KE690",
      departureTime: "05:30 PM",
      arrivalTime: "00:15 AM",
      duration: "4h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 0,
      price: 515
    },
    {
      id: "VJ868",
      airline: "VietJet Air",
      airlinePhoto: "https://brasol.vn/wp-content/uploads/2022/08/logo-vietjet-air.jpg",
      flightNumber: "VJ868",
      departureTime: "09:45 PM",
      arrivalTime: "06:30 AM",
      duration: "5h 45m",
      origin: "Hanoi (HAN)",
      destination: "Incheon (ICN)",
      stops: 1,
      price: 305
    }
  ]


  airlines: Airline[] = [
    { id: "delta", name: "Delta Airlines" },
    { id: "united", name: "United Airlines" },
    { id: "american", name: "American Airlines" },
    { id: "southwest", name: "Southwest Airlines" }
  ];

  constructor(
    private route: ActivatedRoute,
    private _flightServiceAPI: FlightServiceAPI,
    private _flightSearchService: FlightSearchService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      departure: ["", Validators.required],
      arrival: ["", Validators.required],
      tripType: ["oneWay", Validators.required],
      date: ["", Validators.required],
      priceRange: [1000]
    });
  }

  ngOnInit() {

    this.searchForm.valueChanges.subscribe((value: any) => {
      console.log("Form values:", value);
    });
    // const params: OneWaySearchParams = {
    //   departureEntityId: 'HAN',
    //   arrivalEntityId: 'ICN',
    //   departDate: '2024-10-30',
    //   classType: 'Economy',
    //   travellerType: 'Adult',
    // };

    // this._flightServiceAPI
    //   .searchOneWay(params)
    //   .pipe(
    //     map((results) => {
    //       this.allFlights = this.convertToUserTimeZone(
    //         results.data.itineraries
    //       );

    //       this.tokenItinerary = results.data.token;

    //       this.filteredFlights = this.allFlights;

    //       this.setFilterStats(results);

    //       this.flightListResult.set(this.allFlights.slice(0, this.pageSize));

    //       this.isLoading = false;

    //       return this.allFlights;
    //     }),
    //     map((allFlights) => {
    //       const first2Flights = Array.isArray(allFlights)
    //         ? allFlights.slice(0, 2)
    //         : [];
    //       console.log('first2Flights 1: ', first2Flights);
    //       return first2Flights;
    //     }),
    //     // Switch to switchMap to handle the inner observables
    //     mergeMap((first2Flights) => {
    //       console.log('first2Flights 2: ', first2Flights);
    //       // Use forkJoin to combine multiple API calls
    //       return forkJoin(
    //         first2Flights.map((flight: any) => {
    //           console.log('flight: ', flight);
    //           return this._flightServiceAPI.searchDetail(
    //             flight.id,
    //             this.tokenItinerary
    //           );
    //         })
    //       );
    //     })
    //   )
    //   .subscribe();

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

          console.log('token: ', results.data.token);

          this.tokenItinerary.set(results.data.token);

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
      .pipe(
        map((results) => {
          this.allFlights = this.convertToUserTimeZone(
            results.data.itineraries
          );

          this.tokenItinerary.set(results.data.token);

          this.filteredFlights = this.allFlights;

          this.setFilterStats(results);

          this.flightListResult.set(this.allFlights.slice(0, this.pageSize));

          this.isLoading = false;

          return this.allFlights;
        }),
        map((allFlights) => {
          const first4Flights = Array.isArray(allFlights)
            ? allFlights.slice(0, 4)
            : [];
          console.log('first4Flights 1: ', first4Flights);
          return first4Flights;
        }),
        // Switch to switchMap to handle the inner observables
        mergeMap((first4Flights) => {
          console.log('first4Flights 2: ', first4Flights);
          // Use forkJoin to combine multiple API calls
          return forkJoin(
            first4Flights.map((flight: any) => {
              console.log('flight: ', flight);
              return this._flightServiceAPI.searchDetail(
                flight.id,
                this.tokenItinerary()
              );
            })
          );
        })
      )
      .subscribe();
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

      // Call flight details API for new batch
      forkJoin(
        nextFlights.map((flight) =>
          this._flightServiceAPI.searchDetail(flight.id, this.tokenItinerary())
        )
      ).subscribe();

      this.flightListResult.update((current) => [...current, ...nextFlights]);
    }
  }
}
