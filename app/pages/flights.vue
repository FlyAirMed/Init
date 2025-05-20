<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 py-8">
        <div class="container mx-auto px-4">
            <!-- Stepper -->
            <div class="mb-8">
                <UStepper v-model="activeStep" :items="stepperItems" color="blue" size="lg" class="w-full" />
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mb-8">
                <UButton v-if="activeStep > 0" icon="i-heroicons-chevron-left" color="white" variant="soft" size="sm"
                    @click="handlePrevStep">
                    Zurück
                </UButton>
                <UButton v-if="activeStep < stepperItems.length - 1" icon="i-heroicons-chevron-right" color="white"
                    variant="soft" size="sm" :disabled="activeStep === 1 && !passengerStepRef?.isFormValid"
                    @click="handleNextStep">
                    Weiter
                </UButton>
            </div>

            <!-- Content based on active step -->
            <div class="flex justify-center">
                <div v-if="activeStep === 0" class="w-full max-w-4xl">
                    <!-- Flight selection content -->
                    <!-- Flight Cards -->
                    <div class="grid gap-8">
                        <div v-for="flight in flights" :key="flight.id"
                            class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <!-- Flight Header -->
                            <div
                                class="p-6 border-b border-blue-200/30 bg-gradient-to-r from-blue-800/20 via-blue-700/20 to-blue-800/20">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="bg-white p-3 rounded-xl shadow-sm ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                            <UIcon name="i-heroicons-airplane-takeoff" class="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 class="text-lg font-semibold text-gray-800">
                                                {{ AIRPORTS[flight.origin].name }} → {{
                                                    AIRPORTS[flight.destination].name }}
                                            </h2>
                                            <p class="text-sm text-gray-600">{{ formatDate(flight.date) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg">
                                            <div class="flex flex-col">
                                                <div class="flex items-center gap-2 mb-1">
                                                    <UIcon name="i-heroicons-currency-euro" class="h-5 w-5" />
                                                    <div class="text-2xl font-bold">{{ calculateTotalPrice(flight) }}€
                                                    </div>
                                                </div>
                                                <div class="text-sm opacity-90">
                                                    <div class="flex items-center gap-1">
                                                        <UIcon name="i-heroicons-user-group" class="h-4 w-4" />
                                                        <span>Für {{ searchParams?.passengers?.adults || 1 }}
                                                            Erwachsene</span>
                                                    </div>
                                                    <template v-if="searchParams?.passengers?.children">
                                                        <div class="flex items-center gap-1">
                                                            <UIcon name="i-heroicons-user" class="h-4 w-4" />
                                                            <span>{{ searchParams?.passengers?.children }} Kinder</span>
                                                        </div>
                                                    </template>
                                                    <template v-if="searchParams?.passengers?.infants">
                                                        <div class="flex items-center gap-1">
                                                            <UIcon name="i-heroicons-user-circle" class="h-4 w-4" />
                                                            <span>{{ searchParams?.passengers?.infants }} Babys</span>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Flight Details -->
                            <div class="p-6">
                                <!-- Flight Segments -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div v-for="(segment, index) in flight.segments" :key="index"
                                        class="bg-white/90 backdrop-blur-sm p-6 rounded-xl ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                        <div class="flex items-center justify-between mb-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="bg-white p-2 rounded-lg shadow-sm ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                                    <UIcon name="i-heroicons-airplane" class="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div class="text-base font-medium text-gray-800">
                                                        {{ AIRPORTS[segment.from].name }} → {{ AIRPORTS[segment.to].name
                                                        }}
                                                    </div>
                                                    <div class="text-sm text-gray-600">
                                                        {{ formatSegmentTime(segment.departure) }} - {{
                                                            formatSegmentTime(segment.arrival) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-base font-semibold text-gray-700">{{ segment.duration }}
                                            </div>
                                        </div>

                                        <!-- Segment Details -->
                                        <div class="grid grid-cols-2 gap-4">
                                            <div
                                                class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <UIcon name="i-heroicons-arrow-trending-up"
                                                        class="h-4 w-4 text-blue-500" />
                                                    <div class="text-sm text-gray-600">Abflug</div>
                                                </div>
                                                <div class="text-base font-semibold text-gray-800">{{
                                                    formatSegmentTime(segment.departure) }}</div>
                                                <div class="text-sm text-gray-600">{{ AIRPORTS[segment.from].name }}
                                                </div>
                                            </div>
                                            <div
                                                class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <UIcon name="i-heroicons-arrow-trending-down"
                                                        class="h-4 w-4 text-blue-500" />
                                                    <div class="text-sm text-gray-600">Ankunft</div>
                                                </div>
                                                <div class="text-base font-semibold text-gray-800">{{
                                                    formatSegmentTime(segment.arrival) }}</div>
                                                <div class="text-sm text-gray-600">{{ AIRPORTS[segment.to].name }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Luggage Information -->
                                <div class="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl ring-1 ring-blue-200/30">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div class="bg-white p-2 rounded-lg shadow-sm ring-1 ring-blue-200/30">
                                            <UIcon name="i-heroicons-suitcase" class="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-800">Gepäckinformationen</h3>
                                            <p class="text-sm text-gray-600">Pro Person inklusive</p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30">
                                            <div class="flex items-center gap-2 mb-2">
                                                <UIcon name="i-heroicons-briefcase" class="h-4 w-4 text-blue-500" />
                                                <div class="text-sm text-gray-600">Handgepäck</div>
                                            </div>
                                            <div class="text-base font-semibold text-gray-800">1x Cabin</div>
                                            <div class="text-sm text-gray-600">Max. 55 x 40 x 20 cm</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30">
                                            <div class="flex items-center gap-2 mb-2">
                                                <UIcon name="i-heroicons-suitcase" class="h-4 w-4 text-blue-500" />
                                                <div class="text-sm text-gray-600">Aufgegebenes Gepäck</div>
                                            </div>
                                            <div class="text-base font-semibold text-gray-800">1x 23kg</div>
                                            <div class="text-sm text-gray-600">Max. 158 cm (L+B+H)</div>
                                        </div>
                                    </div>
                                    <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <div class="flex items-start gap-2">
                                            <UIcon name="i-heroicons-information-circle"
                                                class="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div class="text-sm text-gray-700">
                                                <span class="font-medium">Hinweis:</span> Die Gepäckmenge ist pro Person
                                                gültig.
                                                Bei {{ searchParams?.passengers?.adults || 1 }} Erwachsenen stehen
                                                insgesamt
                                                {{ searchParams?.passengers?.adults || 1 }}x Handgepäck und
                                                {{ searchParams?.passengers?.adults || 1 }}x 23kg Aufgabegepäck zur
                                                Verfügung.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Booking Button -->
                                <div class="mt-6 flex justify-end">
                                    <UButton color="blue" size="lg" class="px-8" @click="selectFlight(flight)">
                                        Weiter zur Passagierinformationen
                                        <template #trailing>
                                            <UIcon name="i-heroicons-arrow-right" class="h-5 w-5" />
                                        </template>
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="activeStep === 1" class="w-full max-w-4xl">
                    <PassengerStep ref="passengerStepRef" :total-passengers="searchParams?.passengers?.adults || 1" />
                </div>
                <div v-else-if="activeStep === 2" class="w-full max-w-4xl">
                    <!-- Payment content -->
                    <UCard class="bg-white/90 backdrop-blur-sm">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-credit-card" class="h-5 w-5 text-blue-600" />
                                <h2 class="text-xl font-semibold text-gray-800">Zahlungsinformationen</h2>
                            </div>
                        </template>
                        <PaymentForm :amount="calculateTotalPrice(selectedFlight)" currency="eur" :booking-details="{
                            flightNumber: selectedFlight?.id,
                            from: AIRPORTS[selectedFlight?.origin]?.name,
                            to: AIRPORTS[selectedFlight?.destination]?.name,
                            date: formatDate(selectedFlight?.date),
                            price: calculateTotalPrice(selectedFlight)
                        }" @success="handlePaymentSuccess" @error="handlePaymentError" />
                    </UCard>
                </div>
                <div v-else-if="activeStep === 3" class="w-full max-w-4xl">
                    <!-- Confirmation content -->
                    <UCard class="bg-white/90 backdrop-blur-sm">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-blue-600" />
                                <h2 class="text-xl font-semibold text-gray-800">Buchungsbestätigung</h2>
                            </div>
                        </template>
                        <!-- Add confirmation details here -->
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AIRPORTS } from '../../types';
import PassengerStep from '../components/PassengerStep.vue';
import PaymentForm from '../components/PaymentForm.vue';

const flights = ref([]);
const searchParams = ref(null);
const activeStep = ref(0);
const passengerStepRef = ref(null);
const selectedFlight = ref(null);

// Form data
const contactPerson = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: ''
});

const additionalPassengers = ref([]);

const stepperItems = [
    {
        title: 'Flugauswahl',
        description: 'Wählen Sie Ihren Flug',
        icon: 'i-heroicons-airplane',
        disabled: false
    },
    {
        title: 'Passagiere',
        description: 'Passagierinformationen',
        icon: 'i-heroicons-user-group',
        disabled: true
    },
    {
        title: 'Bezahlung',
        description: 'Zahlungsinformationen',
        icon: 'i-heroicons-credit-card',
        disabled: true
    },
    {
        title: 'Bestätigung',
        description: 'Buchungsbestätigung',
        icon: 'i-heroicons-check-circle',
        disabled: true
    }
];

const isContactFormValid = () => {
    return contactPerson.value.firstName &&
        contactPerson.value.lastName &&
        contactPerson.value.email &&
        contactPerson.value.phone &&
        contactPerson.value.birthDate &&
        contactPerson.value.address;
};

const handleNextStep = () => {
    if (activeStep.value === 0) {
        stepperItems[1].disabled = false;
    } else if (activeStep.value === 1 && passengerStepRef.value?.isFormValid) {
        stepperItems[2].disabled = false;
    }
    if (activeStep.value < stepperItems.length - 1) {
        activeStep.value++;
    }
};

const handlePrevStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
};

// Format date to German format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format segment time
const formatSegmentTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Calculate total price for a flight
const calculateTotalPrice = (flight) => {
    if (!flight || !flight.prices) return 0;
    if (!searchParams.value) return flight.prices.adult || 0;

    const { adults = 1, children = 0, infants = 0 } = searchParams.value.passengers || {};
    return (
        (flight.prices.adult * adults) +
        (flight.prices.child * children) +
        (flight.prices.infant * infants)
    );
};

const handlePaymentSuccess = () => {
    // Zeige Erfolgsmeldung
    toast.add({
        title: 'Zahlung erfolgreich',
        description: 'Vielen Dank für Ihre Buchung! Sie erhalten in Kürze eine Bestätigung per E-Mail.',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 5000
    });

    // Optional: Weiterleitung zur Bestätigungsseite
    // navigateTo('/booking-confirmation');
};

const handlePaymentError = (error) => {
    // Zeige Fehlermeldung
    toast.add({
        title: 'Zahlung fehlgeschlagen',
        description: error.message || 'Bitte versuchen Sie es später erneut.',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
    });
};

// Add flight selection handler
const selectFlight = (flight) => {
    selectedFlight.value = flight;
    handleNextStep();
};

onMounted(async () => {
    try {
        const route = useRoute();
        const search = JSON.parse(atob(route.query.search || '{}'));
        const results = JSON.parse(atob(route.query.results || '{}'));

        if (search) {
            searchParams.value = search;
        }
        if (results.flights) {
            flights.value = results.flights;
        }
    } catch (error) {
        console.error('Error loading flight data:', error);
    }
});
</script>