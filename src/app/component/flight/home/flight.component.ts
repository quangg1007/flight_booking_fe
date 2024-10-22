import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stop, Airlines, Airport } from 'src/app/models/cardFilter.model';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  isLoading = true;
  searchResults: any;
  paramSearch: any;

  selectedStop: Stop[] = [
    {
      id: '1',
      name: 'Non-stop',
      price: '$200',
    },
    {
      id: '2',
      name: '1 Stop',
      price: '$234',
    },
    {
      id: '3',
      name: '2 Stops +',
      price: '$355',
    },
  ];

  selectedAirline: Airlines[] = [
    {
      id: '1',
      name: 'Air Asia',
      price: '$200',
    },
    {
      id: '2',
      name: 'Indigo',
      price: '$234',
    },
    {
      id: '3',
      name: 'SpiceJet',
      price: '$355',
    },
  ];

  selectedAirport: Airport[] = [
    {
      id: '1',
      name: 'Banglore',
      price: '$200',
    },
    {
      id: '2',
      name: 'Delhi',
      price: '$234',
    },
    {
      id: '3',
      name: 'Mumbai',
      price: '$355',
    },
  ];

  selectedPrice = {
    min: 100,
    max: 1000,
  };

  selectedTakeOffTime = {
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
          this.searchResults = results;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching flight results:', error);
          this.isLoading = false;
          // Handle error (e.g., show error message)
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
          this.searchResults = results;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching flight results:', error);
          this.isLoading = false;
          // Handle error (e.g., show error message)
        }
      );
  }

  onTimeDepartureRangeChange(value: any) {
    console.log(value);
  }

  onTimeLandingRangeChange(value: any) {
    console.log(value);
  }
}
