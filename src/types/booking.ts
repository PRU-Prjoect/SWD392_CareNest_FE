// types/booking.ts
import { Room } from './room';
import { Customer } from './customer';

export interface RoomBooking {
  id: number;
  room_detail_id: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  booking_date: string;
  feeding_schedule?: string;
  medication_schedule?: string;
  status: BookingStatus;
  room?: Room;
  customer?: Customer;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | '';
  check_in_from?: string;
  check_in_to?: string;
  room_type?: string;
}

export interface BookingStats {
  total_bookings: number;
  current_guests: number;
  monthly_revenue: number;
  occupancy_rate: number;
}

export interface TimelineEvent {
  date: string;
  event: string;
  completed: boolean;
}
