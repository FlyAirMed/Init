<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 py-8">
        <div class="container mx-auto px-4">
            <UCard class="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm">
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-500" />
                        <h1 class="text-2xl font-semibold text-gray-800">Buchung erfolgreich!</h1>
                    </div>
                </template>

                <div class="space-y-6">
                    <div class="p-4 bg-green-50 rounded-lg">
                        <p class="text-green-700">
                            Vielen Dank für Ihre Buchung! Sie erhalten in Kürze eine Bestätigung per E-Mail.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-lg font-semibold text-gray-800">Buchungsdetails</h2>
                        <div class="grid gap-4">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <UIcon name="i-heroicons-airplane" class="h-5 w-5 text-blue-600" />
                                    <h3 class="font-medium text-gray-800">Fluginformationen</h3>
                                </div>
                                <div class="space-y-2 text-gray-600">
                                    <p><span class="font-medium">Flugnummer:</span> {{ bookingDetails?.flightNumber }}
                                    </p>
                                    <p><span class="font-medium">Von:</span> {{ bookingDetails?.from }}</p>
                                    <p><span class="font-medium">Nach:</span> {{ bookingDetails?.to }}</p>
                                    <p><span class="font-medium">Datum:</span> {{ bookingDetails?.date }}</p>
                                </div>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <UIcon name="i-heroicons-currency-euro" class="h-5 w-5 text-blue-600" />
                                    <h3 class="font-medium text-gray-800">Zahlungsinformationen</h3>
                                </div>
                                <div class="space-y-2 text-gray-600">
                                    <p><span class="font-medium">Betrag:</span> {{ formatPrice(bookingDetails?.price) }}
                                        EUR</p>
                                    <p><span class="font-medium">Status:</span> <span
                                            class="text-green-600">Bezahlt</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4">
                        <UButton color="blue" variant="soft" to="/" icon="i-heroicons-home">
                            Zur Startseite
                        </UButton>
                        <UButton color="blue" to="/flights" icon="i-heroicons-airplane">
                            Neue Buchung
                        </UButton>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const bookingDetails = ref(null);

// Formatiere den Preis
const formatPrice = (price) => {
    if (!price) return '0.00';
    return (Number(price) / 100).toFixed(2);
};

onMounted(() => {
    // Hier könnten wir die Buchungsdetails aus der URL oder einem API-Endpunkt laden
    // Für jetzt verwenden wir die Metadaten aus der URL
    const metadata = route.query;
    if (metadata) {
        bookingDetails.value = {
            flightNumber: metadata.flightNumber,
            from: metadata.from,
            to: metadata.to,
            date: metadata.date,
            price: metadata.price,
        };
    }
});
</script>