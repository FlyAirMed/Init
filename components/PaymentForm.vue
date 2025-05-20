<template>
  <div class="payment-form">
    <div class="booking-summary">
      <h3>Buchungsübersicht</h3>
      <div class="summary-details">
        <p><strong>Flug:</strong> {{ bookingDetails?.flightNumber }}</p>
        <p><strong>Von:</strong> {{ bookingDetails?.from }}</p>
        <p><strong>Nach:</strong> {{ bookingDetails?.to }}</p>
        <p><strong>Datum:</strong> {{ bookingDetails?.date }}</p>
        <p><strong>Preis:</strong> {{ formatAmount(amount) }} {{ currency?.toUpperCase() || 'EUR' }}</p>
      </div>
    </div>

    <div class="payment-button">
      <button @click="createPaymentLink" :disabled="loading" class="submit-button">
        {{ loading ? 'Wird geladen...' : `${formatAmount(amount)} ${currency?.toUpperCase() || 'EUR'} bezahlen` }}
      </button>
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
  price: number;
}

const props = defineProps<{
  amount: number;
  currency?: string;
  bookingDetails?: BookingDetails;
}>();

const loading = ref(false);

const formatAmount = (amount: number) => {
  // Konvertiere den Betrag in Euro (von Cent)
  return (amount / 100).toFixed(2);
};

const createPaymentLink = async () => {
  if (!props.amount || props.amount <= 0) {
    console.error('Ungültiger Betrag');
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch('/api/payment/create-link', {
      method: 'POST',
      body: {
        amount: props.amount, // Betrag in Cent
        currency: props.currency || 'eur',
        metadata: {
          bookingDetails: props.bookingDetails,
        },
      },
    });

    if (data.value?.url) {
      // Öffne den Payment Link in einem neuen Tab
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
  border-radius: 4px;
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

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>