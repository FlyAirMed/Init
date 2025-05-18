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
    
    // Connect to database
    const db = getDb();
    const flightRef = db.collection('flights').doc(id);
    
    // Get the flight
    const flightDoc = await flightRef.get();
    
    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flight not found'
      });
    }
    
    return {
      success: true,
      data: {
        flight: {
          id,
          ...flightDoc.data()
        }
      }
    } as ApiResponse<{ flight: Flight }>;
  } catch (error: any) {
    console.error('Failed to fetch flight:', error);
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'Failed to fetch flight',
        code: 'FETCH_FLIGHT_ERROR',
        statusCode: error.statusCode || 500
      }
    } as ApiResponse<any>;
  }
}); 