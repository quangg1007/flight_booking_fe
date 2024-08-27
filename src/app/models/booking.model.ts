import { UserModel } from "./user.model";

export interface BookingModel {
  booking_id: number;
  booking_date: Date;
  status: String;
  flight: number;
  user: UserModel;
  total_price: number;
}
