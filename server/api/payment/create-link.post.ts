import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { amount, currency, description, metadata } = body;

  try {
    // Konvertiere den Euro-Betrag in Cent
    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'eur',
            product_data: {
              name: 'Flugbuchung',
              description: description,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.PUBLIC_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_URL}/`,
      metadata: metadata,
      locale: 'de',
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
}); 