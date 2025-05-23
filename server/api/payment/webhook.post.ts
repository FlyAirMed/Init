import Stripe from 'stripe';
import { sendMail } from '../../utils/mail';
import { getDb } from '../../utils/firebase-admin';
import type { FlightSegment } from '../../../types';

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

interface FlightData {
  segments: FlightSegment[];
}

interface BookingData {
  flightId: string;
  flightData: FlightData;
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
    total_outbound: string;
    returnFlightId?: string;
    returnFrom?: string;
    returnTo?: string;
    returnDate?: string;
    return_price_adult?: string;
    return_price_child?: string;
    return_price_infant?: string;
    total_return?: string;
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

      // Calculate total price
      const totalPrice = bookingData.amount;

      // Format passenger counts
      const passengerCounts = [
        bookingData.metadata.passengers_adults ? `${bookingData.metadata.passengers_adults} Erwachsene` : null,
        bookingData.metadata.passengers_children ? `${bookingData.metadata.passengers_children} Kinder` : null,
        bookingData.metadata.passengers_infants ? `${bookingData.metadata.passengers_infants} Babys` : null
      ].filter(Boolean).join(', ');

      // Format flight details
      const flightDetails = [
        `Hinflug: ${bookingData.metadata.from} → ${bookingData.metadata.to} am ${bookingData.metadata.date}`,
        bookingData.metadata.returnFlightId ? `Rückflug: ${bookingData.metadata.returnFrom} → ${bookingData.metadata.returnTo} am ${bookingData.metadata.returnDate}` : null
      ].filter(Boolean).join('\n');

      // Format price details
      const priceDetails = [
        `Hinflug: ${bookingData.metadata.total_outbound}€`,
        bookingData.metadata.returnFlightId ? `Rückflug: ${bookingData.metadata.total_return}€` : null,
        `Gesamtpreis: ${totalPrice}€`
      ].filter(Boolean).join('\n');

      // Send email to admin
      await sendMail({
        to: process.env.ADMIN_EMAIL || '',
        subject: 'Neue Flugbuchung',
        html: `
          <h2>Neue Flugbuchung</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2c5282;">Buchungsdetails</h3>
            <p><strong>Buchungsnummer:</strong> ${metadata.bookingId}</p>
            <p><strong>Flug ID:</strong> ${bookingData.flightId}</p>
            <p><strong>Route:</strong> ${bookingData.metadata.from} → ${bookingData.metadata.to}</p>
            <p><strong>Datum:</strong> ${bookingData.metadata.date}</p>
            ${bookingData.metadata.returnFlightId ? `
              <p><strong>Rückflug ID:</strong> ${bookingData.metadata.returnFlightId}</p>
              <p><strong>Rückflug Route:</strong> ${bookingData.metadata.returnFrom} → ${bookingData.metadata.returnTo}</p>
              <p><strong>Rückflug Datum:</strong> ${bookingData.metadata.returnDate}</p>
            ` : ''}
            
            <h4 style="color: #2c5282; margin-top: 20px;">Flugdetails</h4>
            ${bookingData.flightData.segments.map((segment, index) => `
              <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 6px;">
                <p><strong>Flug ${index + 1}:</strong> ${segment.flightNumber}</p>
                <p><strong>Route:</strong> ${segment.from} → ${segment.to}</p>
                <p><strong>Abflug:</strong> ${new Date(segment.departure).toLocaleString()}</p>
                <p><strong>Ankunft:</strong> ${new Date(segment.arrival).toLocaleString()}</p>
                <p><strong>Dauer:</strong> ${segment.duration}</p>
                <p><strong>Gepäck:</strong> ${segment.baggageAllowance.cabin}kg Handgepäck, ${segment.baggageAllowance.checked}kg aufgegebenes Gepäck</p>
              </div>
            `).join('')}
            
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
            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              <h5 style="color: #2c5282; margin-bottom: 10px;">Hinflug</h5>
              <ul style="list-style: none; padding: 0;">
                <li>Erwachsene: ${bookingData.metadata.passengers_adults} x ${bookingData.metadata.price_adult}€</li>
                <li>Kinder: ${bookingData.metadata.passengers_children} x ${bookingData.metadata.price_child}€</li>
                <li>Babys: ${bookingData.metadata.passengers_infants} x ${bookingData.metadata.price_infant}€</li>
                <li style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;"><strong>Hinflug Gesamt:</strong> ${bookingData.metadata.total_outbound}€</li>
              </ul>
              
              ${bookingData.metadata.returnFlightId ? `
                <h5 style="color: #2c5282; margin: 20px 0 10px 0;">Rückflug</h5>
                <ul style="list-style: none; padding: 0;">
                  <li>Erwachsene: ${bookingData.metadata.passengers_adults} x ${bookingData.metadata.return_price_adult}€</li>
                  <li>Kinder: ${bookingData.metadata.passengers_children} x ${bookingData.metadata.return_price_child}€</li>
                  <li>Babys: ${bookingData.metadata.passengers_infants} x ${bookingData.metadata.return_price_infant}€</li>
                  <li style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;"><strong>Rückflug Gesamt:</strong> ${bookingData.metadata.total_return}€</li>
                </ul>
              ` : ''}
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #2c5282;">
                <p style="font-size: 1.2em;"><strong>Gesamtbetrag:</strong> ${totalPrice}€</p>
              </div>
            </div>
          </div>
        `
      });

      // Send confirmation email to customer
      await sendMail({
        to: bookingData.contactPerson.email,
        subject: 'Ihre Flugbuchung wurde bestätigt',
        html: `
          <h2>Vielen Dank für Ihre Buchung!</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p>Ihre Flugbuchung wurde erfolgreich abgeschlossen.</p>
            <p><strong>Buchungsnummer:</strong> ${metadata.bookingId}</p>
            
            <h3 style="color: #2c5282; margin-top: 20px;">Flugdetails</h3>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p><strong>Hinflug:</strong> ${bookingData.metadata.from} → ${bookingData.metadata.to}</p>
              <p><strong>Datum:</strong> ${bookingData.metadata.date}</p>
              <p><strong>Preis:</strong> ${bookingData.metadata.total_outbound}€</p>
              
              ${bookingData.metadata.returnFlightId ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <p><strong>Rückflug:</strong> ${bookingData.metadata.returnFrom} → ${bookingData.metadata.returnTo}</p>
                  <p><strong>Datum:</strong> ${bookingData.metadata.returnDate}</p>
                  <p><strong>Preis:</strong> ${bookingData.metadata.total_return}€</p>
                </div>
              ` : ''}
              
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2c5282;">
                <p style="font-size: 1.2em;"><strong>Gesamtbetrag:</strong> ${totalPrice}€</p>
              </div>
            </div>
            
            <p><strong>Passagiere:</strong> ${passengerCounts}</p>
          </div>
        `
      });
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