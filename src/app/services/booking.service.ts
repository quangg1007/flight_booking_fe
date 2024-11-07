import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any) {
    return this.http.post<any>(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookingById(bookingId: number) {
    return this.http.get<any>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  getBookingByUserId(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/bookings/user/${userId}`);
  }

  removeBookingByUserIdAndBookingId(user_id: string, booking_id: string) {
    return this.http.delete<any>(`${this.apiUrl}/bookings/${booking_id}`);
  }
}
