<template>
    <UModal v-model:open="isOpen" :ui="{ width: 'max-w-5xl' }">
        <template #header>
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-semibold">{{ isEditing ? 'Flug bearbeiten' : 'Neuen Flug hinzufügen' }}</h3>
            </div>
        </template>

        <template #body>
            <!-- Error message -->
            <UAlert v-if="errorMessage" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4">
                {{ errorMessage }}
            </UAlert>

            <!-- Form content -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Origin Airport -->
                <UFormGroup label="Abflughafen">
                    <USelectMenu v-model="form.origin" :items="airportOptions" placeholder="Bitte wählen" />
                </UFormGroup>

                <!-- Destination Airport -->
                <UFormGroup label="Zielflughafen">
                    <USelectMenu v-model="form.destination" :items="airportOptions" placeholder="Bitte wählen" />
                </UFormGroup>

                <!-- Flight Date -->
                <UFormGroup label="Datum">
                    <UInput v-model="form.date" type="date" />
                </UFormGroup>

                <!-- Available Seats -->
                <UFormGroup label="Verfügbare Sitze">
                    <UInput v-model="form.availableSeats" type="number" min="0" max="500" />
                </UFormGroup>

                <!-- Status -->
                <UFormGroup label="Status">
                    <USelectMenu v-model="form.status" :items="statusOptions" />
                </UFormGroup>
            </div>

            <!-- Flight Segments -->
            <div class="mt-4">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Flugsegmente</h3>

                <div v-for="(segment, index) in form.segments" :key="index" class="p-3 bg-gray-50 rounded-md mb-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <UFormGroup label="Von">
                            <UInput v-model="segment.from" />
                        </UFormGroup>

                        <UFormGroup label="Nach">
                            <UInput v-model="segment.to" />
                        </UFormGroup>

                        <UFormGroup label="Abflugzeit">
                            <UInput v-model="segment.departure" type="datetime-local" />
                        </UFormGroup>

                        <UFormGroup label="Ankunftszeit">
                            <UInput v-model="segment.arrival" type="datetime-local" />
                        </UFormGroup>
                    </div>

                    <div class="flex justify-end mt-2">
                        <UButton color="red" variant="soft" @click="removeSegment(index)" icon="i-heroicons-trash">
                            Segment entfernen
                        </UButton>
                    </div>
                </div>

                <UButton @click="addSegment" variant="soft" color="gray" icon="i-heroicons-plus" class="mt-2">
                    Segment hinzufügen
                </UButton>
            </div>

            <!-- Prices -->
            <div class="mt-4">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Preise</h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UFormGroup label="Erwachsene">
                        <UInputGroup v-model="form.prices.adult" type="number" min="0" step="0.01">
                            <template #prefix>
                                <span class="text-gray-500">€</span>
                            </template>
                        </UInputGroup>
                    </UFormGroup>

                    <UFormGroup label="Kinder">
                        <UInputGroup v-model="form.prices.child" type="number" min="0" step="0.01">
                            <template #prefix>
                                <span class="text-gray-500">€</span>
                            </template>
                        </UInputGroup>
                    </UFormGroup>

                    <UFormGroup label="Kleinkinder">
                        <UInputGroup v-model="form.prices.infant" type="number" min="0" step="0.01">
                            <template #prefix>
                                <span class="text-gray-500">€</span>
                            </template>
                        </UInputGroup>
                    </UFormGroup>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2">
                <UButton @click="closeModal" color="gray" variant="soft">
                    Abbrechen
                </UButton>
                <UButton @click="saveFlight" color="primary" :loading="isLoading">
                    {{ isEditing ? 'Aktualisieren' : 'Speichern' }}
                </UButton>
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

// Form state
const initialFormState = {
    origin: '',
    destination: '',
    date: '',
    availableSeats: 150,
    segments: [],
    prices: {
        [PassengerType.ADULT]: 0,
        [PassengerType.CHILD]: 0,
        [PassengerType.INFANT]: 0,
        [PassengerType.SENIOR]: 0 // Keep it for API compatibility
    },
    status: FlightStatus.ACTIVE
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
    { label: 'Aktiv', value: FlightStatus.ACTIVE },
    { label: 'Storniert', value: FlightStatus.CANCELLED },
    { label: 'Abgeschlossen', value: FlightStatus.COMPLETED }
];

// Function declarations
const resetForm = () => {
    Object.assign(form, initialFormState);
    form.segments = [];
    form.prices = {
        [PassengerType.ADULT]: 0,
        [PassengerType.CHILD]: 0,
        [PassengerType.INFANT]: 0,
        [PassengerType.SENIOR]: 0 // Keep it for API compatibility
    };
    delete form.id;
    errorMessage.value = '';
};

const addSegment = () => {
    form.segments.push({
        from: form.origin,
        to: form.destination,
        departure: '',
        arrival: '',
        duration: ''
    });
};

const removeSegment = (index) => {
    form.segments.splice(index, 1);
};

// Initialize form when flight changes
watch(() => props.flight, (newFlight) => {
    if (newFlight) {
        form.id = newFlight.id;
        form.origin = newFlight.origin;
        form.destination = newFlight.destination;
        form.date = newFlight.date;
        form.availableSeats = newFlight.availableSeats;
        form.status = newFlight.status;

        // Deep clone segments and prices
        form.segments = JSON.parse(JSON.stringify(newFlight.segments));
        form.prices = {
            [PassengerType.ADULT]: newFlight.prices[PassengerType.ADULT] || 0,
            [PassengerType.CHILD]: newFlight.prices[PassengerType.CHILD] || 0,
            [PassengerType.INFANT]: newFlight.prices[PassengerType.INFANT] || 0,
            [PassengerType.SENIOR]: newFlight.prices[PassengerType.SENIOR] || 0 // Keep it for API compatibility
        };
    } else {
        resetForm();
    }
}, { immediate: true });

// Methods
const saveFlight = async () => {
    // Validate form
    if (!validateForm()) {
        return;
    }

    try {
        isLoading.value = true;
        errorMessage.value = '';

        const flightData = {
            ...form,
            // Ensure prices are numbers
            prices: {
                [PassengerType.ADULT]: Number(form.prices[PassengerType.ADULT]),
                [PassengerType.CHILD]: Number(form.prices[PassengerType.CHILD]),
                [PassengerType.INFANT]: Number(form.prices[PassengerType.INFANT]),
                [PassengerType.SENIOR]: Number(form.prices[PassengerType.ADULT]) // Use adult price for seniors
            },
            availableSeats: Number(form.availableSeats)
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
        errorMessage.value = 'Fehler beim Speichern des Fluges: ' + error.message;
        emits('error', error);
    } finally {
        isLoading.value = false;
    }
};

const validateForm = () => {
    if (!form.origin) {
        errorMessage.value = 'Bitte einen Abflughafen auswählen';
        return false;
    }

    if (!form.destination) {
        errorMessage.value = 'Bitte einen Zielflughafen auswählen';
        return false;
    }

    if (form.origin === form.destination) {
        errorMessage.value = 'Abflug- und Zielflughafen dürfen nicht identisch sein';
        return false;
    }

    if (!form.date) {
        errorMessage.value = 'Bitte ein Datum auswählen';
        return false;
    }

    if (!form.availableSeats || form.availableSeats <= 0) {
        errorMessage.value = 'Bitte eine gültige Anzahl verfügbarer Sitze angeben';
        return false;
    }

    if (form.segments.length === 0) {
        errorMessage.value = 'Bitte mindestens ein Flugsegment hinzufügen';
        return false;
    }

    // Validate each segment
    for (const segment of form.segments) {
        if (!segment.from || !segment.to || !segment.departure || !segment.arrival) {
            errorMessage.value = 'Bitte alle Felder für jedes Flugsegment ausfüllen';
            return false;
        }

        // Check if arrival is after departure
        if (new Date(segment.arrival) <= new Date(segment.departure)) {
            errorMessage.value = 'Die Ankunftszeit muss nach der Abflugzeit liegen';
            return false;
        }
    }

    // Validate prices
    if (form.prices[PassengerType.ADULT] <= 0) {
        errorMessage.value = 'Bitte einen gültigen Preis für Erwachsene angeben';
        return false;
    }

    return true;
};

const closeModal = () => {
    isOpen.value = false;
    resetForm();
};
</script>