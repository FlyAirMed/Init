import { getDb } from '../../../utils/firebase-admin'
import { Flight, ApiResponse } from '../../../../types'

export default defineEventHandler(async (event) => {
  try {
    // Connect to database
    const db = getDb();
    const flightsCollection = db.collection('flights');
    
    // Get all flights
    const snapshot = await flightsCollection.get();
    
    // Format the results
    const flights = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Flight[];
    
    return {
      success: true,
      data: {
        flights
      }
    } as ApiResponse<{ flights: Flight[] }>;
  } catch (error: any) {
    console.error('Failed to fetch flights:', error);
    
    return {
      success: false,
      error: {
        message: error.message || 'Failed to fetch flights',
        code: 'FETCH_FLIGHTS_ERROR',
        statusCode: 500
      }
    } as ApiResponse<any>;
  }
}); 