import { getDb } from '../../utils/firebase-admin'
import { Flight, ApiResponse } from '../../../types'

export interface FlightResponse extends ApiResponse<{
  flight: Flight;
}> {}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Flight ID is required'
      })
    }

    const db = getDb()
    const flightDoc = await db.collection('flights').doc(id).get()
    
    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flight not found'
      })
    }

    const flight = {
      id: flightDoc.id,
      ...flightDoc.data()
    } as Flight

    return {
      success: true,
      data: {
        flight
      }
    } as FlightResponse
  } catch (error: any) {
    console.error('Get flight error:', error)
    
    return {
      success: false,
      error: {
        message: error.statusMessage || error.message || 'An error occurred while fetching flight details',
        code: 'FLIGHT_DETAILS_ERROR',
        statusCode: error.statusCode || 500
      }
    } as FlightResponse
  }
}) 