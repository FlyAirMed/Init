export enum FlightStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum TripType {
  ROUND_TRIP = 'roundTrip',
  ONE_WAY = 'oneWay',
}

export enum PassengerType {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
}

export interface BaggageAllowance {
  cabin: number; // kg
  checked: number; // kg
}

export interface FlightSegment {
  from: string;
  to: string;
  departure: string; // ISO date string
  arrival: string; // ISO date string
  duration: string; // User input duration like "2h 30min"
  flightNumber: string;
  baggageAllowance: BaggageAllowance;
}

export interface FlightPrices {
  [PassengerType.ADULT]: number;
  [PassengerType.CHILD]: number;
  [PassengerType.INFANT]: number;
}

export interface Flight {
  id?: string;
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  segments: FlightSegment[];
  availableSeats: number;
  prices: FlightPrices;
  status: FlightStatus;
  baggageAllowance: BaggageAllowance;
}

export const AIRPORTS = {
  VIE: { code: 'VIE', name: 'Vienna' },
  CGN: { code: 'CGN', name: 'Cologne/Bonn' },
  ATH: { code: 'ATH', name: 'Athens' },
  DAM: { code: 'DAM', name: 'Damascus' },
  BER: { code: 'BER', name: 'Berlin Brandenburg' }
} as const;

export type AirportCode = keyof typeof AIRPORTS;

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface FlightSearchRequest {
  origin: AirportCode;
  destination: AirportCode;
  departureDate?: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  tripType: TripType;
  passengers: {
    [key in PassengerType]?: number;
  };
}

export interface AvailableDateInfo {
  date: string;
  price: number;
  availableSeats: number;
} 