import { getDb } from '../../utils/firebase-admin'
import { 
  AirportCode, 
  ApiResponse, 
  FlightStatus, 
  AvailableDateInfo 
} from '../../../types'

export interface AvailableDatesParams {
  origin: AirportCode;
  destination: AirportCode;
}

export interface AvailableDatesResponse extends ApiResponse<{
  dates: AvailableDateInfo[];
}> {}

export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const body = await readBody<AvailableDatesParams>(event)
    const { origin, destination } = body
    
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
    
    // Query flights between the specified airports
    const snapshot = await flightsRef
      .where('origin', '==', origin)
      .where('destination', '==', destination)
      .where('status', '==', FlightStatus.ACTIVE)
      .get()
    
    // Format the results to get dates with prices and seats
    const flightsByDate = new Map<string, AvailableDateInfo>()
    
    snapshot.docs.forEach(doc => {
      const flight = doc.data()
      const date = flight.date
      
      // Keep the flight with the lowest price for each date
      if (!flightsByDate.has(date) || flightsByDate.get(date)!.price > flight.prices.adult) {
        flightsByDate.set(date, {
          date,
          price: flight.prices?.adult || 0,
          availableSeats: flight.availableSeats || 0
        })
      }
    })
    
    // Convert map to array
    const dates = Array.from(flightsByDate.values())
    
    // Sort dates chronologically
    dates.sort((a, b) => a.date.localeCompare(b.date))
    
    return {
      success: true,
      data: {
        dates
      }
    } as AvailableDatesResponse
  } catch (error: any) {
    console.error('Available dates error:', error)
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'An error occurred while fetching available dates',
        code: 'AVAILABLE_DATES_ERROR',
        statusCode: error.statusCode || 500
      }
    } as AvailableDatesResponse
  }
}) 