import { getDb } from '../../utils/firebase-admin'
import { 
  Flight, 
  AirportCode, 
  ApiResponse, 
  FlightStatus, 
  TripType, 
  AvailableDateInfo
} from '../../../types'

export interface FlightSearchParams {
  origin: AirportCode;
  destination: AirportCode;
  departureDate?: string;
  tripType: TripType;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

export interface FlightSearchResponse extends ApiResponse<{
  flights: Flight[];
  availableDates: AvailableDateInfo[];
}> {}

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody<FlightSearchParams>(event)
    const { origin, destination, departureDate, tripType, passengers } = body

    // Validation
    if (!origin || !destination) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Origin and destination are required'
      })
    }

    // Get database instance
    const db = getDb()
    const flightsRef = db.collection('flights')
    
    // Initialize flights array
    let flights: Flight[] = []
    
    try {
      // Query flights between the specified airports - using the same pattern as available-dates
      const snapshot = await flightsRef
        .where('origin', '==', origin)
        .where('destination', '==', destination)
        .where('status', '==', FlightStatus.ACTIVE)
        .get()
      
      // Get all flights and filter by date in memory
      flights = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Flight[]
      
      // If date is provided, filter by that specific date
      if (departureDate) {
        flights = flights.filter(flight => flight.date === departureDate)
      }
      
      // If we don't have a specific date, collect all available dates
      const availableDates: AvailableDateInfo[] = []
      
      if (!departureDate && flights.length > 0) {
        // Get unique dates from the flights with price and seats info
        const dateMap = new Map<string, AvailableDateInfo>()
        
        flights.forEach(flight => {
          if (!dateMap.has(flight.date) || dateMap.get(flight.date)!.price > flight.prices.adult) {
            dateMap.set(flight.date, {
              date: flight.date,
              price: flight.prices.adult,
              availableSeats: flight.availableSeats
            })
          }
        })
        
        // Sort dates chronologically
        dateMap.forEach(dateInfo => availableDates.push(dateInfo))
        availableDates.sort((a, b) => a.date.localeCompare(b.date))
      }
      
      // For round trips, we also need to check return flights
      let returnFlights: Flight[] = []
      if (tripType === TripType.ROUND_TRIP && departureDate) {
        const returnSnapshot = await flightsRef
          .where('origin', '==', destination)
          .where('destination', '==', origin)
          .where('status', '==', FlightStatus.ACTIVE)
          .get()
        
        // Filter return flights by date in memory
        returnFlights = returnSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(flight => flight.date >= departureDate) as Flight[]
      }
      
      // Combine departure and return flights for round trips
      if (tripType === TripType.ROUND_TRIP) {
        flights.push(...returnFlights)
      }
      
      return {
        success: true,
        data: {
          flights,
          availableDates,
        }
      } as FlightSearchResponse
    } catch (error: any) {
      console.error('Flight search error:', error)
      
      return {
        success: false,
        error: {
          message: error.statusMessage || error.message || 'An error occurred during flight search',
          code: 'FLIGHT_SEARCH_ERROR',
          statusCode: error.statusCode || 500
        }
      } as FlightSearchResponse
    }
  } catch (error: any) {
    console.error('Flight search error:', error)
    
    // Return a formatted error response
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'An error occurred during flight search',
        code: 'FLIGHT_SEARCH_ERROR',
        statusCode: error.statusCode || 500
      }
    } as FlightSearchResponse
  }
}) 