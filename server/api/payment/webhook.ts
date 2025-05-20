import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';
import { sendOrderConfirmation } from '../../utils/email';
import { createBooking } from '../../utils/booking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  const signature = getHeader(event, 'stripe-signature');
  const body = await readRawBody(event);

  if (!signature || !body) {
    throw createError({
      statusCode: 400,
      message: 'Missing stripe signature or body',
    });
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      
      // Send order confirmation email
      await sendOrderConfirmation({
        email: paymentIntent.metadata.customerEmail,
        orderId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });

      // Create booking
      await createBooking({
        orderId: paymentIntent.id,
        customerEmail: paymentIntent.metadata.customerEmail,
        bookingDetails: paymentIntent.metadata.bookingDetails,
      });
    }

    return { received: true };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 