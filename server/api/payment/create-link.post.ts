import Stripe from 'stripe';
import { getDb } from '../../utils/firebase-admin';

const config = useRuntimeConfig();

const stripe = new Stripe(config.stripeSecretKey!, {
  apiVersion: '2025-04-30.basil',
});

interface CalendarDate {
  calendar: {
    identifier: string;
  };
  era: string;
  year: number;
  month: number;
  day: number;
}

interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: CalendarDate;
  address: Address;
}

interface AdditionalPassenger {
  firstName: string;
  lastName: string;
  birthDate: CalendarDate;
  type: 'adult' | 'child' | 'infant';
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata: {
    flightId: string;
    from: string;
    to: string;
    date: string;
    passengers_adults: string;
    passengers_children: string;
    passengers_infants: string;
    price_adult: string;
    price_child: string;
    price_infant: string;
  };
  contactPerson: ContactPerson;
  additionalPassengers: AdditionalPassenger[];
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentRequest>(event);
  const { 
    amount,
    currency,
    description,
    metadata,
    contactPerson,
    additionalPassengers
  } = body;

  try {
    // Überprüfe die Flug-ID und hole Flugdaten
    const db = getDb();
    const flightRef = db.collection('flights').doc(metadata.flightId);
    const flightDoc = await flightRef.get();

    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Flug nicht gefunden'
      });
    }

    const flightData = flightDoc.data();
    
    // Überprüfe die Preise
    const expectedAmount = (
      Number(metadata.price_adult) * Number(metadata.passengers_adults) +
      Number(metadata.price_child) * Number(metadata.passengers_children) +
      Number(metadata.price_infant) * Number(metadata.passengers_infants)
    );

    if (amount !== expectedAmount) {
      throw createError({
        statusCode: 400,
        message: 'Ungültiger Gesamtpreis'
      });
    }

    // Überprüfe die Passagieranzahl
    const totalPassengers = additionalPassengers.length + 1; // +1 für Kontaktperson
    const expectedPassengers = 
      Number(metadata.passengers_adults) + 
      Number(metadata.passengers_children) + 
      Number(metadata.passengers_infants);

    if (totalPassengers !== expectedPassengers) {
      throw createError({
        statusCode: 400,
        message: 'Ungültige Anzahl von Passagieren'
      });
    }

    // Speichere die Buchung in Firestore
    const bookingsRef = db.collection('bookings');

    const bookingData = {
      flightId: metadata.flightId,
      flightData: flightData, // Speichere auch die Flugdaten
      contactPerson: {
        firstName: contactPerson.firstName,
        lastName: contactPerson.lastName,
        email: contactPerson.email,
        phone: contactPerson.phone,
        birthDate: contactPerson.birthDate,
        address: contactPerson.address
      },
      additionalPassengers: additionalPassengers.map((passenger) => ({
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        birthDate: passenger.birthDate,
        type: passenger.type
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
      success_url: `${config.public.publicUrl}/booking/success`,
      cancel_url: `${config.public.publicUrl}/`,
      metadata: {
        bookingId: docRef.id,
        flightId: metadata.flightId
      }
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw createError({
      statusCode: error instanceof Error && 'statusCode' in error ? (error as { statusCode: number }).statusCode : 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}); 