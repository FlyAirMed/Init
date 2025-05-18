export interface FlightSegment {
  from: string;
  to: string;
  departure: string; // ISO date string
  arrival: string; // ISO date string
  duration: string; // formatted like "2h 30min"
}

export interface FlightPrices {
  adult: number;
  child: number;
  infant: number;
  senior: number;
}

export interface Flight {
  id?: string;
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  segments: FlightSegment[];
  availableSeats: number;
  prices: FlightPrices;
  status: 'active' | 'cancelled' | 'completed';
}

export const AIRPORTS = {
  VIE: { code: 'VIE', name: 'Vienna' },
  CGN: { code: 'CGN', name: 'Cologne/Bonn' },
  ATH: { code: 'ATH', name: 'Athens' },
  DAM: { code: 'DAM', name: 'Damascus' }
} as const;

export type AirportCode = keyof typeof AIRPORTS; 