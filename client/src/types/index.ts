export type UserRole = 'admin' | 'secretary' | 'customer';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IUser {
  _id: string;
  name: string;
  phone: string;
  username: string;
  role: UserRole;
  status?: UserStatus;
  lastActive?: string;
  createdAt?: string;
}

export type BusCategory = 'first_class' | 'business_class' | 'economy_class';
export type BusSize = 'large' | 'medium';
export type BusModelStatus = 'operational' | 'maintenance'; // تشغيل / صيانة

export interface IBusModel {
  _id: string;
  title: string;
  category: BusCategory;
  size: BusSize;
  capacity: number; // 45, 37, 33, 27, 22, 18
  layoutDetails: {
    description?: string;
    seatingPattern?: string; // "1 + 2", "1 + 1", "2 + 2"
    [key: string]: any;
  };
  totalBusesCount: number;
  status: BusModelStatus;
}

export type TripStatus = 'scheduled' | 'active' | 'completed'; // Strictly no 'cancelled' as per specs
export type ScheduleType = 'manual' | 'daily' | 'weekly' | 'monthly';

export interface ITrip {
  _id: string;
  tripNumber: string; // e.g., "#1025"
  source: string;
  destination: string;
  busModelId: string | IBusModel;
  busModelTitle?: string;
  price: number;
  tripDate: string; // YYYY-MM-DD
  tripTime: string; // HH:mm
  scheduleType: ScheduleType;
  status: TripStatus;
  occupancyRate?: number; // 0-100%
  hasBookings?: boolean; // Required to check price change & deletion rules
  totalBookings?: number;
  createdAt?: string;
}

export interface IBooking {
  _id: string;
  tripId: string | ITrip;
  customerId: string | IUser;
  seatNumbers: number[];
  status: 'reserved' | 'confirmed' | 'cancelled';
  confirmedAt?: string | null;
  bookingDate: string;
}

export interface ITripScheduleChange {
  tripId: string;
  changedBy: string;
  oldTripDate: string;
  oldTripTime: string;
  newTripDate: string;
  newTripTime: string;
}

export interface ITopRoute {
  rank: number;
  source: string;
  destination: string;
  occupancy: number; // e.g. 93%
}

export interface IWeeklyBookingPoint {
  dayName: string; // س، ح، ن، ث، ر، خ، ج
  fullDay: string;
  bookingsCount: number;
  heightPercent: number;
}
