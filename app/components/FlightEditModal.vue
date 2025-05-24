<template>
    <UModal v-model:open="isOpen" class="max-w-[90vw] w-[1200px]">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <UIcon name="i-heroicons-paper-airplane" class="h-6 w-6" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">
                            {{ isEditing ? 'Flug bearbeiten' : 'Neuen Flug anlegen' }}
                        </h2>
                        <p class="text-sm text-gray-500">
                            Bitte füllen Sie alle erforderlichen Informationen aus
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <template #body>
            <!-- Error message -->
            <UAlert v-if="errorMessage" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4">
                {{ errorMessage }}
            </UAlert>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Flight Details Section -->
                <div class="p-6 bg-gray-50 rounded-xl">
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Flugdetails</h3>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="grid gap-6">
                            <!-- Flight Route Section -->
                            <div class="mb-6">
                                <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <UIcon name="i-heroicons-map" class="h-5 w-5" />
                                    Flugroute
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <UFormGroup label="Abflugort (Origin)" class="text-base"
                                        help="Wählen Sie den Startflughafen aus"
                                        :state="formValidation.origin.valid ? undefined : false"
                                        :error="formValidation.origin.message">
                                        <USelectMenu v-model="form.origin" :items="airportOptions"
                                            placeholder="Von welchem Flughafen startet der Flug?"
                                            icon="i-heroicons-map-pin" class="h-12 text-base w-full" :ui="{
                                                container: 'relative w-full',
                                                icon: { trailing: { pointer: 'cursor-pointer' } }
                                            }">
                                            <template #item="{ item }">
                                                <div class="flex items-center gap-2">
                                                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0" />
                                                    <div>
                                                        <p class="font-medium">{{ item.value }}</p>
                                                        <p class="text-xs text-gray-500">{{ item.label.split(' - ')[1]
                                                            }}</p>
                                                    </div>
                                                </div>
                                            </template>
                                        </USelectMenu>
                                    </UFormGroup>

                                    <UFormGroup label="Zielort (Destination)" class="text-base"
                                        help="Wählen Sie den Zielflughafen aus"
                                        :state="formValidation.destination.valid ? undefined : false"
                                        :error="formValidation.destination.message">
                                        <USelectMenu v-model="form.destination" :items="airportOptions"
                                            placeholder="Zu welchem Flughafen geht der Flug?" icon="i-heroicons-map-pin"
                                            class="h-12 text-base w-full" :ui="{
                                                container: 'relative w-full',
                                                icon: { trailing: { pointer: 'cursor-pointer' } }
                                            }">
                                            <template #item="{ item }">
                                                <div class="flex items-center gap-2">
                                                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0" />
                                                    <div>
                                                        <p class="font-medium">{{ item.value }}</p>
                                                        <p class="text-xs text-gray-500">{{ item.label.split(' - ')[1]
                                                            }}</p>
                                                    </div>
                                                </div>
                                            </template>
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>

                                <!-- Time Selection Cards -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                    <!-- Departure Time Card -->
                                    <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div class="flex items-center gap-2 mb-3">
                                            <UIcon name="i-heroicons-arrow-up-circle" class="h-5 w-5 text-blue-600" />
                                            <h5 class="font-medium text-blue-900">Abflug</h5>
                                        </div>
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Abflug von {{
                                                form.origin.label }}</span>
                                        </div>
                                        <UFormGroup :state="formValidation.departureTime.valid ? undefined : false"
                                            :error="formValidation.departureTime.message">
                                            <UInput v-model="form.departureTime" type="text"
                                                class="h-12 text-base bg-white" size="lg"
                                                placeholder="z.B. 14:30 Uhr" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Arrival Time Card -->
                                    <div class="p-4 bg-green-50 rounded-lg border border-green-100">
                                        <div class="flex items-center gap-2 mb-3">
                                            <UIcon name="i-heroicons-arrow-down-circle"
                                                class="h-5 w-5 text-green-600" />
                                            <h5 class="font-medium text-green-900">Ankunft</h5>
                                        </div>
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Ankunft in {{
                                                form.destination.label }}</span>
                                        </div>
                                        <UFormGroup :state="formValidation.arrivalTime.valid ? undefined : false"
                                            :error="formValidation.arrivalTime.message">
                                            <UInput v-model="form.arrivalTime" type="text"
                                                class="h-12 text-base bg-white" size="lg"
                                                placeholder="z.B. 16:45 Uhr" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <!-- Intermediate Stop Section -->
                                <div v-if="showIntermediateStop"
                                    class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div class="flex items-center gap-2 mb-4">
                                        <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-yellow-600" />
                                        <h5 class="font-medium text-yellow-900">Athen</h5>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- ATH Arrival -->
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="mb-2">
                                                <span class="text-sm font-medium text-gray-700">Ankunft von {{
                                                    form.origin.label }}</span>
                                            </div>
                                            <UFormGroup
                                                :state="formValidation.intermediateStop.arrival.valid ? undefined : false"
                                                :error="formValidation.intermediateStop.arrival.message">
                                                <UInput v-model="form.intermediateStop.arrival" type="text"
                                                    class="h-12 text-base" size="lg" placeholder="z.B. 15:45 Uhr" />
                                            </UFormGroup>
                                        </div>

                                        <!-- ATH Departure -->
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="mb-2">
                                                <span class="text-sm font-medium text-gray-700">Abflug nach {{
                                                    form.destination.label }}</span>
                                            </div>
                                            <UFormGroup
                                                :state="formValidation.intermediateStop.departure.valid ? undefined : false"
                                                :error="formValidation.intermediateStop.departure.message">
                                                <UInput v-model="form.intermediateStop.departure" type="text"
                                                    class="h-12 text-base" size="lg" placeholder="z.B. 16:30 Uhr" />
                                            </UFormGroup>
                                        </div>
                                    </div>

                                    <!-- Flight Number for First Segment (origin -> ATH) -->
                                    <div class="mt-4 bg-white p-4 rounded-lg">
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Flugnummer für {{
                                                form.origin.label }} - ATH</span>
                                        </div>
                                        <UFormGroup :state="formValidation.flightNumber.valid ? undefined : false"
                                            :error="formValidation.flightNumber.message">
                                            <UInput v-model="form.flightNumber" type="text" class="h-12 text-base"
                                                size="lg" placeholder="z.B. ATA123" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Duration for First Segment (origin -> ATH) -->
                                    <div class="mt-4 bg-white p-4 rounded-lg">
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Dauer von {{
                                                form.origin.label }} nach ATH</span>
                                        </div>
                                        <UFormGroup :state="formValidation.duration.valid ? undefined : false"
                                            :error="formValidation.duration.message">
                                            <UInput v-model="form.duration" type="text" class="h-12 text-base" size="lg"
                                                placeholder="z.B. 2 Stunden 30 Minuten" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Flight Number for Second Segment (ATH -> destination) -->
                                    <div class="mt-4 bg-white p-4 rounded-lg">
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Flugnummer für ATH - {{
                                                form.destination.label }}</span>
                                        </div>
                                        <UFormGroup
                                            :state="formValidation.intermediateStop.flightNumber.valid ? undefined : false"
                                            :error="formValidation.intermediateStop.flightNumber.message">
                                            <UInput v-model="form.intermediateStop.flightNumber" type="text"
                                                class="h-12 text-base" size="lg" placeholder="z.B. ATA456" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Duration for Second Segment (ATH -> destination) -->
                                    <div class="mt-4 bg-white p-4 rounded-lg">
                                        <div class="mb-2">
                                            <span class="text-sm font-medium text-gray-700">Dauer von ATH nach {{
                                                form.destination.label }}</span>
                                        </div>
                                        <UFormGroup
                                            :state="formValidation.intermediateStop.duration.valid ? undefined : false"
                                            :error="formValidation.intermediateStop.duration.message">
                                            <UInput v-model="form.intermediateStop.duration" type="text"
                                                class="h-12 text-base" size="lg"
                                                placeholder="z.B. 1 Stunde 45 Minuten" />
                                        </UFormGroup>
                                    </div>
                                </div>
                            </div>

                            <!-- Date and Time Section -->
                            <div class="mb-6">
                                <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <UIcon name="i-heroicons-calendar" class="h-5 w-5" />
                                    Datum & Zeit
                                </h4>

                                <!-- Datum Input -->
                                <div class="mb-4">
                                    <UFormGroup label="Abflugdatum" class="text-base"
                                        help="Wählen Sie das Datum des Fluges"
                                        :state="formValidation.date.valid ? undefined : false"
                                        :error="formValidation.date.message">
                                        <UInput v-model="form.date" type="date"
                                            :min="new Date().toISOString().split('T')[0]" class="h-12 text-base"
                                            size="lg" icon="i-heroicons-calendar-days" />
                                    </UFormGroup>
                                </div>

                                <!-- Duration Input (nur bei Direktflug) -->
                                <div v-if="!showIntermediateStop"
                                    class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div class="mb-2">
                                        <span class="text-sm font-medium text-gray-700">Dauer von {{ form.origin.label
                                        }} nach {{
                                                form.destination.label }}</span>
                                    </div>
                                    <UFormGroup :state="formValidation.duration.valid ? undefined : false"
                                        :error="formValidation.duration.message">
                                        <UInput v-model="form.duration" type="text" class="h-12 text-base" size="lg"
                                            placeholder="z.B. 2 Stunden 30 Minuten" />
                                    </UFormGroup>
                                </div>
                            </div>

                            <!-- Flugnummern -->
                            <div class="mb-6" v-if="!showIntermediateStop">
                                <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <UIcon name="i-heroicons-paper-airplane" class="h-5 w-5" />
                                    Flugnummern
                                </h4>
                                <div class="grid grid-cols-1 gap-4">
                                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <UFormGroup label="Hauptflugnummer" class="text-base"
                                            help="Flugnummer für den Hauptflug"
                                            :state="formValidation.flightNumber.valid ? undefined : false"
                                            :error="formValidation.flightNumber.message">
                                            <UInput v-model="form.flightNumber" type="text" class="h-12 text-base"
                                                size="lg" placeholder="z.B. ATA123" />
                                        </UFormGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Flight Details Meta Section -->
                <div class="p-6 bg-gray-50 rounded-xl">
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Zusätzliche Informationen</h3>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <!-- Price Section -->
                        <div class="mb-6">
                            <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <UIcon name="i-heroicons-currency-euro" class="h-5 w-5" />
                                Ticketpreise
                            </h4>
                            <div class="grid grid-cols-1 gap-4">
                                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <UIcon name="i-heroicons-user" class="h-5 w-5 text-blue-600" />
                                        <h5 class="font-medium text-blue-900">Erwachsene</h5>
                                    </div>
                                    <UFormGroup label="Erwachsenenpreis (One-Way) (€)" class="text-base"
                                        help="Preis für Erwachsene ab 12 Jahren (nur Hin- oder Rückflug)"
                                        :state="formValidation.prices.adult.valid ? undefined : false"
                                        :error="formValidation.prices.adult.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.adult" type="number" min="0" step="0.01"
                                                class="h-12 text-base pl-12" size="lg" />
                                            One-Way
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€ </span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                    <UFormGroup label="Erwachsenenpreis (Roundtrip) (€)" class="text-base"
                                        help="Preis für Erwachsene bei Hin- und Rückflug zusammen"
                                        :state="formValidation.prices.roundTripAdult?.valid ? undefined : false"
                                        :error="formValidation.prices.roundTripAdult?.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.roundTripAdult" placeholder="Roundtrip"
                                                type="number" min="0" step="0.01" class="h-12 text-base pl-12"
                                                size="lg" />
                                            Roundtrip
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                </div>

                                <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <UIcon name="i-heroicons-user-group" class="h-5 w-5 text-green-600" />
                                        <h5 class="font-medium text-green-900">Kinder</h5>
                                    </div>
                                    <UFormGroup label="Kinderpreis (One-Way) (€)" class="text-base"
                                        help="Preis für Kinder von 2-11 Jahren (nur Hin- oder Rückflug)"
                                        :state="formValidation.prices.child.valid ? undefined : false"
                                        :error="formValidation.prices.child.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.child" type="number" min="0" step="0.01"
                                                class="h-12 text-base pl-12" size="lg" />
                                            One-Way
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                    <UFormGroup label="Kinderpreis (Roundtrip) (€)" class="text-base"
                                        help="Preis für Kinder bei Hin- und Rückflug zusammen"
                                        :state="formValidation.prices.roundTripChild?.valid ? undefined : false"
                                        :error="formValidation.prices.roundTripChild?.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.roundTripChild" type="number" min="0"
                                                step="0.01" class="h-12 text-base pl-12" size="lg" />
                                            Roundtrip
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                </div>

                                <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <UIcon name="i-heroicons-user-circle" class="h-5 w-5 text-purple-600" />
                                        <h5 class="font-medium text-purple-900">Säuglinge</h5>
                                    </div>
                                    <UFormGroup label="Säuglingspreis (One-Way) (€)" class="text-base"
                                        help="Preis für Säuglinge unter 2 Jahren (nur Hin- oder Rückflug)"
                                        :state="formValidation.prices.infant.valid ? undefined : false"
                                        :error="formValidation.prices.infant.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.infant" type="number" min="0" step="0.01"
                                                class="h-12 text-base pl-12" size="lg" />
                                            Roundtrip
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                    <UFormGroup label="Säuglingspreis (Roundtrip) (€)" class="text-base"
                                        help="Preis für Säuglinge bei Hin- und Rückflug zusammen"
                                        :state="formValidation.prices.roundTripInfant?.valid ? undefined : false"
                                        :error="formValidation.prices.roundTripInfant?.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices.roundTripInfant" type="number" min="0"
                                                step="0.01" class="h-12 text-base pl-12" size="lg" />
                                            One-Way
                                            <div
                                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span class="text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </UFormGroup>
                                </div>
                            </div>
                        </div>

                        <!-- Baggage Allowance Section -->
                        <div class="mb-6">
                            <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <UIcon name="i-heroicons-suitcase" class="h-5 w-5" />
                                Gepäckinformationen
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <UFormGroup label="Handgepäck (kg)" class="text-base"
                                        help="Maximales Gewicht für Handgepäck"
                                        :state="formValidation.baggageAllowance.cabin.valid ? undefined : false"
                                        :error="formValidation.baggageAllowance.cabin.message">
                                        <UInput v-model="form.baggageAllowance.cabin" type="number" min="0"
                                            class="h-12 text-base" size="lg" />
                                    </UFormGroup>
                                </div>
                                <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <UFormGroup label="Aufgegebenes Gepäck (kg)" class="text-base"
                                        help="Maximales Gewicht für aufgegebenes Gepäck"
                                        :state="formValidation.baggageAllowance.checked.valid ? undefined : false"
                                        :error="formValidation.baggageAllowance.checked.message">
                                        <UInput v-model="form.baggageAllowance.checked" type="number" min="0"
                                            class="h-12 text-base" size="lg" />
                                    </UFormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end items-center space-x-4">
                <UButton variant="ghost" icon="i-heroicons-x-mark" label="Abbrechen" @click="closeModal"
                    class="px-4 py-2 text-red-500" />
                <UButton variant="solid" icon="i-heroicons-check" :loading="isLoading" :disabled="!isFormValid"
                    :label="isEditing ? 'Speichern' : 'Flug erstellen'" @click="saveFlight" class="px-4 py-2" />
            </div>
        </template>
    </UModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { AIRPORTS, FlightStatus } from '~~/types';

const props = defineProps({
    open: Boolean,
    flight: {
        type: Object,
        default: () => null
    }
});

const emits = defineEmits(['update:open', 'saved', 'error']);

const isOpen = computed({
    get: () => props.open,
    set: (value) => emits('update:open', value)
});

const isLoading = ref(false);
const errorMessage = ref('');
const isEditing = computed(() => !!props.flight?.id);
const isFormValid = computed(() => {
    const origin = form.origin?.value || form.origin;
    const destination = form.destination?.value || form.destination;

    // Debug logging
    console.log('Form validation check:', {
        origin,
        destination,
        date: form.date,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        availableSeats: form.availableSeats,
        adultPrice: form.prices.adult,
        intermediateStop: form.intermediateStop,
        showIntermediateStop: showIntermediateStop.value
    });

    // Basic validation
    if (!origin || !destination || !form.date || !form.departureTime || !form.arrivalTime) {
        console.log('Basic fields missing');
        return false;
    }

    if (origin === destination) {
        console.log('Origin and destination are the same');
        return false;
    }

    if (!form.availableSeats || form.availableSeats <= 0) {
        console.log('Invalid available seats');
        return false;
    }

    if (!form.prices.adult || form.prices.adult <= 0) {
        console.log('Invalid adult price');
        return false;
    }

    // Validate intermediate stop if needed
    if (showIntermediateStop.value) {
        if (!form.intermediateStop.arrival || !form.intermediateStop.departure) {
            console.log('Intermediate stop times missing');
            return false;
        }
    }

    console.log('Form is valid');
    return true;
});

// Form state
const initialFormState = {
    origin: '',
    destination: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    availableSeats: 150,
    prices: {
        adult: 299.99,
        child: 179.99,
        infant: 49.99,
        roundTripAdult: 0,
        roundTripChild: 0,
        roundTripInfant: 0
    },
    status: FlightStatus.ACTIVE,
    segments: [],
    intermediateStop: {
        arrival: '',
        departure: '',
        flightNumber: '',
        duration: ''
    },
    flightNumber: '',
    baggageAllowance: {
        cabin: 7,
        checked: 23
    }
};

const form = reactive({ ...initialFormState });

// Options for select inputs
const airportOptions = computed(() => {
    return Object.entries(AIRPORTS).map(([code, airport]) => ({
        label: `${code} - ${airport.name}`,
        value: code
    }));
});

// Add new validation functions
const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
};

// Modify formValidation computed
const formValidation = computed(() => ({
    origin: {
        valid: !!form.origin,
        message: !form.origin ? 'Bitte wählen Sie einen Abflughafen' : ''
    },
    destination: {
        valid: !!form.destination && form.destination !== form.origin,
        message: !form.destination
            ? 'Bitte wählen Sie einen Zielflughafen'
            : form.destination === form.origin
                ? 'Abflug- und Zielflughafen müssen unterschiedlich sein'
                : ''
    },
    date: {
        valid: !!form.date && validateDate(form.date),
        message: !form.date
            ? 'Bitte wählen Sie ein Datum'
            : !validateDate(form.date)
                ? 'Das Datum darf nicht in der Vergangenheit liegen'
                : ''
    },
    departureTime: {
        valid: !!form.departureTime,
        message: !form.departureTime ? 'Bitte geben Sie die Abflugzeit ein' : ''
    },
    arrivalTime: {
        valid: !!form.arrivalTime,
        message: !form.arrivalTime ? 'Bitte geben Sie die Ankunftszeit ein' : ''
    },
    intermediateStop: {
        arrival: {
            valid: !showIntermediateStop.value || !!form.intermediateStop.arrival,
            message: !form.intermediateStop.arrival ? 'Bitte geben Sie die Ankunftszeit in Athen ein' : ''
        },
        departure: {
            valid: !showIntermediateStop.value || !!form.intermediateStop.departure,
            message: !form.intermediateStop.departure ? 'Bitte geben Sie die Abflugzeit von Athen ein' : ''
        },
        flightNumber: {
            valid: !showIntermediateStop.value || !!form.intermediateStop.flightNumber,
            message: !form.intermediateStop.flightNumber ? 'Bitte geben Sie eine Flugnummer für den Zwischenstopp ein' : ''
        },
        duration: {
            valid: !showIntermediateStop.value || !!form.intermediateStop.duration,
            message: !form.intermediateStop.duration ? 'Bitte geben Sie die Flugdauer für den Zwischenstopp ein' : ''
        }
    },
    prices: {
        adult: {
            valid: form.prices.adult > 0,
            message: form.prices.adult <= 0 ? 'Bitte geben Sie einen gültigen Preis für Erwachsene ein' : ''
        },
        child: {
            valid: form.prices.child > 0,
            message: form.prices.child <= 0 ? 'Bitte geben Sie einen gültigen Preis für Kinder ein' : ''
        },
        infant: {
            valid: form.prices.infant > 0,
            message: form.prices.infant <= 0 ? 'Bitte geben Sie einen gültigen Preis für Säuglinge ein' : ''
        }
    },
    baggageAllowance: {
        cabin: {
            valid: form.baggageAllowance.cabin > 0,
            message: form.baggageAllowance.cabin <= 0 ? 'Bitte geben Sie ein gültiges Handgepäck-Gewicht ein' : ''
        },
        checked: {
            valid: form.baggageAllowance.checked > 0,
            message: form.baggageAllowance.checked <= 0 ? 'Bitte geben Sie ein gültiges Gepäck-Gewicht ein' : ''
        }
    },
    flightNumber: {
        valid: !!form.flightNumber,
        message: !form.flightNumber ? 'Bitte geben Sie eine Flugnummer für den Hauptflug ein' : ''
    },
    duration: {
        valid: !!form.duration,
        message: !form.duration ? 'Bitte geben Sie die Flugdauer ein' : ''
    },
}));

// Add computed property for showing intermediate stop
const showIntermediateStop = computed(() => {
    const origin = form.origin?.value || form.origin;
    const destination = form.destination?.value || form.destination;
    return (destination === 'DAM' && origin !== 'ATH') || (origin === 'DAM' && destination !== 'ATH');
});

// Function declarations
const resetForm = () => {
    Object.assign(form, initialFormState);
    form.prices = {
        adult: 0,
        child: 0,
        infant: 0,
        roundTripAdult: 0,
        roundTripChild: 0,
        roundTripInfant: 0
    };
    form.intermediateStop = {
        arrival: '',
        departure: '',
        flightNumber: '',
        duration: ''
    };
    delete form.id;
    errorMessage.value = '';
};

// Initialize form when flight changes
watch(() => props.flight, (newFlight) => {
    if (newFlight) {
        form.id = newFlight.id;
        form.origin = newFlight.origin?.value || newFlight.origin;
        form.destination = newFlight.destination?.value || newFlight.destination;
        form.date = newFlight.date;
        form.availableSeats = newFlight.availableSeats;
        form.status = newFlight.status;

        // Set departure and arrival times from segments if available
        if (newFlight.segments && newFlight.segments.length > 0) {
            if (newFlight.segments.length === 2) {
                // Flight with intermediate stop
                const firstSegment = newFlight.segments[0];
                const secondSegment = newFlight.segments[1];

                form.departureTime = firstSegment.departure;
                form.intermediateStop.arrival = firstSegment.arrival;
                form.intermediateStop.departure = secondSegment.departure;
                form.arrivalTime = secondSegment.arrival;

                // NEU: Lade Flugnummern und Dauern
                form.flightNumber = firstSegment.flightNumber || '';
                form.duration = firstSegment.duration || '';
                form.intermediateStop.flightNumber = secondSegment.flightNumber || '';
                form.intermediateStop.duration = secondSegment.duration || '';
            } else {
                // Direct flight
                const segment = newFlight.segments[0];
                form.departureTime = segment.departure;
                form.arrivalTime = segment.arrival;
                form.flightNumber = segment.flightNumber || '';
                form.duration = segment.duration || '';
                form.intermediateStop = {
                    arrival: '',
                    departure: '',
                    flightNumber: '',
                    duration: ''
                };
            }
        }

        form.prices = {
            adult: newFlight.prices?.adult || 299.99,
            child: newFlight.prices?.child || 179.99,
            infant: newFlight.prices?.infant || 49.99,
            roundTripAdult: newFlight.prices?.roundTripAdult || 0,
            roundTripChild: newFlight.prices?.roundTripChild || 0,
            roundTripInfant: newFlight.prices?.roundTripInfant || 0
        };

        form.baggageAllowance = {
            cabin: newFlight.baggageAllowance?.cabin || 8,
            checked: newFlight.baggageAllowance?.checked || 23
        };
    } else {
        resetForm();
    }
}, { immediate: true });

// Methods
const saveFlight = async () => {
    console.log('Form validation state:', {
        isFormValid: isFormValid.value,
        form: {
            origin: form.origin?.value || form.origin,
            destination: form.destination?.value || form.destination,
            date: form.date,
            departureTime: form.departureTime,
            arrivalTime: form.arrivalTime,
            availableSeats: form.availableSeats,
            prices: form.prices,
            intermediateStop: form.intermediateStop,
            baggageAllowance: form.baggageAllowance
        }
    });

    if (!isFormValid.value) {
        errorMessage.value = 'Bitte füllen Sie alle erforderlichen Felder korrekt aus';
        return;
    }

    try {
        isLoading.value = true;
        errorMessage.value = '';

        const dateStr = form.date;
        const segments = [];
        const origin = form.origin?.value || form.origin;
        const destination = form.destination?.value || form.destination;

        if (showIntermediateStop.value) {
            if (destination === 'DAM') {
                // First segment: Origin to ATH
                segments.push({
                    from: origin,
                    to: 'ATH',
                    departure: form.departureTime,
                    arrival: form.intermediateStop.arrival,
                    duration: form.duration,
                    flightNumber: form.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });

                // Second segment: ATH to DAM
                segments.push({
                    from: 'ATH',
                    to: destination,
                    departure: form.intermediateStop.departure,
                    arrival: form.arrivalTime,
                    duration: form.intermediateStop.duration,
                    flightNumber: form.intermediateStop.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });
            } else {
                // First segment: DAM to ATH
                segments.push({
                    from: origin,
                    to: 'ATH',
                    departure: form.departureTime,
                    arrival: form.intermediateStop.arrival,
                    duration: form.duration,
                    flightNumber: form.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });

                // Second segment: ATH to Destination
                segments.push({
                    from: 'ATH',
                    to: destination,
                    departure: form.intermediateStop.departure,
                    arrival: form.arrivalTime,
                    duration: form.intermediateStop.duration,
                    flightNumber: form.intermediateStop.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });
            }
        } else {
            // Direct flight
            segments.push({
                from: origin,
                to: destination,
                departure: form.departureTime,
                arrival: form.arrivalTime,
                duration: form.duration,
                flightNumber: form.flightNumber,
                baggageAllowance: form.baggageAllowance
            });
        }

        const flightData = {
            id: form.id,
            origin: origin,
            destination: destination,
            date: dateStr,
            departureTime: form.departureTime,
            arrivalTime: form.arrivalTime,
            duration: form.duration,
            availableSeats: Number(form.availableSeats),
            prices: {
                adult: Number(form.prices.adult),
                child: Number(form.prices.child),
                infant: Number(form.prices.infant),
                roundTripAdult: Number(form.prices.roundTripAdult) || 0,
                roundTripChild: Number(form.prices.roundTripChild) || 0,
                roundTripInfant: Number(form.prices.roundTripInfant) || 0
            },
            status: form.status || FlightStatus.ACTIVE,
            segments: segments,
            baggageAllowance: form.baggageAllowance
        };

        const endpoint = isEditing.value && form.id
            ? `/api/admin/flights/${form.id}`
            : '/api/admin/flights';

        const method = isEditing.value ? 'PUT' : 'POST';

        const response = await $fetch(endpoint, {
            method,
            body: flightData
        });

        if (response.success) {
            emits('saved', response.data);
            closeModal();
        } else if (response.error) {
            errorMessage.value = response.error.message || 'Fehler beim Speichern des Fluges';
            emits('error', response.error);
        }
    } catch (error) {
        console.error('Error saving flight:', error);
        errorMessage.value = 'Fehler beim Speichern des Fluges: ' + (error.message || 'Unbekannter Fehler');
        emits('error', error);
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    isOpen.value = false;
    resetForm();
};

// Add watch for form changes
watch(() => form, () => {
    console.log('Form changed, validation state:', isFormValid.value);
}, { deep: true });
</script>