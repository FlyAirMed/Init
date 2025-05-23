<template>
    <div class="container mx-auto p-4 md:p-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-200 mb-6">Flugverwaltung</h1>

        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            {{ successMessage }}
        </div>

        <!-- Create New Flight Button -->
        <div class="mb-6">
            <UButton icon="i-heroicons-plus" color="primary" @click="openCreateModal">
                Neuen Flug hinzufügen
            </UButton>
        </div>

        <!-- Flight Edit Modal -->
        <FlightEditModal v-model:open="showFlightModal" :flight="currentFlight" @saved="onFlightSaved"
            @error="onFlightError" />

        <!-- Flights List -->
        <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Alle Flüge</h2>

            <!-- Search and Filter Controls -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input type="text" v-model="searchQuery" placeholder="Suchen..."
                        class="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <select v-model="statusFilter"
                        class="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Alle Status</option>
                        <option :value="FlightStatus.ACTIVE">Aktiv</option>
                        <option :value="FlightStatus.CANCELLED">Storniert</option>
                        <option :value="FlightStatus.COMPLETED">Abgeschlossen</option>
                    </select>
                </div>

                <button @click="loadFlights"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                            </path>
                        </svg>
                        Aktualisieren
                    </span>
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="isLoadingFlights" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <!-- No Flights State -->
            <div v-else-if="!filteredFlights.length" class="py-8 text-center text-gray-500">
                Keine Flüge gefunden.
            </div>

            <!-- Flights Table -->
            <div v-else class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-2 text-left text-gray-600">ID</th>
                            <th class="p-2 text-left text-gray-600">Von</th>
                            <th class="p-2 text-left text-gray-600">Nach</th>
                            <th class="p-2 text-left text-gray-600">Datum</th>
                            <th class="p-2 text-left text-gray-600">Sitze</th>
                            <th class="p-2 text-left text-gray-600">Preis</th>
                            <th class="p-2 text-left text-gray-600">Status</th>
                            <th class="p-2 text-left text-gray-600">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="flight in filteredFlights" :key="flight.id" class="border-b hover:bg-gray-50">
                            <td class="p-2 text-gray-800">{{ flight.id.substring(0, 8) }}...</td>
                            <td class="p-2">{{ flight.origin }}</td>
                            <td class="p-2">{{ flight.destination }}</td>
                            <td class="p-2">{{ formatDate(flight.date) }}</td>
                            <td class="p-2">{{ flight.availableSeats }}</td>
                            <td class="p-2">{{ formatPrice(flight.prices.adult) }}</td>
                            <td class="p-2">
                                <span :class="{
                                    'px-2 py-1 rounded-full text-xs font-medium': true,
                                    'bg-green-100 text-green-800': flight.status === FlightStatus.ACTIVE,
                                    'bg-red-100 text-red-800': flight.status === FlightStatus.CANCELLED,
                                    'bg-gray-100 text-gray-800': flight.status === FlightStatus.COMPLETED
                                }">
                                    {{ formatStatus(flight.status) }}
                                </span>
                            </td>
                            <td class="p-2">
                                <div class="flex space-x-2">
                                    <button @click="editFlight(flight)"
                                        class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Bearbeiten">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button @click="confirmDeleteFlight(flight)"
                                        class="p-1 text-red-600 hover:text-red-800 transition-colors" title="Löschen">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Flug löschen</h3>
                <p class="text-gray-600 mb-6">
                    Sind Sie sicher, dass Sie den Flug von <strong>{{ flightToDelete?.origin }}</strong> nach
                    <strong>{{ flightToDelete?.destination }}</strong> am <strong>{{ formatDate(flightToDelete?.date)
                        }}</strong> löschen möchten?
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                        Abbrechen
                    </button>
                    <button @click="deleteFlight"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        :disabled="isDeleting">
                        <span v-if="isDeleting">Löschen...</span>
                        <span v-else>Löschen</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { FlightStatus } from '~~/types';
import FlightEditModal from '~/components/FlightEditModal.vue';

// States
const flights = ref([]);
const isLoadingFlights = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showDeleteModal = ref(false);
const flightToDelete = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const showFlightModal = ref(false); // todo: set to false initially
const currentFlight = ref(null);

// Computed
const filteredFlights = computed(() => {
    let result = [...flights.value];

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(flight =>
            flight.origin.toLowerCase().includes(query) ||
            flight.destination.toLowerCase().includes(query) ||
            flight.date.includes(query) ||
            (flight.id && flight.id.toLowerCase().includes(query))
        );
    }

    // Filter by status
    if (statusFilter.value) {
        result = result.filter(flight => flight.status === statusFilter.value);
    }

    return result;
});

// Methods
const loadFlights = async () => {
    try {
        isLoadingFlights.value = true;
        errorMessage.value = '';

        const response = await $fetch('/api/admin/flights');

        if (response.success && response.data) {
            flights.value = response.data.flights;
        } else if (response.error) {
            errorMessage.value = response.error.message || 'Fehler beim Laden der Flüge';
        }
    } catch (error) {
        console.error('Error loading flights:', error);
        errorMessage.value = 'Fehler beim Laden der Flüge: ' + error.message;
    } finally {
        isLoadingFlights.value = false;
    }
};

const openCreateModal = () => {
    currentFlight.value = null;
    showFlightModal.value = true;
};

const editFlight = (flight) => {
    currentFlight.value = flight;
    showFlightModal.value = false;
};

const onFlightSaved = () => {
    successMessage.value = currentFlight.value
        ? 'Flug erfolgreich aktualisiert!'
        : 'Neuer Flug erfolgreich erstellt!';
    loadFlights();
};

const onFlightError = (error) => {
    errorMessage.value = error.message || 'Fehler beim Speichern des Fluges';
};

const confirmDeleteFlight = (flight) => {
    flightToDelete.value = flight;
    showDeleteModal.value = true;
};

const deleteFlight = async () => {
    if (!flightToDelete.value || !flightToDelete.value.id) {
        showDeleteModal.value = false;
        return;
    }

    try {
        isDeleting.value = true;
        errorMessage.value = '';

        const response = await $fetch(`/api/admin/flights/${flightToDelete.value.id}`, {
            method: 'DELETE'
        });

        if (response.success) {
            successMessage.value = 'Flug erfolgreich gelöscht!';
            loadFlights();
        } else if (response.error) {
            errorMessage.value = response.error.message || 'Fehler beim Löschen des Fluges';
        }
    } catch (error) {
        console.error('Error deleting flight:', error);
        errorMessage.value = 'Fehler beim Löschen des Fluges: ' + error.message;
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
    }
};

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
};

const formatStatus = (status) => {
    switch (status) {
        case FlightStatus.ACTIVE:
            return 'Aktiv';
        case FlightStatus.CANCELLED:
            return 'Storniert';
        case FlightStatus.COMPLETED:
            return 'Abgeschlossen';
        default:
            return status;
    }
};

// Überprüfe die Authentifizierung beim Laden der Seite
onMounted(async () => {
    try {
        const response = await $fetch('/api/admin/auth/check');
        if (!response.success) {
            // Wenn nicht authentifiziert, zur Login-Seite weiterleiten
            navigateTo('/admin/login');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        navigateTo('/admin/login');
    }
});

// Load flights on component mount
onMounted(() => {
    loadFlights();
});
</script>