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

  availabilitySeat(itinerary_id: string) {
    return this.http.get<any>(
      `${this.apiUrl}/bookings/availability-seat/${itinerary_id}`
    );
  }

  bookingPending(booking_data: any) {
    return this.http.post<any>(
      `${this.apiUrl}/bookings/booking-pending`,
      booking_data
    );
  }

  updateNewPassenger(bookingId: string | number) {
    return this.http.patch<any>(`${this.apiUrl}/bookings/add-new-passenger`, {
      booking_id: bookingId,
    });
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

  removeBookingPending(booking_id: string | number) {
    return this.http.delete<any>(
      `${this.apiUrl}/bookings/pending/${booking_id}`
    );
  }

  removePassengerBookingPending(booking_id: string | number) {
    return this.http.delete<any>(
      `${this.apiUrl}/bookings/remove-passenger/${booking_id}`
    );
  }
}
