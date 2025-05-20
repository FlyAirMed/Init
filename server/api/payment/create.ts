import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey);

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'eur', metadata = {} } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Flugbuchung',
              description: `Flug von ${metadata.bookingDetails?.from} nach ${metadata.bookingDetails?.to}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/flights`,
      customer_email: metadata.customerEmail,
      metadata,
    });

    return {
      sessionId: session.id,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 