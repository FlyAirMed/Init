import Stripe from 'stripe';
import { getDb } from '../../utils/firebase-admin';

const config = useRuntimeConfig();

const stripe = new Stripe(config.stripeSecretKey!, {
  apiVersion: '2025-04-30.basil',
});

interface PaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata: {
    flightId: string;
    returnFlightId?: string;
    from: string;
    to: string;
    returnFrom?: string;
    returnTo?: string;
    date: string;
    returnDate?: string;
    passengers_adults: string;
    passengers_children: string;
    passengers_infants: string;
    price_adult: string;
    price_child: string;
    price_infant: string;
    return_price_adult?: string;
    return_price_child?: string;
    return_price_infant?: string;
  };
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
  };
  additionalPassengers: Array<{
    firstName: string;
    lastName: string;
    birthDate: string;
    type: 'adult' | 'child' | 'infant';
  }>;
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
    
    // Wenn es ein Rückflug gibt, hole auch diese Daten
    let returnFlightData = null;
    if (metadata.returnFlightId) {
      const returnFlightRef = db.collection('flights').doc(metadata.returnFlightId);
      const returnFlightDoc = await returnFlightRef.get();
      
      if (!returnFlightDoc.exists) {
        throw createError({
          statusCode: 404,
          message: 'Rückflug nicht gefunden'
        });
      }
      
      returnFlightData = returnFlightDoc.data();
    }

    // Calculate total price
    const calculateFlightPrice = (prices: { adult: number; child: number; infant: number }, passengers: { adults: number; children: number; infants: number }) => {
      const adultTotal = Number(prices.adult) * Number(passengers.adults);
      const childTotal = Number(prices.child) * Number(passengers.children);
      const infantTotal = Number(prices.infant) * Number(passengers.infants);
      return Number((adultTotal + childTotal + infantTotal).toFixed(2));
    };

    const outboundTotal = calculateFlightPrice(
      {
        adult: Number(metadata.price_adult) || 0,
        child: Number(metadata.price_child) || 0,
        infant: Number(metadata.price_infant) || 0
      },
      {
        adults: Number(metadata.passengers_adults) || 0,
        children: Number(metadata.passengers_children) || 0,
        infants: Number(metadata.passengers_infants) || 0
      }
    );

    let returnTotal = 0;
    if (metadata.returnFlightId) {
      returnTotal = calculateFlightPrice(
        {
          adult: Number(metadata.return_price_adult) || 0,
          child: Number(metadata.return_price_child) || 0,
          infant: Number(metadata.return_price_infant) || 0
        },
        {
          adults: Number(metadata.passengers_adults) || 0,
          children: Number(metadata.passengers_children) || 0,
          infants: Number(metadata.passengers_infants) || 0
        }
      );
    }

    const totalAmount = Number((outboundTotal + returnTotal).toFixed(2));

    // Verify that the total matches the provided amount
    if (Math.abs(totalAmount - amount) > 0.01) {
      throw createError({
        statusCode: 400,
        message: `Ungültiger Gesamtpreis. Erwartet: ${totalAmount}€, Bereitgestellt: ${amount}€`
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
      flightData: flightData,
      returnFlightId: metadata.returnFlightId,
      returnFlightData: returnFlightData,
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

    // Create Stripe payment link
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'eur',
            product_data: {
              name: `Flug ${metadata.from} → ${metadata.to}`,
              description: description,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.public.publicUrl}/booking/success`,
      cancel_url: `${config.public.publicUrl}/`,
      metadata: {
        bookingId: docRef.id,
        ...metadata,
        total_outbound: String(outboundTotal),
        total_return: String(returnTotal),
        total_amount: String(totalAmount)
      },
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