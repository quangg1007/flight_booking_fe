import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable()
export class FlightService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getLocations(location: string): Observable<any> {
    console.log('API call initiated for:', location);
    const results = this.http.get<any>(
      `${this.apiUrl}/flights/search/auto-complete`,
      {
        params: { keyword: location },
      }
    );

    return results.pipe(
      tap((data) => console.log('API response received:', data))
    );
  }

  searchOneWay(
    fromEntityId: string,
    toEntityId: string,
    date: string
  ): Observable<any> {
    const url = `${this.apiUrl}/flights/search/one-way`;
    const params = {
      fromEntityId,
      toEntityId,
      date,
    };

    return this.http.get<any>(url, { params });
  }

  searchRoundTrip(
    fromEntityId: string,
    toEntityId: string,
    departDate: string,
    returnDate: string
  ): Observable<any> {
    const url = `${this.apiUrl}/flights/search/round-trip`;
    const params = {
      fromEntityId,
      toEntityId,
      departDate,
      returnDate,
    };

    return this.http.get<any>(url, { params });
  }

  searchDetail(itineraryId: string): Observable<any> {
    const url = `${this.apiUrl}/flights/search/detail`;
    const params = {
      itineraryId,
    };

    return this.http.get<any>(url, { params });
  }
}
