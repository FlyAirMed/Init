import { getDb } from '../../../utils/firebase-admin'
import { Flight, ApiResponse, FlightStatus } from '../../../../types'

export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const flightData = await readBody(event) as Flight;
    
    // Validation
    if (!flightData.origin || !flightData.destination || !flightData.date) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Origin, destination, and date are required'
      });
    }
    
    if (flightData.origin === flightData.destination) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Origin and destination cannot be the same'
      });
    }
    
    if (!flightData.segments || flightData.segments.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one flight segment is required'
      });
    }
    
    if (!flightData.prices || flightData.prices.adult <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid prices are required'
      });
    }
    
    // Ensure we have a status
    if (!flightData.status) {
      flightData.status = FlightStatus.ACTIVE;
    }
    
    // Connect to database
    const db = getDb();
    const flightsCollection = db.collection('flights');
    
    // Create a new flight
    const docRef = await flightsCollection.add(flightData);
    
    // Get the created flight
    const createdFlight = await docRef.get();
    
    return {
      success: true,
      data: {
        flight: {
          id: docRef.id,
          ...createdFlight.data()
        }
      }
    } as ApiResponse<{ flight: Flight }>;
  } catch (error: any) {
    console.error('Failed to create flight:', error);
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'Failed to create flight',
        code: 'CREATE_FLIGHT_ERROR',
        statusCode: error.statusCode || 500
      }
    } as ApiResponse<any>;
  }
}); 