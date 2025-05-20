<script setup>
import { ref, computed, watch } from 'vue';
import PassengerForm from './PassengerForm.vue';

const props = defineProps({
    totalPassengers: {
        type: Number,
        required: true
    }
});

const contactPerson = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: ''
});

const additionalPassengers = ref([]);

// Initialize additional passengers array based on total passengers
const initializePassengers = () => {
    additionalPassengers.value = Array(props.totalPassengers - 1).fill().map(() => ({
        firstName: '',
        lastName: '',
        birthDate: ''
    }));
};

// Watch for changes in totalPassengers
watch(() => props.totalPassengers, () => {
    initializePassengers();
}, { immediate: true });

const updatePassenger = (index, value) => {
    additionalPassengers.value[index] = value;
};

const isFormValid = computed(() => {
    const contactValid = contactPerson.value.firstName &&
        contactPerson.value.lastName &&
        contactPerson.value.email &&
        contactPerson.value.phone &&
        contactPerson.value.birthDate &&
        contactPerson.value.address;

    const additionalValid = additionalPassengers.value.every(p =>
        p.firstName && p.lastName && p.birthDate
    );

    return contactValid && additionalValid;
});

defineExpose({
    isFormValid,
    contactPerson,
    additionalPassengers
});
</script>

<template>
    <div class="space-y-6">
        <!-- Contact Person -->
        <PassengerForm v-model:passenger="contactPerson" :passenger-number="1" :is-contact-person="true" />

        <!-- Additional Passengers -->
        <template v-if="additionalPassengers.length > 0">
            <PassengerForm v-for="(passenger, index) in additionalPassengers" :key="index" :passenger="passenger"
                @update:passenger="(value) => updatePassenger(index, value)" :passenger-number="index + 2" />
        </template>
    </div>
</template>