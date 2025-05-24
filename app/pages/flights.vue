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

            <!-- Error Message -->
            <div v-if="error" class="flex justify-center items-center min-h-[400px]">
                <div class="text-center">
                    <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-500 mb-4" />
                    <p class="text-white text-lg">{{ error }}</p>
                    <p class="text-white text-sm mt-2">Sie werden in Kürze zur Startseite weitergeleitet...</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-else-if="isLoading" class="flex justify-center items-center min-h-[400px]">
                <div class="text-center">
                    <UIcon name="i-heroicons-arrow-path" class="h-12 w-12 text-white animate-spin mb-4" />
                    <p class="text-white text-lg">Flüge werden geladen...</p>
                </div>
            </div>

            <!-- Content based on active step -->
            <div class="flex justify-center">
                <div class="w-full max-w-4xl">
                    <!-- Flight selection content -->
                    <div v-if="activeStep === 0">
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
                                                <UIcon name="fluent-emoji-high-contrast:airplane-departure"
                                                    class="h-5 w-5 text-blue-600" />
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
                                            <div v-if="!selectedReturnFlight || flight.id === selectedFlight?.id"
                                                class="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-md text-white shadow-lg">
                                                <div class="flex flex-col">
                                                    <div class="flex items-center">
                                                        <UIcon name="i-heroicons-currency-euro" class="h-5 w-5" />
                                                        <div class="text-lg font-bold">{{ calculateTotalPrice(flight)
                                                            }}€</div>
                                                    </div>
                                                    <div class="text-xs text-white/90 mt-1 flex items-center gap-1">
                                                        <UIcon name="i-heroicons-information-circle" class="h-4 w-4" />
                                                        <span>Gesamtpreis {{ priceText }}</span>
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
                                    <div class="p-6">
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
                                                                    AIRPORTS[segment.to].name }}
                                                            </div>
                                                            <div class="text-sm text-gray-600">{{ segment.departure }} -
                                                                {{ segment.arrival }}</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-base font-semibold text-gray-700">{{
                                                        segment.duration }}</div>
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
                                                            segment.departure }}</div>
                                                        <div class="text-sm text-gray-600">{{
                                                            AIRPORTS[segment.from].name }}</div>
                                                    </div>
                                                    <div
                                                        class="bg-white p-4 rounded-xl ring-1 ring-blue-200/30 hover:ring-blue-200/50 transition-all">
                                                        <div class="flex items-center gap-2 mb-2">
                                                            <UIcon name="i-heroicons-arrow-trending-down"
                                                                class="h-4 w-4 text-blue-500" />
                                                            <div class="text-sm text-gray-600">Ankunft</div>
                                                        </div>
                                                        <div class="text-base font-semibold text-gray-800">{{
                                                            segment.arrival }}</div>
                                                        <div class="text-sm text-gray-600">{{ AIRPORTS[segment.to].name
                                                        }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Luggage Information -->
                                        <div
                                            class="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl ring-1 ring-blue-200/30">
                                            <div class="flex items-center gap-3 mb-4">
                                                <div
                                                    class="bg-white p-2 pb-1 rounded-lg shadow-sm ring-1 ring-blue-200/30">
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
                                                        pro Person gültig. Bei {{
                                                            searchParams?.passengers?.adults || 1 }} Erwachsenen stehen
                                                        insgesamt {{
                                                            searchParams?.passengers?.adults || 1 }}x Handgepäck und {{
                                                            searchParams?.passengers?.adults || 1
                                                        }}x 23kg Aufgabegepäck zur Verfügung.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Passenger Information -->
                    <div v-if="activeStep === 1"
                        class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-white p-2 rounded-lg shadow-sm ring-1 ring-blue-200/30">
                                <UIcon name="i-heroicons-user-group" class="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-800">Passagierinformationen</h2>
                        </div>
                        <PassengerStep :total-adults="searchParams?.passengers?.adults || 1"
                            :total-children="searchParams?.passengers?.children || 0"
                            :total-infants="searchParams?.passengers?.infants || 0"
                            @update:passengers="handlePassengerData" @form-valid="handlePassengerFormValid" />
                    </div>

                    <!-- Payment Information -->
                    <div v-if="activeStep === 2"
                        class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-white p-2 rounded-lg shadow-sm ring-1 ring-blue-200/30">
                                <UIcon name="i-heroicons-credit-card" class="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-800">Zahlungsinformationen</h2>
                        </div>
                        <PaymentForm :amount="calculateTotalPrice(selectedFlight.value)" currency="eur"
                            :booking-details="{
                                flightNumber: selectedFlight?.id,
                                returnFlightNumber: selectedReturnFlight?.id,
                                from: AIRPORTS[selectedFlight?.origin]?.name,
                                to: AIRPORTS[selectedFlight?.destination]?.name,
                                date: formatDate(selectedFlight?.date),
                                returnFrom: selectedReturnFlight ? AIRPORTS[selectedReturnFlight?.origin]?.name : undefined,
                                returnTo: selectedReturnFlight ? AIRPORTS[selectedReturnFlight?.destination]?.name : undefined,
                                returnDate: selectedReturnFlight ? formatDate(selectedReturnFlight?.date) : undefined,
                                prices: selectedFlight?.prices,
                                returnPrices: selectedReturnFlight?.prices,
                                passengers: searchParams?.passengers
                            }" :contact-person="passengerData?.contactPerson"
                            :additional-passengers="passengerData?.additionalPassengers" @success="handlePaymentSuccess"
                            @error="handlePaymentError" />
                    </div>

                    <!-- Confirmation -->
                    <div v-if="activeStep === 3"
                        class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-white p-2 rounded-lg shadow-sm ring-1 ring-blue-200/30">
                                <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-800">Buchungsbestätigung</h2>
                        </div>
                        <!-- Add confirmation details here -->
                    </div>

                    <!-- Navigation Buttons -->
                    <div v-if="!isLoading && activeStep < 2" class="mt-6 flex justify-between">
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
                                <UIcon name="fluent-emoji-high-contrast:airplane-departure" class="h-5 w-5" />
                            </template>
                        </UButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { AIRPORTS } from '../../types';
import PassengerStep from '../components/PassengerStep.vue';
import PaymentForm from '../components/PaymentForm.vue';

const flights = ref([]);
const searchParams = ref(null);
const activeStep = ref(0);
const selectedFlight = ref(null);
const selectedReturnFlight = ref(null);
const isPassengerFormValid = ref(false);
const passengerData = ref(null);
const isLoading = ref(true);
const error = ref('');

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
    console.log('Parent received form validation state:', isValid);
    isPassengerFormValid.value = isValid;
};

// set next step
const nextStep = () => {
    console.log('Next step clicked, validation state:', {
        activeStep: activeStep.value,
        isPassengerFormValid: isPassengerFormValid.value
    });

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Calculate duration between two times
const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return '-- : --';

    // Convert ISO strings to time strings first
    const depTimeStr = new Date(departureTime).toTimeString().slice(0, 5);
    const arrTimeStr = new Date(arrivalTime).toTimeString().slice(0, 5);

    const [depHours, depMinutes] = depTimeStr.split(':').map(Number);
    const [arrHours, arrMinutes] = arrTimeStr.split(':').map(Number);

    // Validate that we have valid numbers
    if (isNaN(depHours) || isNaN(depMinutes) || isNaN(arrHours) || isNaN(arrMinutes)) {
        return '-- : --';
    }

    let durationMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle next day arrival

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}min`;
};

// Calculate total price for a flight
const calculateTotalPrice = (flight) => {
    if (!flight || !flight.prices) return 0;
    if (!searchParams.value) return flight.prices.adult || 0;

    const { adults = 1, children = 0, infants = 0 } = searchParams.value.passengers || {};

    // Calculate price for the current flight
    const adultTotal = Number(flight.prices.adult) * Number(adults);
    const childTotal = Number(flight.prices.child) * Number(children);
    const infantTotal = Number(flight.prices.infant) * Number(infants);
    const currentFlightPrice = Number((adultTotal + childTotal + infantTotal).toFixed(2));

    // If this is the outbound flight and we have a return flight, add its price
    if (flight.id === selectedFlight.value?.id && selectedReturnFlight.value) {
        const returnAdultTotal = Number(selectedReturnFlight.value.prices.adult) * Number(adults);
        const returnChildTotal = Number(selectedReturnFlight.value.prices.child) * Number(children);
        const returnInfantTotal = Number(selectedReturnFlight.value.prices.infant) * Number(infants);
        const returnFlightPrice = Number((returnAdultTotal + returnChildTotal + returnInfantTotal).toFixed(2));
        return Number((currentFlightPrice + returnFlightPrice).toFixed(2));
    }

    return currentFlightPrice;
};

const priceText = computed(() => {
    return selectedReturnFlight.value ? 'für Hin- und Rückflug' : 'für Hinflug';
});

onMounted(async () => {
    try {
        isLoading.value = true;
        error.value = '';
        const route = useRoute();
        const flightId = route.query.id;
        const returnFlightId = route.query.returnId;

        if (!flightId) {
            throw new Error('Keine Flug-ID gefunden');
        }

        // Fetch departure flight details by ID
        const { data: departureData, error: departureError } = await useFetch(`/api/flights/${flightId}`, {
            key: `flight-${flightId}`,
            transform: (response) => {
                if (!response?.success) {
                    throw new Error('Flugdaten konnten nicht geladen werden');
                }
                return response;
            }
        });

        if (departureError.value) {
            throw new Error('Fehler beim Laden der Flugdaten');
        }

        selectedFlight.value = departureData.value.data.flight;
        flights.value = [selectedFlight.value];

        // If it's a round trip and we have a return flight ID, fetch that too
        if (returnFlightId) {
            const { data: returnData, error: returnError } = await useFetch(`/api/flights/${returnFlightId}`, {
                key: `flight-${returnFlightId}`,
                transform: (response) => {
                    if (!response?.success) {
                        throw new Error('Rückflugdaten konnten nicht geladen werden');
                    }
                    return response;
                }
            });

            if (returnError.value) {
                throw new Error('Fehler beim Laden der Rückflugdaten');
            }

            if (returnData.value?.success) {
                selectedReturnFlight.value = returnData.value.data.flight;
                flights.value.push(selectedReturnFlight.value);
            }
        }

        // Set passenger information from URL
        searchParams.value = {
            passengers: {
                adults: Number(route.query.adults) || 1,
                children: Number(route.query.children) || 0,
                infants: Number(route.query.infants) || 0
            }
        };
    } catch (err) {
        console.error('Error loading flight data:', err);
        error.value = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
        // Navigate back to home page after 3 seconds
        setTimeout(() => {
            navigateTo('/');
        }, 3000);
    } finally {
        isLoading.value = false;
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