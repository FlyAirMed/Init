import { getDb } from '../../../utils/firebase-admin'
import { ApiResponse } from '../../../../types'

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
    
    // Check if flight exists
    const flightDoc = await flightRef.get();
    
    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flight not found'
      });
    }
    
    // Delete the flight
    await flightRef.delete();
    
    return {
      success: true,
      data: {
        id
      }
    } as ApiResponse<{ id: string }>;
  } catch (error: any) {
    console.error('Failed to delete flight:', error);
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'Failed to delete flight',
        code: 'DELETE_FLIGHT_ERROR',
        statusCode: error.statusCode || 500
      }
    } as ApiResponse<any>;
  }
}); 