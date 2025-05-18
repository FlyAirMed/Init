import { getDb } from '../../../utils/firebase-admin'
import { Flight, ApiResponse } from '../../../../types'

export default defineEventHandler(async (event) => {
  try {
    // Get flight ID from route
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Flight ID is required'
      });
    }
    
    // Parse request body
    const flightData = await readBody(event) as Flight;
    
    // Validation
    if (!flightData.origin || !flightData.destination || !flightData.date) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Origin, destination, and date are required'
      });
    }
    
    if (!flightData.segments || flightData.segments.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one flight segment is required'
      });
    }
    
    // Connect to database
    const db = getDb();
    const flightRef = db.collection('flights').doc(id);
    
    // Check if flight exists
    const flightDoc = await flightRef.get();
    
    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flight not found'
      });
    }
    
    // Update the flight
    await flightRef.update(flightData);
    
    // Get the updated flight
    const updatedFlightDoc = await flightRef.get();
    
    return {
      success: true,
      data: {
        flight: {
          id,
          ...updatedFlightDoc.data()
        }
      }
    } as ApiResponse<{ flight: Flight }>;
  } catch (error: any) {
    console.error('Failed to update flight:', error);
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'Failed to update flight',
        code: 'UPDATE_FLIGHT_ERROR',
        statusCode: error.statusCode || 500
      }
    } as ApiResponse<any>;
  }
}); 