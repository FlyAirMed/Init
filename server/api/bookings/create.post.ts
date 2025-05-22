import { getDb } from '../../utils/firebase-admin';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { 
    flightId, 
    contactPerson, 
    additionalPassengers, 
    amount, 
    customerEmail,
    metadata 
  } = body;

  try {
    const db = getDb();
    const bookingsRef = db.collection('bookings');

    // Erstelle ein neues Buchungsdokument
    const bookingData = {
      flightId,
      contactPerson,
      additionalPassengers,
      amount,
      customerEmail,
      metadata,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await bookingsRef.add(bookingData);

    return {
      success: true,
      bookingId: docRef.id,
      ...bookingData
    };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
}); 