<template>
  <div class="payment-form">
    <!-- Success Message -->
    <UAlert v-if="showSuccess" color="green" variant="soft" icon="i-heroicons-check-circle" class="mb-4">
      <template #title>Zahlung erfolgreich!</template>
      <template #description>
        Sie erhalten in Kürze eine E-Mail mit Ihren Flugtickets. Bitte überprüfen Sie auch Ihren Spam-Ordner.
      </template>
    </UAlert>

    <!-- Error Message -->
    <UAlert v-if="errorMessage" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4">
      {{ errorMessage }}
    </UAlert>

    <div class="booking-summary">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-blue-100 p-2 rounded-lg">
          <UIcon name="i-heroicons-ticket" class="h-6 w-6 text-blue-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900">Buchungsübersicht</h3>
      </div>

      <div class="summary-details space-y-4">
        <!-- Flight Details -->
        <div class="bg-white p-4 rounded-lg border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-paper-airplane" class="h-5 w-5 text-blue-600" />
            <h4 class="font-semibold text-gray-800">Flugdetails</h4>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <p><strong>Von:</strong> {{ bookingDetails?.from }}</p>
            <p><strong>Nach:</strong> {{ bookingDetails?.to }}</p>
            <p><strong>Datum:</strong> {{ bookingDetails?.date }}</p>
          </div>
        </div>

        <!-- Passenger Details -->
        <div class="bg-white p-4 rounded-lg border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-user-group" class="h-5 w-5 text-blue-600" />
            <h4 class="font-semibold text-gray-800">Passagiere</h4>
          </div>
          <div class="space-y-2">
            <p v-if="bookingDetails?.passengers?.adults" class="flex justify-between">
              <span>Erwachsene ({{ bookingDetails.passengers.adults }})</span>
              <span>{{ formatAmount(bookingDetails.prices.adult * bookingDetails.passengers.adults) }}€</span>
            </p>
            <p v-if="bookingDetails?.passengers?.children" class="flex justify-between">
              <span>Kinder ({{ bookingDetails.passengers.children }})</span>
              <span>{{ formatAmount(bookingDetails.prices.child * bookingDetails.passengers.children) }}€</span>
            </p>
            <p v-if="bookingDetails?.passengers?.infants" class="flex justify-between">
              <span>Babys ({{ bookingDetails.passengers.infants }})</span>
              <span>{{ formatAmount(bookingDetails.prices.infant * bookingDetails.passengers.infants) }}€</span>
            </p>
          </div>
        </div>

        <!-- Total Price -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-900">Gesamtpreis</span>
            <span class="text-2xl font-bold text-blue-600">{{ formatAmount(amount) }}€</span>
          </div>
        </div>
      </div>
    </div>

    <div class="payment-button">
      <UButton @click="createPaymentLink" :loading="loading" color="blue" size="xl"
        class="w-full h-14 text-lg font-semibold" :disabled="loading">
        <template v-if="loading">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5 mr-2" />
          Wird verarbeitet...
        </template>
        <template v-else>
          <UIcon name="i-heroicons-credit-card" class="h-5 w-5 mr-2" />
          {{ formatAmount(amount) }}€ bezahlen
        </template>
      </UButton>
      <p class="text-sm text-gray-500 text-center mt-2">
        Sichere Zahlung über Stripe
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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

interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
}

interface AdditionalPassenger {
  firstName: string;
  lastName: string;
  birthDate: string;
  type: 'adult' | 'child' | 'infant';
}

const props = defineProps<{
  amount: number;
  currency?: string;
  bookingDetails?: BookingDetails;
  contactPerson: ContactPerson;
  additionalPassengers: AdditionalPassenger[];
}>();

const loading = ref(false);
const errorMessage = ref('');
const showSuccess = ref(false);
const router = useRouter();

const formatAmount = (amount: number) => {
  return amount.toFixed(2);
};

const createPaymentLink = async () => {
  if (!props.amount || props.amount <= 0) {
    errorMessage.value = 'Ungültiger Betrag';
    return;
  }

  if (!props.contactPerson || !props.contactPerson.firstName) {
    errorMessage.value = 'Kontaktperson fehlt oder ist unvollständig';
    return;
  }

  if (!props.additionalPassengers || !Array.isArray(props.additionalPassengers)) {
    errorMessage.value = 'Zusätzliche Passagiere fehlen oder sind ungültig';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const passengerDescription = [
      props.bookingDetails?.passengers?.adults ? `${props.bookingDetails.passengers.adults} Erwachsene` : null,
      props.bookingDetails?.passengers?.children ? `${props.bookingDetails.passengers.children} Kinder` : null,
      props.bookingDetails?.passengers?.infants ? `${props.bookingDetails.passengers.infants} Babys` : null
    ].filter(Boolean).join(', ');

    const requestData = {
      amount: props.amount,
      currency: props.currency || 'eur',
      description: `Flug ${props.bookingDetails?.from} → ${props.bookingDetails?.to} am ${props.bookingDetails?.date} für ${passengerDescription}`,
      metadata: {
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
      contactPerson: {
        firstName: props.contactPerson.firstName,
        lastName: props.contactPerson.lastName,
        email: props.contactPerson.email,
        phone: props.contactPerson.phone,
        birthDate: props.contactPerson.birthDate,
        address: props.contactPerson.address
      },
      additionalPassengers: props.additionalPassengers.map(passenger => ({
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        birthDate: passenger.birthDate,
        type: passenger.type
      }))
    };

    const { data } = await useFetch('/api/payment/create-link', {
      method: 'POST',
      body: requestData,
    });

    if (data.value?.url) {
      showSuccess.value = true;
      // Open payment in new tab
      window.open(data.value.url, '_blank');
      // Redirect to success page with booking details
      setTimeout(() => {
        router.push({
          path: '/booking/success',
          query: {
            from: props.bookingDetails?.from,
            to: props.bookingDetails?.to,
            date: props.bookingDetails?.date,
            adults: props.bookingDetails?.passengers?.adults,
            children: props.bookingDetails?.passengers?.children,
            infants: props.bookingDetails?.passengers?.infants
          }
        });
      }, 2000);
    } else {
      errorMessage.value = 'Fehler beim Erstellen des Zahlungslinks';
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Payment Links:', error);
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.booking-summary {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-details {
  margin-top: 16px;
}

.payment-button {
  margin-top: 24px;
}
</style>