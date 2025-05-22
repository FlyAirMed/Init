import { getDb } from '../../utils/firebase-admin';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required'
    });
  }

  try {
    const db = getDb();
    const bookingRef = db.collection('bookings').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found'
      });
    }

    return {
      id: bookingDoc.id,
      ...bookingDoc.data()
    };
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
}); 