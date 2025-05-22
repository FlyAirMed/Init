<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 py-12 relative overflow-hidden">
        <!-- Background Decorative Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating Icons -->
            <div class="absolute top-1/4 left-10 animate-float-slow">
                <UIcon name="i-heroicons-paper-airplane" class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute top-1/3 right-20 animate-float-slower">
                <UIcon name="i-heroicons-ticket" class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute bottom-1/4 left-1/4 animate-float-slowest">
                <UIcon name="i-heroicons-globe-europe-africa" class="h-12 w-12 text-blue-300/40" />
            </div>
            <div class="absolute top-2/3 right-1/3 animate-float-slow">
                <UIcon name="i-heroicons-map" class="h-12 w-12 text-blue-300/40" />
            </div>

            <!-- Animated Circles -->
            <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full animate-pulse-slow"></div>
            <div
                class="absolute bottom-1/3 left-1/3 w-[32rem] h-[32rem] bg-blue-300/10 rounded-full animate-pulse-slower">
            </div>
            <div class="absolute top-2/3 right-1/4 w-72 h-72 bg-blue-200/10 rounded-full animate-pulse-slowest"></div>
        </div>

        <div class="max-w-3xl mx-auto px-4 relative">
            <!-- Success Header with Animation -->
            <div class="text-center mb-12 animate-fade-in">
                <div
                    class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg animate-bounce-slow">
                    <UIcon name="i-heroicons-check-circle" class="h-12 w-12 text-green-500" />
                </div>
                <h1 class="text-4xl font-bold text-gray-200 mb-4 animate-slide-up">
                    Vielen Dank für Ihre Buchung!
                </h1>
                <div class="bg-white rounded-xl p-6 shadow-lg animate-slide-up-delayed">
                    <div class="flex items-center gap-3 mb-4">
                        <UIcon name="i-heroicons-envelope" class="h-6 w-6 text-blue-500" />
                        <h2 class="text-xl font-semibold text-gray-900">Ihre Buchungsbestätigung</h2>
                    </div>
                    <p class="text-lg text-gray-600 mb-4">
                        Sie erhalten in Kürze eine E-Mail mit
                    </p>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-center gap-2">
                            <UIcon name="i-heroicons-ticket" class="h-5 w-5 text-blue-500" />
                            Ihren Flugtickets
                        </li>
                        <li class="flex items-center gap-2">
                            <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-blue-500" />
                            Detaillierte Reiseinformationen
                        </li>
                        <li class="flex items-center gap-2">
                            <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-500" />
                            Wichtige Hinweise für Ihren Flug
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Important Information Card -->
            <div class="bg-white rounded-xl p-6 shadow-lg mb-8 animate-slide-up-delayed-2">
                <div class="flex items-start gap-3">
                    <UIcon name="i-heroicons-information-circle" class="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-3">Wichtige Hinweise</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start gap-2">
                                <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-blue-500 mt-0.5" />
                                <span>Bitte überprüfen Sie auch Ihren Spam-Ordner für die Buchungsbestätigung</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <UIcon name="i-heroicons-identification" class="h-5 w-5 text-blue-500 mt-0.5" />
                                <span>Bringen Sie einen gültigen Ausweis zum Flughafen mit</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <UIcon name="i-heroicons-clock" class="h-5 w-5 text-blue-500 mt-0.5" />
                                <span>Seien Sie mindestens 2 Stunden vor Abflug am Flughafen</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
                <UButton to="/" color="primary" icon="i-heroicons-paper-airplane"
                    class="flex-1 sm:flex-none transform hover:scale-105 transition-transform">
                    Weitere Flüge suchen
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Set page title
useHead({
    title: 'Buchung erfolgreich - ATA Airlines'
});
</script>

<style scoped>
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