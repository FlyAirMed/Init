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
  origin?: AirportCode;
  destination?: AirportCode;
  date?: string; // YYYY-MM-DD format
  tripType: TripType;
}

export interface FlightSearchResponse extends ApiResponse<{
  flights: Flight[];
  availableDates: AvailableDateInfo[];
}> {}

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody<FlightSearchParams>(event)
    const { origin, destination, date, tripType } = body

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
    
    // Build the query
    let query = flightsRef
      .where('origin', '==', origin)
      .where('destination', '==', destination)
      .where('status', '==', FlightStatus.ACTIVE)
    
    // If date is provided, filter by that specific date
    if (date) {
      query = query.where('date', '==', date)
    }
    
    // Execute the query
    const snapshot = await query.get()
    
    // Format the results
    const flights = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Flight[]
    
    // If we don't have a specific date, collect all available dates
    const availableDates: AvailableDateInfo[] = []
    
    if (!date && flights.length > 0) {
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
    } else if (date && flights.length === 0) {
      // If a date was specified but no flights found, find alternative dates
      const allFlightsSnapshot = await flightsRef
        .where('origin', '==', origin)
        .where('destination', '==', destination)
        .where('status', '==', FlightStatus.ACTIVE)
        .get()
        
      const allFlights = allFlightsSnapshot.docs.map(doc => ({
        ...doc.data()
      })) as Flight[]
      
      // Create a map to store the lowest price for each date
      const dateMap = new Map<string, AvailableDateInfo>()
      
      allFlights.forEach(flight => {
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
    if (tripType === TripType.ROUND_TRIP && date) {
      const returnSnapshot = await flightsRef
        .where('origin', '==', destination)
        .where('destination', '==', origin)
        .where('status', '==', FlightStatus.ACTIVE)
        .where('date', '>=', date) // Return date must be same or after departure
        .get()
        
      returnFlights = returnSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Flight[]
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