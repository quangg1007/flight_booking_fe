import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookingById(bookingId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  getBookingByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings/user/${userId}`);
  }

  updateBokingById(booking_id: string, bookingData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/bookings/${booking_id}`,
      bookingData
    );
  }

  removeBookingByUserIdAndBookingId(user_id: number, booking_id: string) {
    return this.http.delete<any>(`${this.apiUrl}/bookings/${booking_id}`);
  }
}
