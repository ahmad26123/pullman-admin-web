export type UserRole = 'admin' | 'secretary' | 'customer';

export interface IUser {
  _id: string;
  name: string;
  phone: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface IBusModel {
  _id: string;
  title: string;
  capacity: number;
  layoutDetails: Record<string, any>;
}

export interface ITrip {
  _id: string;
  busModelId: string | IBusModel;
  source: string;
  destination: string;
  departureTime: string;
  price: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface IBooking {
  _id: string;
  tripId: string | ITrip;
  customerId: string | IUser;
  seatNumber: number;
  status: 'reserved' | 'confirmed' | 'cancelled';
  bookingDate: string;
}
