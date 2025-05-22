<template>
  <div class="payment-form">
    <div class="booking-summary">
      <h3>Buchungsübersicht</h3>
      <div class="summary-details">
        <p><strong>Flug:</strong> {{ bookingDetails?.flightNumber }}</p>
        <p><strong>Von:</strong> {{ bookingDetails?.from }}</p>
        <p><strong>Nach:</strong> {{ bookingDetails?.to }}</p>
        <p><strong>Datum:</strong> {{ bookingDetails?.date }}</p>

        <!-- Passenger Details -->
        <div class="mt-4">
          <h4 class="font-semibold mb-2">Passagiere</h4>
          <p v-if="bookingDetails?.passengers?.adults">
            <strong>Erwachsene:</strong> {{ bookingDetails.passengers.adults }} x {{
              formatAmount(bookingDetails.prices.adult) }}€
          </p>
          <p v-if="bookingDetails?.passengers?.children">
            <strong>Kinder:</strong> {{ bookingDetails.passengers.children }} x {{
              formatAmount(bookingDetails.prices.child) }}€
          </p>
          <p v-if="bookingDetails?.passengers?.infants">
            <strong>Babys:</strong> {{ bookingDetails.passengers.infants }} x {{
              formatAmount(bookingDetails.prices.infant) }}€
          </p>
        </div>

        <!-- Total Price -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-lg font-semibold">
            <strong>Gesamtpreis:</strong> {{ formatAmount(amount) }}€
          </p>
        </div>
      </div>
    </div>

    <div class="payment-button">
      <UButton @click="createPaymentLink" :loading="loading" color="blue" size="lg" class="w-full">
        {{ loading ? 'Wird geladen...' : `${formatAmount(amount)}€ bezahlen` }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface BookingDetails {
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  prices: {
    adult: number;
    child: number;
    infant: number;
  };
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

const props = defineProps<{
  amount: number;
  currency?: string;
  bookingDetails?: BookingDetails;
}>();

const loading = ref(false);

const formatAmount = (amount: number) => {
  return amount.toFixed(2);
};

const createPaymentLink = async () => {
  if (!props.amount || props.amount <= 0) {
    console.error('Ungültiger Betrag');
    return;
  }

  loading.value = true;
  try {
    const passengerCount =
      (props.bookingDetails?.passengers?.adults || 0) +
      (props.bookingDetails?.passengers?.children || 0) +
      (props.bookingDetails?.passengers?.infants || 0);

    const passengerDescription = [
      props.bookingDetails?.passengers?.adults ? `${props.bookingDetails.passengers.adults} Erwachsene` : null,
      props.bookingDetails?.passengers?.children ? `${props.bookingDetails.passengers.children} Kinder` : null,
      props.bookingDetails?.passengers?.infants ? `${props.bookingDetails.passengers.infants} Babys` : null
    ].filter(Boolean).join(', ');

    const { data } = await useFetch('/api/payment/create-link', {
      method: 'POST',
      body: {
        amount: props.amount,
        currency: props.currency || 'eur',
        description: `Flug ${props.bookingDetails?.from} → ${props.bookingDetails?.to} am ${props.bookingDetails?.date} für ${passengerDescription}`,
        metadata: {
          flightId: props.bookingDetails?.flightNumber,
          from: props.bookingDetails?.from,
          to: props.bookingDetails?.to,
          date: props.bookingDetails?.date,
          passengers_adults: String(props.bookingDetails?.passengers?.adults || 0),
          passengers_children: String(props.bookingDetails?.passengers?.children || 0),
          passengers_infants: String(props.bookingDetails?.passengers?.infants || 0),
          price_adult: String(props.bookingDetails?.prices?.adult || 0),
          price_child: String(props.bookingDetails?.prices?.child || 0),
          price_infant: String(props.bookingDetails?.prices?.infant || 0)
        },
      },
    });

    if (data.value?.url) {
      window.open(data.value.url, '_blank');
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Payment Links:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.payment-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.booking-summary {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.summary-details {
  margin-top: 10px;
}

.summary-details p {
  margin: 5px 0;
}

.payment-button {
  margin-top: 20px;
}
</style>