<template>
  <div class="">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 bg-img-cover w-full h-full object-cover"></div>

    <!-- Content with glass effect -->
    <div class="z-10 py-12">
      <!-- Booking Form -->
      <div class="max-w-5xl mx-auto backdrop-blur-md bg-white/30 p-0 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Form Header -->
        <div class="py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 class="text-2xl font-bold">Billigflieger und preiswerter Urlaub</h2>
        </div>

        <div class="p-6 bg-white">
          <div class="flex items-center mb-6">
            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-800">Flüge</h3>
          </div>

          <!-- Flight Type Selection -->
          <div class="flex gap-8 mb-8">
            <label class="relative flex items-center cursor-pointer group">
              <input type="radio" v-model="tripType" value="roundTrip" class="absolute opacity-0 h-0 w-0">
              <div
                class="h-6 w-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-3 group-hover:border-blue-400">
                <div class="h-3 w-3 bg-blue-600 rounded-full" v-if="tripType === 'roundTrip'"></div>
              </div>
              <span class="text-gray-800 font-medium">Hin- und Rückflug</span>
            </label>
            <label class="relative flex items-center cursor-pointer group">
              <input type="radio" v-model="tripType" value="oneWay" class="absolute opacity-0 h-0 w-0">
              <div
                class="h-6 w-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-3 group-hover:border-blue-400">
                <div class="h-3 w-3 bg-blue-600 rounded-full" v-if="tripType === 'oneWay'"></div>
              </div>
              <span class="text-gray-800 font-medium">Nur Hinflug</span>
            </label>
          </div>

          <!-- Flight Search Form -->
          <div class="flex flex-wrap -mx-3">
            <!-- Departure -->
            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
              <div
                class="relative h-full border border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30">
                <div class="absolute top-3 left-4 text-xs font-medium text-gray-500">Abflugsort</div>
                <select v-model="departure"
                  class="w-full bg-transparent pt-8 pb-3 px-4 text-gray-800 font-medium focus:outline-none appearance-none">
                  <option value="" disabled>Von?</option>
                  <option v-for="airport in airports" :key="airport.value" :value="airport.value">
                    {{ airport.label }}
                  </option>
                </select>
                <div class="absolute top-1/2 right-4 mt-2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Swap Icon -->
            <div class="hidden md:flex w-auto items-center justify-center px-1 mb-6">
              <button type="button" @click="[departure, arrival] = [arrival, departure]"
                class="flex items-center justify-center h-12 w-12 rounded-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <!-- Arrival -->
            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
              <div
                class="relative h-full border border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30">
                <div class="absolute top-3 left-4 text-xs font-medium text-gray-500">Reiseziel</div>
                <select v-model="arrival"
                  class="w-full bg-transparent pt-8 pb-3 px-4 text-gray-800 font-medium focus:outline-none appearance-none">
                  <option value="" disabled>Nach?</option>
                  <option v-for="airport in airports" :key="airport.value" :value="airport.value">
                    {{ airport.label }}
                  </option>
                </select>
                <div class="absolute top-1/2 right-4 mt-2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Departure and Return Dates -->
            <div class="w-full md:w-1/2 lg:w-1/2 px-3 mb-6">
              <div @click="toggleDatePicker" :class="['relative h-full border rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors duration-200',
                showDatePicker ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30' : 'border-gray-300']">
                <div class="absolute top-3 left-4 text-xs font-medium text-gray-500">
                  {{ tripType === 'roundTrip' ? 'Hin- und Rückflug' : 'Hinflug' }}
                </div>
                <div class="pt-8 pb-3 px-4">
                  <div class="flex items-center">
                    <span class="text-gray-800 font-medium">
                      {{ formatDate(dateRange.start) || 'So., 18.05.' }}
                      {{ tripType === 'roundTrip' ? ' - ' + (formatDate(dateRange.end) || 'Do., 12.06.') : '' }}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 text-gray-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Date Picker with Range -->
              <div v-if="showDatePicker"
                class="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 calendar-wrapper">
                <UCalendar v-model="dateRange" :range="tripType === 'roundTrip'" size="md" color="primary"
                  class="min-w-[280px]" :min="today" />
                <div class="mt-4 flex justify-end">
                  <button @click="showDatePicker = false"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Auswählen</button>
                </div>
              </div>
            </div>

            <!-- Passengers -->
            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6" v-if="tripType === 'oneWay' || (windowWidth < 1024)">
              <div @click="togglePassengersDropdown" :class="['relative h-full border rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors duration-200',
                passengersActive ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30' : 'border-gray-300']">
                <div class="absolute top-3 left-4 text-xs font-medium text-gray-500">Reisende</div>
                <div class="pt-8 pb-3 px-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-gray-800 font-medium">{{ totalPassengers }}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Passengers Dropdown -->
              <div v-if="passengersActive"
                class="absolute z-50 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div class="p-4">
                  <!-- Adults -->
                  <div class="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div class="text-gray-800 font-medium">Erwachsene (12+)</div>
                      <div class="text-gray-500 text-sm">Ab 12 Jahren</div>
                    </div>
                    <div class="flex items-center">
                      <button @click="decrementPassenger('adults')" :disabled="passengers.adults <= 1"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          passengers.adults <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                        −
                      </button>
                      <span class="mx-4 w-5 text-center font-medium">{{ passengers.adults }}</span>
                      <button @click="incrementPassenger('adults')" :disabled="passengers.adults >= 9"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          passengers.adults >= 9 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600']">
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Children -->
                  <div class="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div class="text-gray-800 font-medium">Kinder (2-11 Jahre)</div>
                      <div class="text-gray-500 text-sm">Alter bei Reiseantritt</div>
                    </div>
                    <div class="flex items-center">
                      <button @click="decrementPassenger('children')" :disabled="passengers.children <= 0"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          passengers.children <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                        −
                      </button>
                      <span class="mx-4 w-5 text-center font-medium">{{ passengers.children }}</span>
                      <button @click="incrementPassenger('children')" :disabled="totalPassengers >= 9"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          totalPassengers >= 9 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600']">
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Babies -->
                  <div class="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div class="text-gray-800 font-medium">Babys (unter 2)</div>
                      <div class="text-gray-500 text-sm">Auf dem Schoß der Eltern</div>
                    </div>
                    <div class="flex items-center">
                      <button @click="decrementPassenger('infants')" :disabled="passengers.infants <= 0"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          passengers.infants <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                        −
                      </button>
                      <span class="mx-4 w-5 text-center font-medium">{{ passengers.infants }}</span>
                      <button @click="incrementPassenger('infants')"
                        :disabled="totalPassengers >= 9 || passengers.infants >= passengers.adults"
                        :class="['w-9 h-9 flex items-center justify-center rounded-full border text-lg',
                          totalPassengers >= 9 || passengers.infants >= passengers.adults ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600']">
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 p-4">
                  <button @click="passengersActive = false"
                    class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Button -->
        <div class="p-6 flex justify-center bg-gray-50">
          <button @click="handleBooking"
            class="px-10 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Flüge suchen
          </button>
        </div>
      </div>

      <!-- Destination Offers -->
      <div class="max-w-5xl mx-auto mt-8 mb-4">
        <div class="flex items-center justify-between px-4">
          <h2 class="text-2xl font-bold text-white drop-shadow-md">Die besten Angebote für Flüge ab Frankfurt</h2>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { CalendarDate } from '@internationalized/date'

const airports = [
  { value: 'VIE', label: 'VIE - Vienna' },
  { value: 'CGN', label: 'CGN - Cologne/Bonn' },
  { value: 'ATH', label: 'ATH - Athens' },
  { value: 'DAM', label: 'DAM - Damascus' },
  { value: 'FRA', label: 'FRA - Frankfurt' },
  { value: 'ROM', label: 'ROM - Rome' },
  { value: 'LON', label: 'LON - London' },
  { value: 'NYC', label: 'NYC - New York' },
  { value: 'PAR', label: 'PAR - Paris' }
]

const tripType = ref('roundTrip')
const departure = ref('')
const arrival = ref('')

// Date handling with internationalized/date for UCalendar
const today = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

// Use a range object for date selection
const dateRange = ref({
  start: new CalendarDate(2024, 5, 18),
  end: new CalendarDate(2024, 6, 12)
})

// UI state
const showDatePicker = ref(false)
const passengersActive = ref(false)
const windowWidth = ref(0)

const passengers = reactive({
  adults: 1,
  children: 0,
  infants: 0
})

const totalPassengers = computed(() => {
  return passengers.adults + passengers.children + passengers.infants
})

const formatDate = (calendarDate) => {
  if (!calendarDate) return ''

  // Convert CalendarDate to JS Date for formatting
  const dateObj = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)
  const day = dateObj.getDate()
  const month = dateObj.getMonth() + 1

  const dayNames = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']
  const dayName = dayNames[dateObj.getDay()]

  return `${dayName} ${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.`
}

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value
  if (showDatePicker.value) {
    passengersActive.value = false
  }
}

const togglePassengersDropdown = () => {
  passengersActive.value = !passengersActive.value
  if (passengersActive.value) {
    showDatePicker.value = false
  }
}

const incrementPassenger = (type) => {
  if (totalPassengers.value < 9) {
    passengers[type]++
  }
}

const decrementPassenger = (type) => {
  if (passengers[type] > 0 && (type !== 'adults' || passengers[type] > 1)) {
    passengers[type]--
  }
}

const handleBooking = () => {
  // Handle booking logic here
  console.log('handleBooking')
  console.log({
    tripType: tripType.value,
    departure: departure.value,
    arrival: arrival.value,
    departureDate: dateRange.value.start,
    returnDate: tripType.value === 'roundTrip' ? dateRange.value.end : null,
    passengers
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.bg-img-cover {
  background-image: url('../assets/imags/air-med-fleet.jpg');
  background-size: cover;
  background-position: center;
}

.bg-img-cover::before {
  content: "";
  background: linear-gradient(120deg, transparent, #201a84);
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
</style>
