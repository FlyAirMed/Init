import Stripe from 'stripe';
import { sendMail } from '../../utils/mail';

const config = useRuntimeConfig();

const stripe = new Stripe(config.stripeSecretKey!, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  // Get the raw request body as a string
  const rawBody = await readRawBody(event);
  const sig = getHeader(event, 'stripe-signature');

  if (!sig || !rawBody) {
    throw createError({
      statusCode: 400,
      message: 'Missing stripe signature or request body',
    });
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripeWebhookSecret!
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      // Hole die Metadaten aus der Session
      const metadata = session.metadata;
      if (!metadata) {
        throw createError({
          statusCode: 400,
          message: 'No metadata found in session',
        });
      }

      // Erstelle eine detaillierte E-Mail für den Admin
      const emailHtml = `
        <h2>Neue Flugbuchung</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #2c5282;">Buchungsdetails</h3>
          <p><strong>Flug ID:</strong> ${metadata.flightId}</p>
          <p><strong>Route:</strong> ${metadata.from} → ${metadata.to}</p>
          <p><strong>Datum:</strong> ${metadata.date}</p>
          
          <h4 style="color: #2c5282; margin-top: 20px;">Passagiere</h4>
          <ul style="list-style: none; padding: 0;">
            <li>Erwachsene: ${metadata.passengers_adults} x ${metadata.price_adult}€</li>
            <li>Kinder: ${metadata.passengers_children} x ${metadata.price_child}€</li>
            <li>Babys: ${metadata.passengers_infants} x ${metadata.price_infant}€</li>
          </ul>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p><strong>Gesamtbetrag:</strong> ${(session.amount_total! / 100).toFixed(2)}€</p>
            <p><strong>Kunde:</strong> ${session.customer_details?.email || 'Nicht angegeben'}</p>
          </div>
        </div>
      `;

      // Sende E-Mail an Admin
      if (config.adminEmail) {
        await sendMail({
          to: config.adminEmail,
          subject: `Neue Flugbuchung: ${metadata.from} → ${metadata.to}`,
          html: emailHtml,
        });
      }

      // Sende Bestätigungs-E-Mail an Kunden
      if (session.customer_details?.email) {
        await sendMail({
          to: session.customer_details.email,
          subject: 'Ihre Flugbuchung wurde bestätigt',
          html: `
            <h2>Vielen Dank für Ihre Buchung!</h2>
            <p>Ihre Flugbuchung wurde erfolgreich abgeschlossen.</p>
            <p><strong>Flug:</strong> ${metadata.from} → ${metadata.to}</p>
            <p><strong>Datum:</strong> ${metadata.date}</p>
            <p><strong>Buchungsnummer:</strong> ${metadata.flightId}</p>
          `,
        });
      }
    }

    return { received: true };
  } catch (err: any) {
    console.error('Webhook error:', err);
    throw createError({
      statusCode: 400,
      message: `Webhook Error: ${err.message}`,
    });
  }
}); 