import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class FlightService {
  private apiUrl = 'http://localhost:8080/api';


  constructor(private http: HttpClient) {}

  getLocations(location: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/flights/search/auto-complete`, {
      params: { keyword: location },
    });
  }
}
