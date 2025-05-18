import { getDb } from '../../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = getDb()
    const flightsRef = db.collection('flights')
    const snapshot = await flightsRef.get()
    
    const flights = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return flights
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
}) 