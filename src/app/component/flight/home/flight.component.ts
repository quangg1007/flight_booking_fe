import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  isLoading = true;
  searchResults: any;

  constructor(
    private route: ActivatedRoute,
    private _flightService: FlightService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['return_date'] && params['depart_date']) {
        console.log(params['return_date'], params['depart_date']);

        this.searchRoundTrip(
          params['from_departure'],
          params['to_destination'],
          params['depart_date'],
          params['return_date']
        );
      } else {
        this.searchOneWay(
          params['from_departure'],
          params['to_destination'],
          params['date']
        );
      }
    });
  }

  searchRoundTrip(
    fromEntityId: string,
    toEntityId: string,
    departDate: string,
    returnDate: string
  ) {
    this._flightService
      .searchRoundTrip(fromEntityId, toEntityId, departDate, returnDate)
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

  searchOneWay(fromEntityId: string, toEntityId: string, date: string) {
    this._flightService.searchOneWay(fromEntityId, toEntityId, date).subscribe(
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
}
