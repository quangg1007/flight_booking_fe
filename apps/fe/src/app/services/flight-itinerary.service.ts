import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightItineraryService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getFlightItinerarybyID(itinerary_id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/flightsItinerary/${itinerary_id}`
    );
  }
}
