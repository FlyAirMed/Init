import Stripe from 'stripe';
import { sendMail } from '../../utils/mail';
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

interface BookingData {
  flightId: string;
  flightData: any;
  contactPerson: ContactPerson;
  additionalPassengers: AdditionalPassenger[];
  amount: number;
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
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default defineEventHandler(async (event) => {
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
      
      const metadata = session.metadata;
      if (!metadata?.bookingId) {
        throw createError({
          statusCode: 400,
          message: 'No booking ID found in session metadata',
        });
      }

      // Hole die Buchungsdaten aus der Datenbank
      const db = getDb();
      const bookingRef = db.collection('bookings').doc(metadata.bookingId);
      const bookingDoc = await bookingRef.get();

      if (!bookingDoc.exists) {
        throw createError({
          statusCode: 404,
          message: 'Booking not found',
        });
      }

      const bookingData = bookingDoc.data() as BookingData;
      if (!bookingData) {
        throw createError({
          statusCode: 404,
          message: 'Booking data not found',
        });
      }

      // Aktualisiere den Buchungsstatus
      await bookingRef.update({
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      });

      // Formatiere das Geburtsdatum
      const formatBirthDate = (date: CalendarDate) => {
        return `${date.day}.${date.month}.${date.year}`;
      };

      // Erstelle eine detaillierte E-Mail für den Admin
      const emailHtml = `
        <h2>Neue Flugbuchung</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #2c5282;">Buchungsdetails</h3>
          <p><strong>Buchungsnummer:</strong> ${metadata.bookingId}</p>
          <p><strong>Flug ID:</strong> ${bookingData.flightId}</p>
          <p><strong>Route:</strong> ${bookingData.metadata.from} → ${bookingData.metadata.to}</p>
          <p><strong>Datum:</strong> ${bookingData.metadata.date}</p>
          
          <h4 style="color: #2c5282; margin-top: 20px;">Kontaktperson</h4>
          <p><strong>Name:</strong> ${bookingData.contactPerson.firstName} ${bookingData.contactPerson.lastName}</p>
          <p><strong>E-Mail:</strong> ${bookingData.contactPerson.email}</p>
          <p><strong>Telefon:</strong> ${bookingData.contactPerson.phone}</p>
          <p><strong>Geburtsdatum:</strong> ${formatBirthDate(bookingData.contactPerson.birthDate)}</p>
          <p><strong>Adresse:</strong> ${bookingData.contactPerson.address.street}, ${bookingData.contactPerson.address.postalCode} ${bookingData.contactPerson.address.city}, ${bookingData.contactPerson.address.country}</p>
          
          <h4 style="color: #2c5282; margin-top: 20px;">Weitere Passagiere</h4>
          <ul style="list-style: none; padding: 0;">
            ${bookingData.additionalPassengers.map((passenger) => `
              <li>
                ${passenger.firstName} ${passenger.lastName} 
                (${passenger.type === 'adult' ? 'Erwachsener' : passenger.type === 'child' ? 'Kind' : 'Säugling'})
                - Geboren: ${formatBirthDate(passenger.birthDate)}
              </li>
            `).join('')}
          </ul>
          
          <h4 style="color: #2c5282; margin-top: 20px;">Preisübersicht</h4>
          <ul style="list-style: none; padding: 0;">
            <li>Erwachsene: ${bookingData.metadata.passengers_adults} x ${bookingData.metadata.price_adult}€</li>
            <li>Kinder: ${bookingData.metadata.passengers_children} x ${bookingData.metadata.price_child}€</li>
            <li>Babys: ${bookingData.metadata.passengers_infants} x ${bookingData.metadata.price_infant}€</li>
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
          subject: `Neue Flugbuchung: ${bookingData.metadata.from} → ${bookingData.metadata.to}`,
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
            <p><strong>Buchungsnummer:</strong> ${metadata.bookingId}</p>
            <p><strong>Flug:</strong> ${bookingData.metadata.from} → ${bookingData.metadata.to}</p>
            <p><strong>Datum:</strong> ${bookingData.metadata.date}</p>
            <p><strong>Passagiere:</strong> ${bookingData.contactPerson.firstName} ${bookingData.contactPerson.lastName}${bookingData.additionalPassengers.length > 0 ? ` + ${bookingData.additionalPassengers.length} weitere Passagiere` : ''}</p>
            <p><strong>Gesamtbetrag:</strong> ${(session.amount_total! / 100).toFixed(2)}€</p>
          `,
        });
      }
    }

    return { received: true };
  } catch (error) {
    console.error('Webhook error:', error);
    throw createError({
      statusCode: error instanceof Error ? 400 : 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}); 