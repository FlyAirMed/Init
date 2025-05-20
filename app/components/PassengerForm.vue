<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

const props = defineProps({
    passengerNumber: {
        type: Number,
        required: true
    },
    isContactPerson: {
        type: Boolean,
        default: false
    },
    passenger: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:passenger']);

const updateField = (field, value) => {
    emit('update:passenger', {
        ...props.passenger,
        [field]: value
    });
};

// Date formatter für deutsche Lokalisierung
const df = new DateFormatter('de-DE', {
    dateStyle: 'medium'
});

// Konvertiere String-Datum zu CalendarDate
const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

// Konvertiere CalendarDate zu String
const formatDate = (date) => {
    if (!date) return '';
    return df.format(date.toDate(getLocalTimeZone()));
};

// Aktuelles Datum für maxValue
const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
);

// Mindestalter 18 Jahre
const minDate = new CalendarDate(
    new Date().getFullYear() - 100,
    new Date().getMonth() + 1,
    new Date().getDate()
);

// Maximales Datum (heute)
const maxDate = today;
</script>

<template>
    <UCard class="w-full max-w-2xl mx-auto">
        <template #header>
            <div class="flex flex-col gap-2 p-4">
                <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-user" class="h-7 w-7 text-blue-600" />
                    <h2 class="text-2xl font-semibold text-gray-800">
                        {{ isContactPerson ? 'Kontaktperson' : `Passagier ${passengerNumber}` }}
                    </h2>
                </div>
                <p v-if="isContactPerson" class="text-sm text-gray-600 ml-10">
                    Als Kontaktperson benötigen wir zusätzliche Informationen für die Buchungsbestätigung.
                </p>
            </div>
        </template>

        <div class="flex flex-col gap-8 p-6">
            <!-- Persönliche Informationen -->
            <div>
                <h3 class="text-lg font-medium text-gray-700 mb-4">Persönliche Informationen</h3>
                <div class="flex flex-col md:flex-row gap-4">
                    <UFormGroup label="Vorname" required size="lg" class="flex-1 max-w-sm">
                        <UInput :model-value="passenger.firstName"
                            @update:model-value="(value) => updateField('firstName', value)" placeholder="z.B. Max"
                            icon="i-heroicons-user" size="lg" class=" w-full" />
                    </UFormGroup>
                    <UFormGroup label="Nachname" required size="lg" class="flex-1 max-w-sm">
                        <UInput :model-value="passenger.lastName"
                            @update:model-value="(value) => updateField('lastName', value)"
                            placeholder="z.B. Mustermann" icon="i-heroicons-user" size="lg" class=" w-full" />
                    </UFormGroup>
                </div>
                <div class="mt-4 flex flex-col max-w-sm">
                    <UFormGroup label="Geburtsdatum" required size="lg">
                        <UPopover>
                            <UButton color="white" variant="soft" class="w-full h-12 justify-start text-base"
                                icon="i-heroicons-calendar" size="lg">
                                {{ passenger.birthDate ? formatDate(parseDate(passenger.birthDate)) : 'Geburtsdatum auswählen'
                                }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="birthDate" :min-value="minDate" :max-value="maxDate" color="blue"
                                    size="lg" class="p-4" :ui="{
                                        cellTrigger: 'size-10 text-base',
                                        heading: 'text-lg',
                                        headCell: 'text-sm'
                                    }" @update:model-value="(value) => updateField('birthDate', value?.toString())" />
                            </template>
                        </UPopover>
                    </UFormGroup>
                </div>
            </div>

            <!-- Kontaktinformationen (nur für Kontaktperson) -->
            <template v-if="isContactPerson">
                <div>
                    <h3 class="text-lg font-medium text-gray-700 mb-4">Kontaktinformationen</h3>
                    <div class="flex flex-col md:flex-row gap-4">
                        <UFormGroup label="E-Mail" required size="lg" class="flex-1 max-w-sm">
                            <UInput :model-value="passenger.email"
                                @update:model-value="(value) => updateField('email', value)" type="email"
                                placeholder="z.B. max.mustermann@email.de" icon="i-heroicons-envelope" size="lg"
                                class=" w-full" />
                        </UFormGroup>
                        <UFormGroup label="Telefonnummer" required size="lg" class="flex-1 max-w-sm">
                            <UInput :model-value="passenger.phone"
                                @update:model-value="(value) => updateField('phone', value)" type="tel"
                                placeholder="z.B. +49 123 456789" icon="i-heroicons-phone" size="lg" class=" w-full" />
                        </UFormGroup>
                    </div>
                    <div class="mt-4 flex flex-col max-w-xl">
                        <UFormGroup label="Adresse" required size="lg">
                            <UTextarea :model-value="passenger.address"
                                @update:model-value="(value) => updateField('address', value)"
                                placeholder="z.B. Musterstraße 123, 12345 Musterstadt" icon="i-heroicons-home" :rows="4"
                                size="lg" class="text-base" />
                        </UFormGroup>
                    </div>
                </div>
            </template>
        </div>
    </UCard>
</template>