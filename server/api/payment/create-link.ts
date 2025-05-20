import Stripe from 'stripe';
import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
});

export default defineEventHandler(async (event) => {
  try {
    console.log(stripe);
        console.log(config.stripeSecretKey,);

    const body = await readBody(event);
    const { amount, currency = 'eur', metadata = {} } = body;

    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Der Betrag muss größer als 0 sein',
      });
    }

    const bookingDetails = metadata.bookingDetails || {};
    const description = `Flug von ${bookingDetails.from || ''} nach ${bookingDetails.to || ''}`;

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
        from: bookingDetails.from || '',
        to: bookingDetails.to || '',
        date: bookingDetails.date || '',
        flightNumber: bookingDetails.flightNumber || '',
        price: String(bookingDetails.price || ''),
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