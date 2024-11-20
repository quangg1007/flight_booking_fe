import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private apiUrl = 'http://localhost:8081/api';
  constructor(private http: HttpClient) {}

  getPassengerByUserId(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/passengers/search`, {
      params: { user_id: userId },
    });
  }

  getPassengerRecentByUserId(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/passengers/recent/${userId}}`);
  }

  createPassenger(passengerData: any) {
    return this.http.post<any>(`${this.apiUrl}/passengers`, passengerData);
  }

  updatePassenger(passengerId: string, passengerData: any) {
    return this.http.patch<any>(
      `${this.apiUrl}/passengers/${passengerId}`,
      passengerData
    );
  }
}
