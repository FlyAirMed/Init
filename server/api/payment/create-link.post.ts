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

    // Calculate total price (jetzt mit roundTrip-Logik)
    const getFlightPrice = (flight: any, type: 'oneWay' | 'roundTrip') => {
      if (!flight || !flight.prices) return { adult: 0, child: 0, infant: 0 };
      if (type === 'roundTrip') {
        return {
          adult: flight.prices.roundTripAdult ?? flight.prices.adult,
          child: flight.prices.roundTripChild ?? flight.prices.child,
          infant: flight.prices.roundTripInfant ?? flight.prices.infant,
        };
      } else {
        return {
          adult: flight.prices.adult,
          child: flight.prices.child,
          infant: flight.prices.infant,
        };
      }
    };

    const calculateFlightPrice = (prices: { adult: number; child: number; infant: number }, passengers: { adults: number; children: number; infants: number }) => {
      const adultTotal = Number(prices.adult) * Number(passengers.adults);
      const childTotal = Number(prices.child) * Number(passengers.children);
      const infantTotal = Number(prices.infant) * Number(passengers.infants);
      return Number((adultTotal + childTotal + infantTotal).toFixed(2));
    };

    const passengerCounts = {
      adults: Number(metadata.passengers_adults) || 0,
      children: Number(metadata.passengers_children) || 0,
      infants: Number(metadata.passengers_infants) || 0
    };

    // Outbound (Hinflug)
    const outboundPriceObj = getFlightPrice(flightData, metadata.returnFlightId ? 'roundTrip' : 'oneWay');
    const outboundTotal = calculateFlightPrice(outboundPriceObj, passengerCounts);

    // Return (Rückflug, falls vorhanden)
    let returnTotal = 0;
    let returnPriceObj = null;
    if (metadata.returnFlightId && returnFlightData) {
      returnPriceObj = getFlightPrice(returnFlightData, 'roundTrip');
      returnTotal = calculateFlightPrice(returnPriceObj, passengerCounts);
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

    // Create booking data object with only defined values
    const bookingData: any = {
      flightId: metadata.flightId,
      flightData: flightData,
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
      metadata: {
        ...metadata,
        // Only include return flight data if it exists
        ...(metadata.returnFlightId && {
          returnFlightId: metadata.returnFlightId,
          returnFrom: metadata.returnFrom,
          returnTo: metadata.returnTo,
          returnDate: metadata.returnDate,
          return_price_adult: metadata.return_price_adult,
          return_price_child: metadata.return_price_child,
          return_price_infant: metadata.return_price_infant
        })
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Only add returnFlightData if it exists
    if (returnFlightData) {
      bookingData.returnFlightData = returnFlightData;
    }

    const docRef = await bookingsRef.add(bookingData);
    console.log('Booking saved with ID:', docRef.id);

    // Passe die Metadaten für Stripe an, damit die richtigen Preise in den E-Mails stehen
    const stripeMetadata = {
      ...metadata,
      bookingId: docRef.id,
      price_adult: String(outboundPriceObj.adult),
      price_child: String(outboundPriceObj.child),
      price_infant: String(outboundPriceObj.infant),
      total_outbound: String(outboundTotal),
      ...(metadata.returnFlightId && returnPriceObj && {
        return_price_adult: String(returnPriceObj.adult),
        return_price_child: String(returnPriceObj.child),
        return_price_infant: String(returnPriceObj.infant),
        total_return: String(returnTotal)
      }),
      total_amount: String(totalAmount)
    };

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
      metadata: stripeMetadata,
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