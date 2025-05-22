import Stripe from 'stripe';
import { getDb } from '../../utils/firebase-admin';

const config = useRuntimeConfig();

const stripe = new Stripe(config.stripeSecretKey!, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { 
    amount,
    currency,
    description,
    metadata,
    contactPerson,
    additionalPassengers
  } = body;

  try {
    // Speichere die Buchung in Firestore
    const db = getDb();
    const bookingsRef = db.collection('bookings');

    const bookingData = {
      flightId: metadata.flightId,
      contactPerson: {
        firstName: contactPerson.firstName,
        lastName: contactPerson.lastName,
        email: contactPerson.email,
        phone: contactPerson.phone,
        birthDate: contactPerson.birthDate,
        address: contactPerson.address
      },
      additionalPassengers: additionalPassengers.map((passenger: any) => ({
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        birthDate: passenger.birthDate
      })),
      amount: amount,
      metadata,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await bookingsRef.add(bookingData);
    console.log('Booking saved with ID:', docRef.id);

    // Erstelle den Payment Link mit der Buchungs-ID in den Metadaten
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'eur',
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.public.baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.baseUrl}/booking/cancel`,
      metadata: {
        bookingId: docRef.id
      }
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
}); 