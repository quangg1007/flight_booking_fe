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
      const fromEntityId = params['from_departure'];
      const toEntityId = params['to_destination'];
      const date = params['date'];

      console.log(fromEntityId, toEntityId, date);

      this._flightService
        .searchOneWay(fromEntityId, toEntityId, date)
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
    });
  }
}
