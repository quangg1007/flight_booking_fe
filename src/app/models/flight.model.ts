import { BookingModel } from './booking.model';

export interface FlightModel {
  flight_id: number;
  flight_number: string;
  depature_time: string;
  arrival_airport: string;
  departure_date: Date;
  arrival_date: Date;
  price: number;
  status: string;
  departure_time: Date;
  arrival_time: Date;
  airline: string;
  airplane: string;
  capacity: number;
  bookings: BookingModel[];
}
