import Stripe from 'stripe';
import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getDb } from '../../utils/firebase-admin';
import type { Flight } from '../../../types';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'eur', metadata = {} } = body;

    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Der Betrag muss größer als 0 sein',
      });
    }

    // Get flight details from database
    const db = getDb();
    const flightDoc = await db.collection('flights').doc(metadata.flightId).get();
    
    if (!flightDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Flug nicht gefunden',
      });
    }

    const flight = flightDoc.data() as Flight;
    if (!flight) {
      throw createError({
        statusCode: 404,
        message: 'Flugdaten nicht gefunden',
      });
    }

    const description = `Flug von ${flight.origin} nach ${flight.destination}`;

    // Create price first
    const price = await stripe.prices.create({
      currency,
      product_data: {
        name: 'Flugbuchung',
        metadata: {
          description,
        },
      },
      unit_amount: Number(amount),
    });

    // Create payment link with the price
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        flightId: metadata.flightId,
        from: flight.origin,
        to: flight.destination,
        date: flight.date,
        price: String(amount),
        segments: JSON.stringify(flight.segments),
      },
    });

    return {
      url: paymentLink.url,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }
    throw createError({
      statusCode: 500,
      message: 'Ein unerwarteter Fehler ist aufgetreten',
    });
  }
}); 