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

                                <!-- Intermediate Stop Section -->
                                <div v-if="showIntermediateStop"
                                    class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div class="flex items-center gap-2 mb-4">
                                        <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-yellow-600" />
                                        <h5 class="font-medium text-yellow-900">Zwischenstopp in Athen (ATH)</h5>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- ATH Arrival -->
                                        <div class="bg-white p-4 rounded-lg">
                                            <UFormGroup label="Ankunft in ATH" class="text-base"
                                                help="Ankunftszeit in Athen"
                                                :state="formValidation.intermediateStop.arrival.valid ? undefined : false"
                                                :error="formValidation.intermediateStop.arrival.message">
                                                <UInput v-model="form.intermediateStop.arrival" type="time"
                                                    class="h-12 text-base" size="lg" icon="i-heroicons-clock" />
                                            </UFormGroup>
                                        </div>

                                        <!-- ATH Departure -->
                                        <div class="bg-white p-4 rounded-lg">
                                            <UFormGroup label="Abflug von ATH" class="text-base"
                                                help="Abflugzeit von Athen"
                                                :state="formValidation.intermediateStop.departure.valid ? undefined : false"
                                                :error="formValidation.intermediateStop.departure.message">
                                                <UInput v-model="form.intermediateStop.departure" type="time"
                                                    class="h-12 text-base" size="lg" icon="i-heroicons-clock" />
                                            </UFormGroup>
                                        </div>
                                    </div>

                                    <!-- Flight Number for Intermediate Stop -->
                                    <div class="mt-4 bg-white p-4 rounded-lg">
                                        <UFormGroup label="Flugnummer für Zwischenstopp" class="text-base"
                                            help="Flugnummer für den Flug nach/von Athen"
                                            :state="formValidation.intermediateStop.flightNumber.valid ? undefined : false"
                                            :error="formValidation.intermediateStop.flightNumber.message">
                                            <UInput v-model="form.intermediateStop.flightNumber" type="text"
                                                class="h-12 text-base" size="lg" placeholder="z.B. ATA456" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Waiting Time Display -->
                                    <div class="mt-4 p-3 bg-white rounded-lg flex items-center gap-3">
                                        <div class="bg-yellow-100 p-2 rounded-md">
                                            <UIcon name="i-heroicons-clock" class="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600">Wartezeit in Athen</p>
                                            <p class="text-base font-medium text-gray-800">
                                                {{ form.intermediateStop.arrival && form.intermediateStop.departure ?
                                                    calculateDuration(form.intermediateStop.arrival,
                                                        form.intermediateStop.departure) :
                                                    '-- : --' }}
                                            </p>
                                        </div>
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

                                <!-- Time Selection Cards -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Departure Time Card -->
                                    <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div class="flex items-center gap-2 mb-3">
                                            <UIcon name="i-heroicons-arrow-up-circle" class="h-5 w-5 text-blue-600" />
                                            <h5 class="font-medium text-blue-900">Abflug</h5>
                                        </div>
                                        <UFormGroup label="Abflugzeit" class="text-base" help="Lokale Startzeit"
                                            :state="formValidation.departureTime.valid ? undefined : false"
                                            :error="formValidation.departureTime.message">
                                            <UInput v-model="form.departureTime" type="time"
                                                class="h-12 text-base bg-white" size="lg" icon="i-heroicons-clock" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Arrival Time Card -->
                                    <div class="p-4 bg-green-50 rounded-lg border border-green-100">
                                        <div class="flex items-center gap-2 mb-3">
                                            <UIcon name="i-heroicons-arrow-down-circle"
                                                class="h-5 w-5 text-green-600" />
                                            <h5 class="font-medium text-green-900">Ankunft</h5>
                                        </div>
                                        <UFormGroup label="Ankunftszeit" class="text-base" help="Lokale Ankunftszeit"
                                            :state="formValidation.arrivalTime.valid ? undefined : false"
                                            :error="formValidation.arrivalTime.message">
                                            <UInput v-model="form.arrivalTime" type="time"
                                                class="h-12 text-base bg-white" size="lg" icon="i-heroicons-clock" />
                                        </UFormGroup>
                                    </div>
                                </div>

                                <!-- Duration Display -->
                                <div class="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                    <div class="bg-white p-2 rounded-md">
                                        <UIcon name="i-heroicons-clock" class="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Flugdauer</p>
                                        <p class="text-base font-medium text-gray-800">
                                            {{ form.departureTime && form.arrivalTime ?
                                                calculateDuration(form.departureTime, form.arrivalTime) :
                                                '-- : --' }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Flugnummern -->
                            <div class="mb-6">
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
                                    <UFormGroup label="Erwachsenenpreis (€)" class="text-base"
                                        help="Preis für Erwachsene ab 12 Jahren"
                                        :state="formValidation.prices.adult.valid ? undefined : false"
                                        :error="formValidation.prices.adult.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices[PassengerType.ADULT]" type="number" min="0"
                                                step="0.01" class="h-12 text-base pl-12" size="lg" />
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
                                    <UFormGroup label="Kinderpreis (€)" class="text-base"
                                        help="Preis für Kinder von 2-11 Jahren"
                                        :state="formValidation.prices.child.valid ? undefined : false"
                                        :error="formValidation.prices.child.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices[PassengerType.CHILD]" type="number" min="0"
                                                step="0.01" class="h-12 text-base pl-12" size="lg" />
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
                                    <UFormGroup label="Säuglingspreis (€)" class="text-base"
                                        help="Preis für Säuglinge unter 2 Jahren"
                                        :state="formValidation.prices.infant.valid ? undefined : false"
                                        :error="formValidation.prices.infant.message">
                                        <div class="relative">
                                            <UInput v-model="form.prices[PassengerType.INFANT]" type="number" min="0"
                                                step="0.01" class="h-12 text-base pl-12" size="lg" />
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
import { AIRPORTS, FlightStatus, PassengerType } from '~~/types';

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
        adultPrice: form.prices[PassengerType.ADULT],
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

    if (!form.prices[PassengerType.ADULT] || form.prices[PassengerType.ADULT] <= 0) {
        console.log('Invalid adult price');
        return false;
    }

    // Validate times
    if (!validateTimeSequence(form.departureTime, form.arrivalTime)) {
        console.log('Invalid time sequence for main flight');
        return false;
    }

    // Validate intermediate stop if needed
    if (showIntermediateStop.value) {
        if (!form.intermediateStop.arrival || !form.intermediateStop.departure) {
            console.log('Intermediate stop times missing');
            return false;
        }

        if (!validateTimeSequence(form.departureTime, form.intermediateStop.arrival)) {
            console.log('Invalid time sequence for first segment');
            return false;
        }

        if (!validateTimeSequence(form.intermediateStop.arrival, form.intermediateStop.departure)) {
            console.log('Invalid time sequence for intermediate stop');
            return false;
        }

        if (!validateRestTime(form.intermediateStop.arrival, form.intermediateStop.departure)) {
            console.log('Invalid rest time');
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
        [PassengerType.ADULT]: 299.99,
        [PassengerType.CHILD]: 179.99,
        [PassengerType.INFANT]: 49.99,
    },
    status: FlightStatus.ACTIVE,
    segments: [],
    intermediateStop: {
        arrival: '',
        departure: '',
        flightNumber: ''
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

const statusOptions = [
    {
        label: 'Aktiv',
        value: FlightStatus.ACTIVE,
        icon: 'i-heroicons-check-circle',
        description: 'Flug ist buchbar'
    },
    {
        label: 'Storniert',
        value: FlightStatus.CANCELLED,
        icon: 'i-heroicons-x-circle',
        description: 'Flug wurde abgesagt'
    },
    {
        label: 'Abgeschlossen',
        value: FlightStatus.COMPLETED,
        icon: 'i-heroicons-archive-box',
        description: 'Flug wurde durchgeführt'
    }
];

// Add new validation functions
const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
};

const validateTimeSequence = (departure, arrival) => {
    if (!departure || !arrival) return true;
    const [depHours, depMinutes] = departure.split(':').map(Number);
    const [arrHours, arrMinutes] = arrival.split(':').map(Number);
    const depTotal = depHours * 60 + depMinutes;
    const arrTotal = arrHours * 60 + arrMinutes;
    return arrTotal > depTotal || arrTotal + 24 * 60 > depTotal; // Allow next day
};

const validateRestTime = (arrival, departure) => {
    if (!arrival || !departure) return true;
    const [arrHours, arrMinutes] = arrival.split(':').map(Number);
    const [depHours, depMinutes] = departure.split(':').map(Number);
    const arrTotal = arrHours * 60 + arrMinutes;
    const depTotal = depHours * 60 + depMinutes;
    const restMinutes = depTotal > arrTotal ? depTotal - arrTotal : depTotal + 24 * 60 - arrTotal;
    return restMinutes >= 30; // Minimum 30 minutes rest time
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
        message: !form.departureTime ? 'Bitte wählen Sie eine Abflugzeit' : ''
    },
    arrivalTime: {
        valid: !!form.arrivalTime && validateTimeSequence(form.departureTime, form.arrivalTime),
        message: !form.arrivalTime
            ? 'Bitte wählen Sie eine Ankunftszeit'
            : !validateTimeSequence(form.departureTime, form.arrivalTime)
                ? 'Die Ankunftszeit muss nach der Abflugzeit liegen'
                : ''
    },
    intermediateStop: {
        arrival: {
            valid: !showIntermediateStop.value || (!!form.intermediateStop.arrival && validateTimeSequence(form.departureTime, form.intermediateStop.arrival)),
            message: !form.intermediateStop.arrival
                ? 'Bitte geben Sie die Ankunftszeit in Athen ein'
                : !validateTimeSequence(form.departureTime, form.intermediateStop.arrival)
                    ? 'Die Ankunftszeit in Athen muss nach der Abflugzeit liegen'
                    : ''
        },
        departure: {
            valid: !showIntermediateStop.value || (!!form.intermediateStop.departure &&
                validateTimeSequence(form.intermediateStop.arrival, form.intermediateStop.departure) &&
                validateRestTime(form.intermediateStop.arrival, form.intermediateStop.departure)),
            message: !form.intermediateStop.departure
                ? 'Bitte geben Sie die Abflugzeit von Athen ein'
                : !validateTimeSequence(form.intermediateStop.arrival, form.intermediateStop.departure)
                    ? 'Die Abflugzeit von Athen muss nach der Ankunftszeit liegen'
                    : !validateRestTime(form.intermediateStop.arrival, form.intermediateStop.departure)
                        ? 'Die Ruhezeit in Athen muss mindestens 30 Minuten betragen'
                        : ''
        },
        flightNumber: {
            valid: !showIntermediateStop.value || !!form.intermediateStop.flightNumber,
            message: !form.intermediateStop.flightNumber ? 'Bitte geben Sie eine Flugnummer für den Zwischenstopp ein' : ''
        }
    },
    prices: {
        adult: {
            valid: form.prices[PassengerType.ADULT] > 0,
            message: form.prices[PassengerType.ADULT] <= 0 ? 'Bitte geben Sie einen gültigen Preis für Erwachsene ein' : ''
        },
        child: {
            valid: form.prices[PassengerType.CHILD] > 0,
            message: form.prices[PassengerType.CHILD] <= 0 ? 'Bitte geben Sie einen gültigen Preis für Kinder ein' : ''
        },
        infant: {
            valid: form.prices[PassengerType.INFANT] > 0,
            message: form.prices[PassengerType.INFANT] <= 0 ? 'Bitte geben Sie einen gültigen Preis für Säuglinge ein' : ''
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
    }
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
        [PassengerType.ADULT]: 0,
        [PassengerType.CHILD]: 0,
        [PassengerType.INFANT]: 0,
    };
    form.intermediateStop = {
        arrival: '',
        departure: '',
        flightNumber: ''
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

                form.departureTime = new Date(firstSegment.departure).toTimeString().slice(0, 5);
                form.intermediateStop.arrival = new Date(firstSegment.arrival).toTimeString().slice(0, 5);
                form.intermediateStop.departure = new Date(secondSegment.departure).toTimeString().slice(0, 5);
                form.arrivalTime = new Date(secondSegment.arrival).toTimeString().slice(0, 5);
            } else {
                // Direct flight
                const segment = newFlight.segments[0];
                form.departureTime = new Date(segment.departure).toTimeString().slice(0, 5);
                form.arrivalTime = new Date(segment.arrival).toTimeString().slice(0, 5);
                form.intermediateStop = {
                    arrival: '',
                    departure: '',
                    flightNumber: ''
                };
            }
        }

        form.prices = {
            [PassengerType.ADULT]: newFlight.prices[PassengerType.ADULT] || 299.99,
            [PassengerType.CHILD]: newFlight.prices[PassengerType.CHILD] || 179.99,
            [PassengerType.INFANT]: newFlight.prices[PassengerType.INFANT] || 49.99,
        };

        form.baggageAllowance = {
            cabin: newFlight.baggageAllowance?.cabin || 8,
            checked: newFlight.baggageAllowance?.checked || 23
        };
    } else {
        resetForm();
    }
}, { immediate: true });

// Compute flight duration
const calculateDuration = (departureTime, arrivalTime) => {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

    let durationMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle next day arrival

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}min`;
};

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
                const depTime = new Date(`${dateStr}T${form.departureTime}:00.000Z`);
                const arrTime = new Date(`${dateStr}T${form.intermediateStop.arrival}:00.000Z`);
                segments.push({
                    from: origin,
                    to: 'ATH',
                    departure: depTime.toISOString(),
                    arrival: arrTime.toISOString(),
                    duration: calculateDuration(form.departureTime, form.intermediateStop.arrival),
                    flightNumber: form.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });

                // Second segment: ATH to DAM
                const athDepTime = new Date(`${dateStr}T${form.intermediateStop.departure}:00.000Z`);
                // If arrival time is before departure time, it's the next day
                let damArrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
                if (damArrTime < athDepTime) {
                    damArrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
                    damArrTime.setDate(damArrTime.getDate() + 1);
                }
                segments.push({
                    from: 'ATH',
                    to: destination,
                    departure: athDepTime.toISOString(),
                    arrival: damArrTime.toISOString(),
                    duration: calculateDuration(form.intermediateStop.departure, form.arrivalTime),
                    flightNumber: form.intermediateStop.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });
            } else {
                // First segment: DAM to ATH
                const depTime = new Date(`${dateStr}T${form.departureTime}:00.000Z`);
                const arrTime = new Date(`${dateStr}T${form.intermediateStop.arrival}:00.000Z`);
                segments.push({
                    from: origin,
                    to: 'ATH',
                    departure: depTime.toISOString(),
                    arrival: arrTime.toISOString(),
                    duration: calculateDuration(form.departureTime, form.intermediateStop.arrival),
                    flightNumber: form.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });

                // Second segment: ATH to Destination
                const athDepTime = new Date(`${dateStr}T${form.intermediateStop.departure}:00.000Z`);
                let finalArrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
                if (finalArrTime < athDepTime) {
                    finalArrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
                    finalArrTime.setDate(finalArrTime.getDate() + 1);
                }
                segments.push({
                    from: 'ATH',
                    to: destination,
                    departure: athDepTime.toISOString(),
                    arrival: finalArrTime.toISOString(),
                    duration: calculateDuration(form.intermediateStop.departure, form.arrivalTime),
                    flightNumber: form.intermediateStop.flightNumber,
                    baggageAllowance: form.baggageAllowance
                });
            }
        } else {
            // Direct flight
            const depTime = new Date(`${dateStr}T${form.departureTime}:00.000Z`);
            let arrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
            if (arrTime < depTime) {
                arrTime = new Date(`${dateStr}T${form.arrivalTime}:00.000Z`);
                arrTime.setDate(arrTime.getDate() + 1);
            }
            segments.push({
                from: origin,
                to: destination,
                departure: depTime.toISOString(),
                arrival: arrTime.toISOString(),
                duration: calculateDuration(form.departureTime, form.arrivalTime),
                flightNumber: form.flightNumber,
                baggageAllowance: form.baggageAllowance
            });
        }

        // Calculate total duration
        const totalDuration = segments.reduce((total, segment) => {
            const dep = new Date(segment.departure);
            const arr = new Date(segment.arrival);
            return total + (arr - dep);
        }, 0);

        const flightData = {
            id: form.id,
            origin: origin,
            destination: destination,
            date: dateStr,
            departureTime: form.departureTime,
            arrivalTime: form.arrivalTime,
            duration: formatDuration(totalDuration),
            availableSeats: Number(form.availableSeats),
            prices: {
                [PassengerType.ADULT]: Number(form.prices[PassengerType.ADULT]),
                [PassengerType.CHILD]: Number(form.prices[PassengerType.CHILD]),
                [PassengerType.INFANT]: Number(form.prices[PassengerType.INFANT]),
            },
            status: form.status || FlightStatus.ACTIVE,
            segments: segments.map(segment => ({
                ...segment,
                duration: calculateDuration(
                    new Date(segment.departure).toTimeString().slice(0, 5),
                    new Date(segment.arrival).toTimeString().slice(0, 5)
                )
            })),
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

// Add helper function to format duration
const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
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