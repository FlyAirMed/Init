<template>
    <UModal v-model:open="isOpen" class="max-w-[90vw] w-[1200px]">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold">{{ isEditing ? 'Flug bearbeiten' : 'Neuen Flug hinzufügen' }}</h3>
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
                            <!-- Origin and Destination -->
                            <div class="grid grid-cols-1 gap-4">
                                <UFormGroup label="Abflughafen" class="text-base">
                                    <USelectMenu v-model="form.origin" :items="airportOptions" placeholder="Bitte wählen"
                                        icon="i-heroicons-map-pin" class="h-12 text-base" />
                                </UFormGroup>

                                <UFormGroup label="Zielflughafen" class="text-base">
                                    <USelectMenu v-model="form.destination" :items="airportOptions"
                                        placeholder="Bitte wählen" icon="i-heroicons-map-pin" class="h-12 text-base" />
                                </UFormGroup>
                            </div>

                            <!-- Flight Date and Available Seats -->
                            <div class="flex flex-wrap gap-4">
                                <div class="flex-1 min-w-[200px]">
                                    <UFormGroup label="Datum" class="text-base">
                                        <UInput v-model="form.date" type="date" icon="i-heroicons-calendar" 
                                            class="h-12 text-base" size="lg" />
                                    </UFormGroup>
                                </div>

                                <div class="flex-1 min-w-[200px]">
                                    <UFormGroup label="Verfügbare Sitze" class="text-base">
                                        <UInput v-model="form.availableSeats" type="number" min="0" max="500"
                                            icon="i-heroicons-user-group" class="h-12 text-base" size="lg" />
                                    </UFormGroup>
                                </div>

                                <div class="flex-1 min-w-[200px]">
                                    <UFormGroup label="Status" class="text-base">
                                        <USelectMenu v-model="form.status" :items="statusOptions" 
                                            icon="i-heroicons-tag" class="h-12 text-base" size="lg" />
                            </UFormGroup>
                        </div>
                    </div>
                </div>

                <!-- Prices Section -->
                <div class="p-6 bg-gray-50 rounded-xl">
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Preise</h3>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="grid gap-6">
                            <!-- Adult Price -->
                            <UFormGroup label="Preis für Erwachsene" class="text-base">
                                <UInput v-model="form.prices.adult" type="number" min="0" step="0.01" class="h-12 text-base">
                                    <template #prefix>
                                        <span class="text-gray-500 text-base">€</span>
                                    </template>
                                </UInput>
                            </UFormGroup>

                            <!-- Child Price -->
                            <UFormGroup label="Preis für Kinder" class="text-base">
                                <UInput v-model="form.prices.child" type="number" min="0" step="0.01" class="h-12 text-base">
                                    <template #prefix>
                                        <span class="text-gray-500 text-base">€</span>
                                    </template>
                                </UInput>
                            </UFormGroup>

                            <!-- Infant Price -->
                            <UFormGroup label="Preis für Kleinkinder" class="text-base">
                                <UInput v-model="form.prices.infant" type="number" min="0" step="0.01" class="h-12 text-base">
                                    <template #prefix>
                                        <span class="text-gray-500 text-base">€</span>
                                    </template>
                                </UInput>
                            </UFormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3">
                <UButton @click="closeModal" color="gray" variant="soft" icon="i-heroicons-x-mark">
                    Abbrechen
                </UButton>
                <UButton @click="saveFlight" color="primary" :loading="isLoading" icon="i-heroicons-check">
                    {{ isEditing ? 'Flug aktualisieren' : 'Flug speichern' }}
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
    prices: {
        [PassengerType.ADULT]: 0,
        [PassengerType.CHILD]: 0,
        [PassengerType.INFANT]: 0,
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
    form.prices = {
        [PassengerType.ADULT]: 0,
        [PassengerType.CHILD]: 0,
        [PassengerType.INFANT]: 0,
    };
    delete form.id;
    errorMessage.value = '';
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
        
        form.prices = {
            [PassengerType.ADULT]: newFlight.prices[PassengerType.ADULT] || 0,
            [PassengerType.CHILD]: newFlight.prices[PassengerType.CHILD] || 0,
            [PassengerType.INFANT]: newFlight.prices[PassengerType.INFANT] || 0,
        };
    } else {
        resetForm();
    }
}, { immediate: true });

// Methods
const saveFlight = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        isLoading.value = true;
        errorMessage.value = '';

        const flightData = {
            ...form,
            prices: {
                [PassengerType.ADULT]: Number(form.prices[PassengerType.ADULT]),
                [PassengerType.CHILD]: Number(form.prices[PassengerType.CHILD]),
                [PassengerType.INFANT]: Number(form.prices[PassengerType.INFANT]),
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