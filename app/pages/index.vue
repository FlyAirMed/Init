<template>
  <div class="min-h-screen container mx-auto flex flex-col items-center">
    <!-- Hintergrundbild mit moderner Gradient-Overlay -->
    <div class="relative flex flex-col items-center w-full">
      <div class="w-full">
        <img src="../assets/imags/bg.png" class="w-full" alt="Background" />
      </div>

      <!-- Content mit verbessertem Glaseffekt -->
      <div class="absolute top-0 z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        <!-- Booking Form -->
        <div
          class="backdrop-blur-x rounded-4xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.5)] w-full max-w-[1200px] transition-all duration-300">

          <div
            class="p-4 sm:p-6 md:p-8 lg:p-10 bg-white/85 backdrop-blur-md rounded-4xl shadow-lg transition-all duration-300">

            <!-- Flight Type Selection -->
            <div class="flex gap-4 sm:gap-12 mb-6 sm:mb-8 justify-center lg:justify-start">
              <label
                class="relative flex items-center cursor-pointer group min-w-[140px] sm:min-w-[160px] p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <input type="radio" v-model="tripType" value="roundTrip" class="absolute opacity-0 h-0 w-0" />
                <div
                  class="h-5 w-5 sm:h-6 sm:w-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:border-blue-400 transition-all duration-200 shadow-sm">
                  <div
                    class="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-blue-600 rounded-full transform scale-0 transition-transform duration-200"
                    :class="{
                      'scale-100':
                        tripType === 'roundTrip',
                    }"></div>
                </div>
                <span class="text-sm sm:text-base text-gray-800 font-medium">Hin- und Rückflug</span>
              </label>
              <label
                class="relative flex items-center cursor-pointer group min-w-[140px] sm:min-w-[160px] p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <input type="radio" v-model="tripType" value="oneWay" class="absolute opacity-0 h-0 w-0" />
                <div
                  class="h-5 w-5 sm:h-6 sm:w-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:border-blue-400 transition-all duration-200 shadow-sm">
                  <div
                    class="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-blue-600 rounded-full transform scale-0 transition-transform duration-200"
                    :class="{
                      'scale-100': tripType === 'oneWay',
                    }"></div>
                </div>
                <span class="text-sm sm:text-base text-gray-800 font-medium">Nur Hinflug</span>
              </label>
            </div>

            <!-- Flight Search Form - Responsive Layout -->
            <div class="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              <!-- Departure and Arrival -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 md:col-span-3 lg:col-span-3">
                <!-- Departure -->
                <div class="relative">
                  <div
                    class="relative h-full border border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30 shadow-sm hover:shadow-md">
                    <div class="absolute top-2 sm:top-3 left-4 text-xs font-semibold text-gray-500 tracking-wide">
                      Abflugsort
                    </div>
                    <USelectMenu v-model="departure" :items="airports" value-key="value" placeholder="Von?"
                      :search-input="{
                        placeholder:
                          'Flughafen suchen...',
                      }" class="w-full bg-transparent pt-6 sm:pt-8 pb-2 sm:pb-3 px-4" variant="none" />
                  </div>
                </div>

                <!-- Arrival -->
                <div class="relative">
                  <div
                    class="relative h-full border border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30 shadow-sm hover:shadow-md">
                    <div class="absolute top-2 sm:top-3 left-4 text-xs font-semibold text-gray-500 tracking-wide">
                      Reiseziel
                    </div>
                    <USelectMenu v-model="arrival" :items="airports" value-key="value" placeholder="Nach?"
                      :search-input="{
                        placeholder:
                          'Flughafen suchen...',
                      }" class="w-full bg-transparent pt-6 sm:pt-8 pb-2 sm:pb-3 px-4" variant="none" />
                  </div>

                  <!-- Swap Button (absolute positioned) -->
                  <button type="button" @click="
                    [departure, arrival] = [
                      arrival,
                      departure,
                    ]
                    "
                    class="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 md:-left-3 lg:-left-8 z-10 flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Departure and Return Dates -->
              <div class="w-full md:col-span-1 lg:col-span-2">
                <div @click="toggleDatePicker" :class="[
                  'relative h-full border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md',
                  showDatePicker
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                    : 'border-gray-300 hover:border-blue-400',
                ]">
                  <div class="absolute top-2 sm:top-3 left-4 text-xs font-semibold text-gray-500 tracking-wide">
                    {{
                      tripType === "roundTrip"
                        ? "Hin- und Rückflug"
                        : "Hinflug"
                    }}
                  </div>
                  <div class="pt-6 sm:pt-8 pb-2 sm:pb-3 px-4">
                    <div class="flex items-center">
                      <span class="text-sm sm:text-base text-gray-800 font-medium truncate">
                        {{
                          tripType === "roundTrip"
                            ? formatDate(
                              dateRange.start
                            ) +
                            " - " +
                            formatDate(
                              dateRange.end
                            )
                            : formatDate(singleDate)
                        }}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 sm:h-5 sm:w-5 ml-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Date Picker (Range for Round Trip, Single for One Way) -->
                <div v-if="showDatePicker"
                  class="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-5 calendar-wrapper backdrop-blur-xl bg-white/95 transition-all duration-300 left-4 right-4 sm:left-auto sm:right-auto">
                  <!-- Show range calendar for round trip -->
                  <UCalendar v-if="tripType === 'roundTrip'" v-model="dateRange" range size="sm" sm:size="md"
                    color="primary" class="min-w-[280px]" :min="today" />
                  <!-- Show single date calendar for one way -->
                  <UCalendar v-else v-model="singleDate" size="sm" sm:size="md" color="primary" class="min-w-[280px]"
                    :min="today" />
                  <div class="mt-4 sm:mt-5 flex justify-end">
                    <button @click="showDatePicker = false"
                      class="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                      Auswählen
                    </button>
                  </div>
                </div>
              </div>

              <!-- Passengers -->
              <div class="w-full md:col-span-1">
                <div @click="togglePassengersDropdown" :class="[
                  'relative h-full border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md',
                  passengersActive
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                    : 'border-gray-300 hover:border-blue-400',
                ]">
                  <div class="absolute top-2 sm:top-3 left-4 text-xs font-semibold text-gray-500 tracking-wide">
                    Reisende
                  </div>
                  <div class="pt-6 sm:pt-8 pb-2 sm:pb-3 px-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="text-sm sm:text-base text-gray-800 font-medium">{{ totalPassengers }}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Passengers Dropdown -->
                <div v-if="passengersActive"
                  class="absolute z-50 mt-2 w-[calc(100%-2rem)] sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-xl bg-white/95 transition-all duration-300 left-4 right-4 sm:left-auto sm:right-auto lg:right-0">
                  <div class="p-4 sm:p-5">
                    <!-- Adults -->
                    <div class="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
                      <div>
                        <div class="text-gray-800 font-medium text-base sm:text-lg">
                          Erwachsene (12+)
                        </div>
                        <div class="text-gray-500 text-xs sm:text-sm">
                          Ab 12 Jahren
                        </div>
                      </div>
                      <div class="flex items-center">
                        <button @click="
                          decrementPassenger(
                            'adults'
                          )
                          " :disabled="passengers.adults <= 1
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              passengers.adults <= 1
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50',
                            ]">
                          −
                        </button>
                        <span class="mx-3 sm:mx-4 w-5 text-center font-medium">{{
                          passengers.adults
                        }}</span>
                        <button @click="
                          incrementPassenger(
                            'adults'
                          )
                          " :disabled="passengers.adults >= 9
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              passengers.adults >= 9
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md',
                            ]">
                          +
                        </button>
                      </div>
                    </div>

                    <!-- Children -->
                    <div class="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
                      <div>
                        <div class="text-gray-800 font-medium text-base sm:text-lg">
                          Kinder (2-11 Jahre)
                        </div>
                        <div class="text-gray-500 text-xs sm:text-sm">
                          Alter bei Reiseantritt
                        </div>
                      </div>
                      <div class="flex items-center">
                        <button @click="
                          decrementPassenger(
                            'children'
                          )
                          " :disabled="passengers.children <= 0
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              passengers.children <= 0
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50',
                            ]">
                          −
                        </button>
                        <span class="mx-3 sm:mx-4 w-5 text-center font-medium">{{
                          passengers.children
                        }}</span>
                        <button @click="
                          incrementPassenger(
                            'children'
                          )
                          " :disabled="totalPassengers >= 9
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              totalPassengers >= 9
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md',
                            ]">
                          +
                        </button>
                      </div>
                    </div>

                    <!-- Babies -->
                    <div class="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
                      <div>
                        <div class="text-gray-800 font-medium text-base sm:text-lg">
                          Babys (unter 2)
                        </div>
                        <div class="text-gray-500 text-xs sm:text-sm">
                          Auf dem Schoß der Eltern
                        </div>
                      </div>
                      <div class="flex items-center">
                        <button @click="
                          decrementPassenger(
                            'infants'
                          )
                          " :disabled="passengers.infants <= 0
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              passengers.infants <= 0
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50',
                            ]">
                          −
                        </button>
                        <span class="mx-3 sm:mx-4 w-5 text-center font-medium">{{
                          passengers.infants
                        }}</span>
                        <button @click="
                          incrementPassenger(
                            'infants'
                          )
                          " :disabled="totalPassengers >= 9 ||
                            passengers.infants >=
                            passengers.adults
                            " :class="[
                              'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              totalPassengers >= 9 ||
                                passengers.infants >=
                                passengers.adults
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md',
                            ]">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search Button -->
            <div class="mt-6 lg:mt-8 flex justify-center lg:justify-end px-0 sm:px-6">
              <button @click="handleBooking"
                class="w-full sm:w-auto px-6 sm:px-12 md:px-20 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base sm:text-lg font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98]">
                Flüge suchen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { CalendarDate } from "@internationalized/date";

const airports = [
  { value: "VIE", label: "VIE - Wien" },
  { value: "CGN", label: "CGN - Köln/Bonn" },
  { value: "ATH", label: "ATH - Athen" },
  { value: "DAM", label: "DAM - Damaskus" },
];

const tripType = ref("roundTrip");
const departure = ref("");
const arrival = ref("");

// Date handling with internationalized/date for UCalendar
const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
);

// For round trip, use a range object
const dateRange = ref({
  start: new CalendarDate(2024, 5, 18),
  end: new CalendarDate(2024, 6, 12),
});

// For one-way trip, use a single date
const singleDate = ref(new CalendarDate(2024, 5, 18));

// UI state
const showDatePicker = ref(false);
const passengersActive = ref(false);

const passengers = reactive({
  adults: 1,
  children: 0,
  infants: 0,
});

const totalPassengers = computed(() => {
  return passengers.adults + passengers.children + passengers.infants;
});

const formatDate = (calendarDate) => {
  if (!calendarDate) return "";

  // Convert CalendarDate to JS Date for formatting
  const dateObj = new Date(
    calendarDate.year,
    calendarDate.month - 1,
    calendarDate.day
  );
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;

  const dayNames = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
  const dayName = dayNames[dateObj.getDay()];

  return `${dayName} ${day.toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.`;
};

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
  if (showDatePicker.value) {
    passengersActive.value = false;
  }
};

const togglePassengersDropdown = () => {
  passengersActive.value = !passengersActive.value;
  if (passengersActive.value) {
    showDatePicker.value = false;
  }
};

const incrementPassenger = (type) => {
  if (totalPassengers.value < 9) {
    passengers[type]++;
  }
};

const decrementPassenger = (type) => {
  if (
    passengers[type] > 0 &&
    (type !== "adults" || passengers[type] > 1)
  ) {
    passengers[type]--;
  }
};


const handleBooking = () => {
  // Handle booking logic here
  console.log("handleBooking");
  console.log({
    tripType: tripType.value,
    departure: departure.value,
    arrival: arrival.value,
    departureDate:
      tripType.value === "roundTrip"
        ? dateRange.value.start
        : singleDate.value,
    returnDate:
      tripType.value === "roundTrip" ? dateRange.value.end : null,
    passengers,
  });
};
</script>

<style scoped>
@media (max-width: 640px) {
  .calendar-wrapper {
    max-width: calc(100vw - 2rem);
  }
}

@media (max-width: 768px) {
  .backdrop-blur-x {
    max-width: 100%;
  }
}
</style>
