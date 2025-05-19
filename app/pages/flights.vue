<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 py-8">
        <div class="container mx-auto px-4">
            <!-- Header with Back Button -->
            <div class="mb-8 flex items-center justify-between">
                <div class="space-y-1">
                    <h1 class="text-2xl font-bold text-white">
                        Fluginformationen
                    </h1>
                    <p class="text-sm text-blue-100">Hier finden Sie alle Details zu Ihrem Flug</p>
                </div>
                <UButton to="/" icon="i-heroicons-chevron-left" color="white" variant="soft" size="sm"
                    class="hover:scale-105 transition-transform">
                    Zurück
                </UButton>
            </div>

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
                                        {{ AIRPORTS[flight.origin].name }} → {{ AIRPORTS[flight.destination].name }}
                                    </h2>
                                    <p class="text-sm text-gray-600">{{ formatDate(flight.date) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl text-white">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-heroicons-currency-euro" class="h-5 w-5" />
                                        <div>
                                            <div class="text-lg font-bold">{{ flight.prices.adult }}€</div>
                                            <div class="text-xs opacity-80">Gesamtpreis</div>
                                        </div>
                                    </div>
                                </div>
                                <UBadge :color="flight.status === 'active' ? 'green' : 'red'" variant="soft" size="sm"
                                    class="animate-pulse">
                                    {{ flight.status === 'active' ? 'Aktiv' : 'Storniert' }}
                                </UBadge>
                            </div>
                        </div>
                    </div>

                    <!-- Flight Details -->
                    <div class="p-6">
                        <!-- Flight Segments -->
                        <div class="space-y-6">
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
                                                {{ AIRPORTS[segment.from].name }} → {{ AIRPORTS[segment.to].name }}
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
                                            <UIcon name="i-heroicons-arrow-trending-up" class="h-4 w-4 text-blue-500" />
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AIRPORTS } from '../../types';

const flights = ref([]);

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

onMounted(async () => {
    try {
        const route = useRoute();
        const results = JSON.parse(atob(route.query.results || '{}'));

        if (results.flights) {
            flights.value = results.flights;
        }
    } catch (error) {
        console.error('Error loading flight data:', error);
    }
});
</script>