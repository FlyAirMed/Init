<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

const df = new DateFormatter('de-DE', {
    dateStyle: 'medium'
});

interface Address {
    street: string;
    postalCode: string;
    city: string;
    country: string;
}

interface ContactPerson {
    firstName: string;
    lastName: string;
    birthDate: CalendarDate | null;
    email: string;
    phone: string;
    address: Address;
}

interface AdditionalPassenger {
    firstName: string;
    lastName: string;
    birthDate: CalendarDate | null;
    type: 'adult' | 'child' | 'infant';
}

const props = defineProps({
    totalAdults: {
        type: Number,
        required: true
    },
    totalChildren: {
        type: Number,
        required: true
    },
    totalInfants: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['update:passengers']);

const contactPerson = ref<ContactPerson>({
    firstName: '',
    lastName: '',
    birthDate: null,
    email: '',
    phone: '',
    address: {
        street: '',
        postalCode: '',
        city: '',
        country: ''
    }
});

const additionalPassengers = ref<AdditionalPassenger[]>([]);

// Validation functions
const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{8,}$/.test(phone);
};

const validatePostalCode = (postalCode: string) => {
    return /^\d{5}$/.test(postalCode);
};

const calculateAge = (birthDate: CalendarDate | null) => {
    if (!birthDate) return 0;

    const today = new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
    );

    let age = today.year - birthDate.year;
    const monthDiff = today.month - birthDate.month;

    if (monthDiff < 0 || (monthDiff === 0 && today.day < birthDate.day)) {
        age--;
    }

    return age;
};

const validateBirthDate = (birthDate: CalendarDate | null, type: 'adult' | 'child' | 'infant') => {
    if (!birthDate) return false;

    const age = calculateAge(birthDate);

    switch (type) {
        case 'adult':
            return age >= 18;
        case 'child':
            return age >= 2 && age <= 12;
        case 'infant':
            return age < 2;
        default:
            return false;
    }
};

const getBirthDateErrorMessage = (birthDate: CalendarDate | null, type: 'adult' | 'child' | 'infant') => {
    if (!birthDate) return 'Bitte geben Sie ein Geburtsdatum ein';

    const age = calculateAge(birthDate);

    switch (type) {
        case 'adult':
            return age < 18 ? 'Sie müssen mindestens 18 Jahre alt sein' : '';
        case 'child':
            if (age < 2) return 'Kinder müssen mindestens 2 Jahre alt sein';
            if (age > 12) return 'Kinder dürfen maximal 12 Jahre alt sein';
            return '';
        case 'infant':
            return age >= 2 ? 'Säuglinge müssen jünger als 2 Jahre sein' : '';
        default:
            return '';
    }
};

// Computed properties for date restrictions
const adultDateRestrictions = computed(() => {
    const today = new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
    );

    return {
        min: new CalendarDate(today.year - 100, today.month, today.day),
        max: new CalendarDate(today.year - 18, today.month, today.day)
    };
});

const childDateRestrictions = computed(() => {
    const today = new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
    );

    return {
        min: new CalendarDate(today.year - 12, today.month, today.day),
        max: new CalendarDate(today.year - 2, today.month, today.day)
    };
});

const infantDateRestrictions = computed(() => {
    const today = new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
    );

    return {
        min: new CalendarDate(today.year - 2, today.month, today.day),
        max: today
    };
});

// Form validation
const formValidation = computed(() => ({
    contactPerson: {
        firstName: contactPerson.value.firstName.length > 0,
        lastName: contactPerson.value.lastName.length > 0,
        birthDate: validateBirthDate(contactPerson.value.birthDate, 'adult'),
        email: validateEmail(contactPerson.value.email),
        phone: validatePhone(contactPerson.value.phone),
        address: {
            street: contactPerson.value.address.street.length > 0,
            postalCode: validatePostalCode(contactPerson.value.address.postalCode),
            city: contactPerson.value.address.city.length > 0,
            country: contactPerson.value.address.country.length > 0
        }
    }
}));

const isFormValid = computed(() => {
    const contactValid = Object.values(formValidation.value.contactPerson).every(valid =>
        typeof valid === 'boolean' ? valid : Object.values(valid).every(v => v)
    );

    const additionalValid = additionalPassengers.value.every(passenger =>
        passenger.firstName.length > 0 &&
        passenger.lastName.length > 0 &&
        validateBirthDate(passenger.birthDate, passenger.type)
    );

    return contactValid && additionalValid;
});

// Initialize additional passengers based on props
const initializeAdditionalPassengers = () => {
    additionalPassengers.value = [];

    // Add adults
    for (let i = 0; i < props.totalAdults - 1; i++) {
        additionalPassengers.value.push({
            firstName: '',
            lastName: '',
            birthDate: null,
            type: 'adult'
        });
    }

    // Add children
    for (let i = 0; i < props.totalChildren; i++) {
        additionalPassengers.value.push({
            firstName: '',
            lastName: '',
            birthDate: null,
            type: 'child'
        });
    }

    // Add infants
    for (let i = 0; i < props.totalInfants; i++) {
        additionalPassengers.value.push({
            firstName: '',
            lastName: '',
            birthDate: null,
            type: 'infant'
        });
    }
};

// Initialize on component mount
initializeAdditionalPassengers();

// Watch for changes and emit updates
watch([contactPerson, additionalPassengers], () => {
    emit('update:passengers', {
        contactPerson: contactPerson.value,
        additionalPassengers: additionalPassengers.value
    });
}, { deep: true });
</script>

<template>
    <div class="space-y-8">
        <!-- Contact Person Section -->
        <div class="bg-white rounded-lg shadow p-8">
            <h2 class="text-2xl font-semibold mb-8">Kontaktperson</h2>

            <div class="flex flex-wrap gap-6">
                <div class="w-full md:w-[calc(50%-12px)]">
                    <UFormGroup label="Vorname" required>
                        <UInput v-model="contactPerson.firstName"
                            :state="formValidation.contactPerson.firstName ? undefined : false"
                            placeholder="Vorname eingeben" size="xl" class="w-full" />
                    </UFormGroup>
                </div>

                <div class="w-full md:w-[calc(50%-12px)]">
                    <UFormGroup label="Nachname" required>
                        <UInput v-model="contactPerson.lastName"
                            :state="formValidation.contactPerson.lastName ? undefined : false"
                            placeholder="Nachname eingeben" size="xl" class="w-full" />
                    </UFormGroup>
                </div>

                <div class="w-full md:w-[calc(50%-12px)]">
                    <UFormGroup label="Geburtsdatum" required>
                        <UPopover>
                            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar"
                                :state="formValidation.contactPerson.birthDate ? undefined : false"
                                class="w-full justify-start">
                                {{ contactPerson.birthDate ?
                                    df.format(contactPerson.birthDate.toDate(getLocalTimeZone())) : 'Geburtsdatum auswählen'
                                }}
                            </UButton>

                            <template #content>
                                <UCalendar v-model="contactPerson.birthDate" :min-value="adultDateRestrictions.min"
                                    :max-value="adultDateRestrictions.max" class="p-2" />
                            </template>
                        </UPopover>
                        <template #error>
                            <span v-if="!formValidation.contactPerson.birthDate" class="text-red-500 text-sm">
                                {{ getBirthDateErrorMessage(contactPerson.birthDate, 'adult') }}
                            </span>
                        </template>
                    </UFormGroup>
                </div>

                <div class="w-full md:w-[calc(50%-12px)]">
                    <UFormGroup label="E-Mail" required>
                        <UInput v-model="contactPerson.email" type="email"
                            :state="formValidation.contactPerson.email ? undefined : false"
                            placeholder="E-Mail eingeben" size="xl" class="w-full" />
                    </UFormGroup>
                </div>

                <div class="w-full md:w-[calc(50%-12px)]">
                    <UFormGroup label="Telefonnummer" required>
                        <UInput v-model="contactPerson.phone" type="tel"
                            :state="formValidation.contactPerson.phone ? undefined : false"
                            placeholder="Telefonnummer eingeben" size="xl" class="w-full" />
                    </UFormGroup>
                </div>
            </div>

            <!-- Address Section -->
            <div class="mt-8">
                <h3 class="text-xl font-medium mb-6">Adresse</h3>
                <div class="flex flex-wrap gap-6">
                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Straße" required>
                            <UInput v-model="contactPerson.address.street"
                                :state="formValidation.contactPerson.address.street ? undefined : false"
                                placeholder="Straße eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>

                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="PLZ" required>
                            <UInput v-model="contactPerson.address.postalCode"
                                :state="formValidation.contactPerson.address.postalCode ? undefined : false"
                                placeholder="PLZ eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>

                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Ort" required>
                            <UInput v-model="contactPerson.address.city"
                                :state="formValidation.contactPerson.address.city ? undefined : false"
                                placeholder="Ort eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>

                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Land" required>
                            <UInput v-model="contactPerson.address.country"
                                :state="formValidation.contactPerson.address.country ? undefined : false"
                                placeholder="Land eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Passengers Section -->
        <div v-if="additionalPassengers.length > 0" class="bg-white rounded-lg shadow p-8">
            <h2 class="text-2xl font-semibold mb-8">Weitere Personen</h2>

            <div v-for="(passenger, index) in additionalPassengers" :key="index" class="mb-12">
                <div class="flex items-center gap-3 mb-6">
                    <UIcon
                        :name="passenger.type === 'adult' ? 'i-heroicons-user' : passenger.type === 'child' ? 'i-heroicons-user-group' : 'i-heroicons-user-circle'"
                        class="h-6 w-6" />
                    <h3 class="text-xl font-medium">
                        {{ passenger.type === 'adult' ? 'Erwachsener' : passenger.type === 'child' ? 'Kind' : 'Säugling'
                        }} {{
                            index + 1 }}
                    </h3>
                </div>

                <div class="flex flex-wrap gap-6">
                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Vorname" required>
                            <UInput v-model="passenger.firstName"
                                :state="passenger.firstName.length > 0 ? undefined : false"
                                placeholder="Vorname eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>

                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Nachname" required>
                            <UInput v-model="passenger.lastName"
                                :state="passenger.lastName.length > 0 ? undefined : false"
                                placeholder="Nachname eingeben" size="xl" class="w-full" />
                        </UFormGroup>
                    </div>

                    <div class="w-full md:w-[calc(50%-12px)]">
                        <UFormGroup label="Geburtsdatum" required>
                            <UPopover>
                                <UButton color="neutral" variant="subtle" icon="i-lucide-calendar"
                                    :state="validateBirthDate(passenger.birthDate, passenger.type) ? undefined : false"
                                    class="w-full justify-start">
                                    {{ passenger.birthDate ? df.format(passenger.birthDate.toDate(getLocalTimeZone())) :
                                        'Geburtsdatum auswählen' }}
                                </UButton>

                                <template #content>
                                    <UCalendar v-model="passenger.birthDate" :min-value="passenger.type === 'adult' ? adultDateRestrictions.min :
                                        passenger.type === 'child' ? childDateRestrictions.min :
                                            infantDateRestrictions.min" :max-value="passenger.type === 'adult' ? adultDateRestrictions.max :
                                                passenger.type === 'child' ? childDateRestrictions.max :
                                                    infantDateRestrictions.max" class="p-2" />
                                </template>
                            </UPopover>
                            <template #error>
                                <span v-if="!validateBirthDate(passenger.birthDate, passenger.type)"
                                    class="text-red-500 text-sm">
                                    {{ getBirthDateErrorMessage(passenger.birthDate, passenger.type) }}
                                </span>
                            </template>
                        </UFormGroup>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>