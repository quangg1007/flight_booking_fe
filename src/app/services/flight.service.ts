import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface OneWaySearchParams {
  departureEntityId: string;
  arrivalEntityId: string;
  departDate: string;
  classType?: string;
  travellerType?: string;
}

interface RoundTripSearchParams {
  departureEntityId: string;
  arrivalEntityId: string;
  departDate: string;
  returnDate: string;
  classType?: string;
  travellerType?: string;
}

@Injectable()
export class FlightService {
  private apiUrl = 'http://localhost:8081/api';

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

  searchOneWay(params: OneWaySearchParams): Observable<any> {
    const url = `${this.apiUrl}/flights/search/one-way`;

    const httpParams = new HttpParams({
      fromObject: params as unknown as { [key: string]: string },
    });

    return this.http.get<any>(url, { params: httpParams }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('Something went wrong; please try again later.')
        );
      })
    );
  }

  searchRoundTrip(params: RoundTripSearchParams): Observable<any> {
    const url = `${this.apiUrl}/flights/search/round-trip`;

    const httpsParams = new HttpParams({
      fromObject: params as unknown as { [key: string]: string },
    });

    return this.http.get<any>(url, { params: httpsParams }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('Something went wrong; please try again later.')
        );
      })
    );
  }

  searchDetail(itineraryId: string): Observable<any> {
    const url = `${this.apiUrl}/flights/search/detail`;
    const params = {
      itineraryId,
    };

    return this.http.get<any>(url, { params });
  }
}
