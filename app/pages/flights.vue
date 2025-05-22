<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 py-8 relative overflow-hidden">
        <!-- Background Decorative Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating Icons -->
            <div class="absolute top-1/4 left-10 animate-float-slow">
                <UIcon name="fluent-emoji-high-contrast:airplane" class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute top-1/3 right-20 animate-float-slower">
                <UIcon name="fluent-emoji-high-contrast:airplane-departure" class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute bottom-1/4 left-1/4 animate-float-slowest">
                <UIcon name="fluent-emoji-high-contrast:globe-showing-europe-africa"
                    class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute top-2/3 right-1/3 animate-float-slow">
                <UIcon name="fluent-emoji-high-contrast:airplane-arrival" class="h-12 w-12 text-blue-300/40" />
            </div>

            <!-- Animated Circles -->
            <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full animate-pulse-slow"></div>
            <div
                class="absolute bottom-1/3 left-1/3 w-[32rem] h-[32rem] bg-blue-300/10 rounded-full animate-pulse-slower">
            </div>
            <div class="absolute top-2/3 right-1/4 w-72 h-72 bg-blue-200/10 rounded-full animate-pulse-slowest"></div>
        </div>

        <div class="container mx-auto px-4 relative">
            <!-- Stepper -->
            <div class="mb-8">
                <UStepper v-model="activeStep" :items="stepperItems" size="md"
                    class="[&_.stepper-step--active_.stepper-step-label]:text-white [&_.stepper-step-label]:text-gray-300 [&_.stepper-step--active_.stepper-step-description]:text-blue-200 [&_.stepper-step-description]:text-gray-400"
                    style=" color: white !important; " />
            </div>

            <!-- Content based on active step -->
            <div class=" flex justify-center">
                <div class="w-fit">
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
                                            class="bg-white p-3 pb-2 rounded-xl shadow-sm ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                            <UIcon name="fluent-emoji-high-contrast:airplane-departure" class=" h-5 w-5
                                                text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 class="text-lg font-semibold text-gray-800">
                                                {{ AIRPORTS[flight.origin].name }} → {{
                                                    AIRPORTS[flight.destination].name }}
                                            </h2>
                                            <p class="text-sm text-gray-600">{{ formatDate(flight.date) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center flex-col gap-4">
                                        <div
                                            class="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-md text-white shadow-lg">
                                            <div class="flex flex-col">
                                                <div class="flex items-center">
                                                    <UIcon name="i-heroicons-currency-euro" class="h-5 w-5" />
                                                    <div class="text-lg font-bold">{{ calculateTotalPrice(flight)
                                                    }}€
                                                    </div>
                                                </div>
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

                                <!-- Flight Details -->
                                <div class="p-6" v-if="activeStep === 0">
                                    <!-- Flight Segments -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div v-for="(segment, index) in flight.segments" :key="index"
                                            class="bg-white/90 backdrop-blur-sm p-6 rounded-xl ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                            <div class="flex items-center justify-between mb-4">
                                                <div class="flex items-center gap-3">
                                                    <div
                                                        class="bg-white p-2 pb-0 rounded-lg shadow-sm ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                                        <UIcon name="fluent-emoji-high-contrast:airplane"
                                                            class="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div class="text-base font-medium text-gray-800">
                                                            {{ AIRPORTS[segment.from].name }} → {{
                                                                AIRPORTS[segment.to].name
                                                            }}
                                                        </div>
                                                        <div class="text-sm text-gray-600">
                                                            {{ formatSegmentTime(segment.departure) }} - {{
                                                                formatSegmentTime(segment.arrival) }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="text-base font-semibold text-gray-700">{{
                                                    segment.duration
                                                }}
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
                                                    <div class="text-sm text-gray-600">{{
                                                        AIRPORTS[segment.from].name }}
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
                                                    <div class="text-sm text-gray-600">{{ AIRPORTS[segment.to].name
                                                    }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Luggage Information -->
                                    <div
                                        class="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl ring-1 ring-blue-200/30">
                                        <div class="flex items-center gap-3 mb-4">
                                            <div class="bg-white p-2 pb-1 rounded-lg shadow-sm ring-1 ring-blue-200/30">
                                                <UIcon name="fluent-emoji-high-contrast:handbag"
                                                    class="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 class="text-lg font-semibold text-gray-800">Gepäckinformationen
                                                </h3>
                                                <p class="text-sm text-gray-600">Pro Person inklusive</p>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <UIcon name="fluent-emoji-high-contrast:backpack"
                                                        class="h-4 w-4 text-blue-500" />
                                                    <div class="text-sm text-gray-600">Handgepäck</div>
                                                </div>
                                                <div class="text-base font-semibold text-gray-800">1x Cabin (7kg)
                                                </div>
                                                <div class="text-sm text-gray-600">Max. 55 x 40 x 20 cm</div>
                                            </div>
                                            <div class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <UIcon name="fluent-emoji-high-contrast:baggage-claim"
                                                        class="h-4 w-4 text-blue-500" />
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
                                                    <span class="font-medium">Hinweis:</span> Die Gepäckmenge ist
                                                    pro
                                                    Person
                                                    gültig.
                                                    Bei {{ searchParams?.passengers?.adults || 1 }} Erwachsenen
                                                    stehen
                                                    insgesamt
                                                    {{ searchParams?.passengers?.adults || 1 }}x Handgepäck und
                                                    {{ searchParams?.passengers?.adults || 1 }}x 23kg Aufgabegepäck
                                                    zur
                                                    Verfügung.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div v-if="activeStep === 1" class="w-full max-w-4xl">
                                    <PassengerStep :total-adults="searchParams?.passengers?.adults || 1"
                                        :total-children="searchParams?.passengers?.children || 0"
                                        :total-infants="searchParams?.passengers?.infants || 0"
                                        @update:passengers="handlePassengerData"
                                        @form-valid="handlePassengerFormValid" />
                                </div>

                                <!-- Booking Button -->
                                <div class="mt-6 flex justify-between">
                                    <!-- go back Button -->
                                    <UButton size="lg" class="px-8" @click="navigateTo('/')">
                                        <template #icon>
                                            <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
                                        </template>
                                        Zurück zur Flugauswahl
                                    </UButton>
                                    <UButton size="lg" class="px-8" @click="nextStep()"
                                        :disabled="activeStep === 1 && !isPassengerFormValid">
                                        Weiter
                                        <template #trailing>
                                            <UIcon name="fluent-emoji-high-contrast:airplane-departure"
                                                class="h-5 w-5" />
                                        </template>
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="activeStep === 2" class="w-full max-w-4xl">
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
                            prices: selectedFlight?.prices,
                            passengers: searchParams?.passengers
                        }" :contact-person="passengerData?.contactPerson"
                            :additional-passengers="passengerData?.additionalPassengers" @success="handlePaymentSuccess"
                            @error="handlePaymentError" />
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
const selectedFlight = ref(null);
const isPassengerFormValid = ref(false);
const passengerData = ref(null);

const contactPerson = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    zip: '',
    city: '',
    country: ''
});


const stepperItems = [
    {
        title: 'Flugauswahl',
        description: 'Wählen Sie Ihren Flug',
        icon: 'fluent-emoji-high-contrast:airplane-arrival',
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

// Handle passenger form data
const handlePassengerData = (data) => {
    passengerData.value = data;
};

// Handle passenger form validation
const handlePassengerFormValid = (isValid) => {
    isPassengerFormValid.value = isValid;
};

// set next step
const nextStep = () => {
    if (activeStep.value === 1 && !isPassengerFormValid.value) {
        // Zeige Fehlermeldung wenn das Formular nicht valide ist
        alert('Bitte füllen Sie alle erforderlichen Felder korrekt aus.');
        return;
    }
    activeStep.value++;
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

    // Berechne den Gesamtpreis in Euro (nicht in Cent)
    const totalPrice = (
        (flight.prices.adult * adults) +
        (flight.prices.child * children) +
        (flight.prices.infant * infants)
    );

    return totalPrice;
};



onMounted(async () => {
    try {
        const route = useRoute();
        const flightId = route.query.id;

        if (flightId) {
            // Fetch flight details by ID
            const { data } = await useFetch(`/api/flights/${flightId}`);
            if (data.value?.success) {
                selectedFlight.value = data.value.data.flight;
                flights.value = [selectedFlight.value];

                // Set passenger information from URL
                searchParams.value = {
                    passengers: {
                        adults: Number(route.query.adults) || 1,
                        children: Number(route.query.children) || 0,
                        infants: Number(route.query.infants) || 0
                    }
                };
            }
        }
    } catch (error) {
        console.error('Error loading flight data:', error);
    }
});
</script>

<style scoped>
/* Remove old stepper styles */
#reka-stepper-item-title-v-0 {
    color: white;
}

/* Stepper descriptions */
[id^="reka-stepper-item-description-v-1"] {
    color: white;
}

:deep(.stepper-step-label) {
    color: #fff !important;
}

:deep(.stepper-step--active .stepper-step-label) {
    color: #fff !important;
    font-weight: 700;
}

:deep(.stepper-step-description) {
    color: #bfdbfe !important;
    /* Tailwind blue-200 */
}

:deep(.stepper-step--active .stepper-step-description) {
    color: #fff !important;
    font-weight: 500;
}

.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out;
}

.animate-slide-up-delayed {
    animation: slideUp 0.8s ease-out 0.2s both;
}

.animate-slide-up-delayed-2 {
    animation: slideUp 0.8s ease-out 0.4s both;
}

.animate-fade-in-delayed {
    animation: fadeIn 0.8s ease-out 0.6s both;
}

.animate-bounce-slow {
    animation: bounce 2s infinite;
}

.animate-float-slow {
    animation: float 6s ease-in-out infinite;
}

.animate-float-slower {
    animation: float 8s ease-in-out infinite;
}

.animate-float-slowest {
    animation: float 10s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse 4s ease-in-out infinite;
}

.animate-pulse-slower {
    animation: pulse 6s ease-in-out infinite;
}

.animate-pulse-slowest {
    animation: pulse 8s ease-in-out infinite;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.1;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.2;
    }
}
</style>