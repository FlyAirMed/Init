<template>
  <div class="relative min-h-screen">
    <div class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 min-h-screen relative">
      <!-- Hintergrund-Deko -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <!-- Floating Icons - Hide on mobile -->
        <div class="hidden sm:block absolute top-1/4 left-10 animate-float-slow">
          <UIcon name="fluent-emoji-high-contrast:airplane" class="h-12 w-12 text-blue-300/40" />
        </div>
        <div class="hidden sm:block absolute top-1/3 right-20 animate-float-slower">
          <UIcon name="fluent-emoji-high-contrast:airplane-departure" class="h-12 w-12 text-blue-300/40" />
        </div>
        <div class="hidden sm:block absolute bottom-1/4 left-1/4 animate-float-slowest">
          <UIcon name="fluent-emoji-high-contrast:globe-showing-europe-africa" class="h-12 w-12 text-blue-300/40" />
        </div>
        <div class="hidden sm:block absolute top-2/3 right-1/3 animate-float-slow">
          <UIcon name="fluent-emoji-high-contrast:airplane-arrival" class="h-12 w-12 text-blue-300/40" />
        </div>
        <!-- Animated Circles - Adjust size for mobile -->
        <div
          class="absolute top-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-blue-400/10 rounded-full animate-pulse-slow">
        </div>
        <div
          class="absolute bottom-1/3 left-1/3 w-64 sm:w-[32rem] h-64 sm:h-[32rem] bg-blue-300/10 rounded-full animate-pulse-slower">
        </div>
        <div
          class="absolute top-2/3 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-blue-200/10 rounded-full animate-pulse-slowest">
        </div>
        <!-- Air Mediterranean Plane Image - Adjust for mobile -->
        <img src="../assets/imags/air-med-fleet.png" alt="Air Mediterranean Flugzeug"
          class="absolute -top-5 sm:-top-30 right-0 max-w-[90vw] sm:max-w-[80vw] opacity-80 pointer-events-none animate-plane-float"
          style="z-index:1; transform: rotate(-15deg);" />
      </div>
      <div class="container mx-auto flex flex-col items-center relative z-10">
        <!-- Hero Slogan - Adjust for mobile -->
        <div class="relative flex w-full mb-20 sm:mb-36">
          <div class="mt-12 sm:mt-20 pt-8 sm:pt-12 pb-6 sm:pb-8 z-20 relative">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center sm:text-end drop-shadow-lg mb-2 sm:mb-3 animate-fade-in">
              Dein Weg nach Damaskus
              <br>
              <span class="text-orange-400">beginnt</span> hier.
            </h1>
            <h2
              class="text-base ml-2 sm:text-lg md:text-xl lg:text-2xl font-medium text-blue-100 text-center drop-shadow mb-2 animate-fade-in-delayed">
              Air Mediterranean verbindet Europa mit Damaskus
            </h2>
          </div>
        </div>
        <div class="w-full flex flex-col items-center justify-center px-2 sm:px-4 md:px-6">
          <!-- Booking Form -->
          <div
            class="backdrop-blur-x rounded-2xl sm:rounded-4xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.5)] w-full max-w-[1200px] transition-all duration-300">
            <div
              class="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-4xl shadow-lg transition-all duration-300">
              <!-- Flight Type Selection -->
              <div class="flex gap-2 sm:gap-4 md:gap-12 mb-4 sm:mb-6 md:mb-8 justify-center lg:justify-start">
                <label
                  class="relative flex items-center cursor-pointer group min-w-[140px] sm:min-w-[160px] md:min-w-[180px] p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors">
                  <input type="radio" v-model="tripType" value="roundTrip" class="absolute opacity-0 h-0 w-0" />
                  <div
                    class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:border-blue-400 transition-all duration-200 shadow-sm">
                    <div
                      class="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 bg-blue-600 rounded-full transform scale-0 transition-transform duration-200"
                      :class="{ 'scale-100': tripType === 'roundTrip' }"></div>
                  </div>
                  <span class="text-sm sm:text-base md:text-lg text-gray-800 font-medium">Hin- und Rückflug</span>
                </label>
                <label
                  class="relative flex items-center cursor-pointer group min-w-[140px] sm:min-w-[160px] md:min-w-[180px] p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors">
                  <input type="radio" v-model="tripType" value="oneWay" class="absolute opacity-0 h-0 w-0" />
                  <div
                    class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:border-blue-400 transition-all duration-200 shadow-sm">
                    <div
                      class="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 bg-blue-600 rounded-full transform scale-0 transition-transform duration-200"
                      :class="{ 'scale-100': tripType === 'oneWay' }"></div>
                  </div>
                  <span class="text-sm sm:text-base md:text-lg text-gray-800 font-medium">Nur Hinflug</span>
                </label>
              </div>

              <!-- Flight Search Form - Responsive Layout -->
              <div class="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                <!-- Departure and Arrival -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 md:col-span-3 lg:col-span-3">
                  <!-- Departure -->
                  <div class="relative">
                    <div
                      class="relative h-full border border-gray-300 rounded-lg sm:rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30 shadow-sm hover:shadow-md">
                      <div
                        class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                        Abflugsort
                      </div>
                      <USelectMenu v-model="departure" :items="airports" value-key="value" placeholder="Von?"
                        :search-input="{ placeholder: 'Flughafen suchen...' }"
                        class="w-full bg-transparent pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4"
                        variant="none" />
                    </div>
                  </div>

                  <!-- Arrival -->
                  <div class="relative">
                    <div
                      class="relative h-full border border-gray-300 rounded-lg sm:rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-30 shadow-sm hover:shadow-md">
                      <div
                        class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                        Reiseziel
                      </div>
                      <USelectMenu v-model="arrival" :items="airports" value-key="value" placeholder="Nach?"
                        :search-input="{ placeholder: 'Flughafen suchen...' }"
                        class="w-full bg-transparent pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4"
                        variant="none" />
                    </div>
                  </div>
                </div>

                <!-- Departure and Return Dates -->
                <div class="w-full md:col-span-1 lg:col-span-2">
                  <!-- One-way date selection -->
                  <div v-if="tripType === TripType.ONE_WAY" @click="toggleDatePicker('departure')" :class="['relative h-full border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md date-picker-button',
                    showDatePicker === 'departure'
                      ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                      : 'border-gray-300 hover:border-blue-400']">
                    <div
                      class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                      Hinflug
                    </div>
                    <div class="pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4">
                      <div class="flex items-center">
                        <span class="text-xs sm:text-sm md:text-base text-gray-800 font-medium truncate">
                          {{ formatDate(singleDate) }}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-1.5 sm:ml-2 text-gray-400 flex-shrink-0"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Round trip date selection -->
                  <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
                    <!-- Departure date -->
                    <div @click="toggleDatePicker('departure')" :class="['relative h-full border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md date-picker-button',
                      showDatePicker === 'departure'
                        ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                        : 'border-gray-300 hover:border-blue-400']">
                      <div
                        class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                        Hinflug
                      </div>
                      <div class="pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4">
                        <div class="flex items-center">
                          <span class="text-xs sm:text-sm md:text-base text-gray-800 font-medium truncate">
                            {{ formatDate(dateRange.start) }}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-1.5 sm:ml-2 text-gray-400 flex-shrink-0"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- Return date -->
                    <div @click="toggleDatePicker('return')" :class="['relative h-full border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md date-picker-button',
                      showDatePicker === 'return'
                        ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                        : 'border-gray-300 hover:border-blue-400']">
                      <div
                        class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                        Rückflug
                      </div>
                      <div class="pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4">
                        <div class="flex items-center">
                          <span class="text-xs sm:text-sm md:text-base text-gray-800 font-medium truncate">
                            {{ formatDate(dateRange.end) }}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-1.5 sm:ml-2 text-gray-400 flex-shrink-0"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Date Picker (Grid for available dates) -->
                  <div v-if="showDatePicker"
                    class="absolute z-50 mt-2 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 md:p-5 calendar-wrapper backdrop-blur-xl bg-white/95 transition-all duration-300 left-2 right-2 sm:left-4 sm:right-4 md:left-auto md:right-auto">
                    <!-- Loading indicator -->
                    <div v-if="isSearchingDates" class="flex flex-col items-center py-6 sm:py-8">
                      <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-2">
                      </div>
                      <p class="text-sm sm:text-base text-gray-600">Verfügbare Daten werden geladen...</p>
                    </div>

                    <!-- Error message -->
                    <div v-else-if="errorMessage && availableDates.length === 0"
                      class="p-3 sm:p-4 text-center text-sm sm:text-base text-red-600">
                      {{ errorMessage }}
                    </div>

                    <!-- Show message if no dates available -->
                    <div v-else-if="availableDates.length === 0"
                      class="p-3 sm:p-4 text-center text-sm sm:text-base text-gray-600">
                      Keine Flüge zwischen diesen Städten gefunden.
                    </div>

                    <!-- Calendar for available dates -->
                    <div v-else>
                      <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                        {{ showDatePicker === 'departure' ? 'Hinflug wählen' : 'Rückflug wählen' }}
                      </h3>

                      <UCalendar
                        :model-value="showDatePicker === 'departure' ? (tripType === TripType.ROUND_TRIP ? dateRange.start : singleDate) : dateRange.end"
                        @update:model-value="handleDateSelection"
                        :is-date-disabled="showDatePicker === 'departure' ? isDateDisabled : isReturnDateDisabled"
                        :range="false" :min-value="showDatePicker === 'return' ? dateRange.start : today"
                        class="w-full">
                        <template #day="{ day }">
                          <span :class="{
                            'text-black-600 font-bold text-lg sm:text-xl': !(showDatePicker === 'departure' ? isDateDisabled(day) : isReturnDateDisabled(day)),
                            'text-gray-400': showDatePicker === 'departure' ? isDateDisabled(day) : isReturnDateDisabled(day)
                          }">{{ day.day }}</span>
                        </template>
                      </UCalendar>
                    </div>

                    <div class="mt-3 sm:mt-4 md:mt-5 flex justify-end">
                      <button @click="confirmDateSelection"
                        class="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                        Auswählen
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Passengers -->
                <div class="w-full md:col-span-1">
                  <div @click="togglePassengersDropdown" :class="['relative h-full border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md passengers-button',
                    passengersActive
                      ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30'
                      : 'border-gray-300 hover:border-blue-400']">
                    <div
                      class="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-4 text-xs font-semibold text-gray-500 tracking-wide">
                      Reisende
                    </div>
                    <div class="pt-5 sm:pt-6 md:pt-8 pb-1.5 sm:pb-2 md:pb-3 px-3 sm:px-4">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span class="text-xs sm:text-sm md:text-base text-gray-800 font-medium">{{ totalPassengers
                            }}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Passengers Dropdown -->
                  <div v-if="passengersActive"
                    class="absolute z-50 mt-2 w-[calc(100%-1rem)] sm:w-80 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-xl bg-white/95 transition-all duration-300 left-2 right-2 sm:left-4 sm:right-4 md:left-auto md:right-auto lg:right-0 passengers-dropdown">
                    <div class="p-3 sm:p-4 md:p-5">
                      <!-- Adults -->
                      <div class="flex items-center justify-between py-2 sm:py-3 md:py-4 border-b border-gray-100">
                        <div>
                          <div class="text-gray-800 font-medium text-sm sm:text-base md:text-lg">
                            Erwachsene (12+)
                          </div>
                          <div class="text-gray-500 text-xs sm:text-sm">
                            Ab 12 Jahren
                          </div>
                        </div>
                        <div class="flex items-center">
                          <button @click="decrementPassenger('adults')" :disabled="passengers.adults <= 1" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                            passengers.adults <= 1
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                            −
                          </button>
                          <span class="mx-2 sm:mx-3 md:mx-4 w-4 sm:w-5 text-center font-medium">{{ passengers.adults
                            }}</span>
                          <button @click="incrementPassenger('adults')" :disabled="passengers.adults >= 9" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                            passengers.adults >= 9
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md']">
                            +
                          </button>
                        </div>
                      </div>

                      <!-- Children -->
                      <div class="flex items-center justify-between py-2 sm:py-3 md:py-4 border-b border-gray-100">
                        <div>
                          <div class="text-gray-800 font-medium text-sm sm:text-base md:text-lg">
                            Kinder (2-11 Jahre)
                          </div>
                          <div class="text-gray-500 text-xs sm:text-sm">
                            Alter bei Reiseantritt
                          </div>
                        </div>
                        <div class="flex items-center">
                          <button @click="decrementPassenger('children')" :disabled="passengers.children <= 0" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                            passengers.children <= 0
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                            −
                          </button>
                          <span class="mx-2 sm:mx-3 md:mx-4 w-4 sm:w-5 text-center font-medium">{{ passengers.children
                            }}</span>
                          <button @click="incrementPassenger('children')" :disabled="totalPassengers >= 9" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                            totalPassengers >= 9
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md']">
                            +
                          </button>
                        </div>
                      </div>

                      <!-- Babies -->
                      <div class="flex items-center justify-between py-2 sm:py-3 md:py-4 border-b border-gray-100">
                        <div>
                          <div class="text-gray-800 font-medium text-sm sm:text-base md:text-lg">
                            Babys (unter 2)
                          </div>
                          <div class="text-gray-500 text-xs sm:text-sm">
                            Auf dem Schoß der Eltern
                          </div>
                        </div>
                        <div class="flex items-center">
                          <button @click="decrementPassenger('infants')" :disabled="passengers.infants <= 0" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                            passengers.infants <= 0
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50']">
                            −
                          </button>
                          <span class="mx-2 sm:mx-3 md:mx-4 w-4 sm:w-5 text-center font-medium">{{ passengers.infants
                            }}</span>
                          <button @click="incrementPassenger('infants')"
                            :disabled="totalPassengers >= 9 || passengers.infants >= passengers.adults" :class="['w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
                              totalPassengers >= 9 || passengers.infants >= passengers.adults
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-md']">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button @click="handleBooking"
                class="md:absolute  w-full sm:w-auto px-4 sm:px-6 md:px-12 lg:px-20 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base md:text-lg font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98] mt-4 sm:mt-6 md:mt-8"
                :disabled="isSearchingFlights || !departure || !arrival || (tripType === TripType.ROUND_TRIP && availableReturnDates.length === 0)"
                :class="{ 'cursor-not-allowed': isSearchingFlights || !departure || !arrival || (tripType === TripType.ROUND_TRIP && availableReturnDates.length === 0) }">
                <span v-if="isSearchingFlights">Suchen...</span>
                <span v-else>Flüge suchen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { CalendarDate } from "@internationalized/date";
import { AIRPORTS, TripType } from '../../types';

// Replace static airports with the typed constant from types
const airports = Object.entries(AIRPORTS).map(([code, details]) => ({
  value: code,
  label: `${code} - ${details.name}`
}));

// Use the TripType enum
const tripType = ref(TripType.ROUND_TRIP);
const departure = ref("");
const arrival = ref("");

// Date handling with internationalized/date for UCalendar
const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
);

// Update the date handling in the script section
const dateRange = ref({
  start: null,
  end: null
});

const singleDate = ref(null);

// UI state
const showDatePicker = ref(null);
const passengersActive = ref(false);
const errorMessage = ref("");

// Available dates from API
const availableDates = ref([]);
const availableReturnDates = ref([]);

// Handle loading states
const isSearchingFlights = ref(false);
const isSearchingDates = ref(false);

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

// Convert CalendarDate to YYYY-MM-DD string format
const toDateString = (calendarDate) => {
  if (!calendarDate) return "";
  return `${calendarDate.year}-${calendarDate.month.toString().padStart(2, "0")}-${calendarDate.day.toString().padStart(2, "0")}`;
};

// Convert YYYY-MM-DD string to CalendarDate
const toCalendarDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new CalendarDate(year, month, day);
};

const toggleDatePicker = (type) => {
  if (showDatePicker.value === type) {
    showDatePicker.value = null;
  } else {
    showDatePicker.value = type;
    passengersActive.value = false;
  }
};

const togglePassengersDropdown = () => {
  passengersActive.value = !passengersActive.value;
  if (passengersActive.value) {
    showDatePicker.value = null;
  }
};

const incrementPassenger = (type) => {
  if (totalPassengers.value < 9) {
    if (type === 'infants' && passengers.infants >= passengers.adults) {
      return;
    }
    passengers[type]++;
  }
};

const decrementPassenger = (type) => {
  if (type === 'adults' && passengers.adults <= 1) {
    return;
  }
  if (passengers[type] > 0) {
    passengers[type]--;
  }
};

// Fetch available dates when origin and destination are selected
watch([departure, arrival], async ([newDeparture, newArrival]) => {
  if (newDeparture && newArrival) {
    await fetchAvailableDates();
  }
}, { immediate: false });

// Update the watch for trip type changes
watch(tripType, (newTripType) => {
  if (newTripType === TripType.ONE_WAY) {
    if (dateRange.value.start) {
      singleDate.value = dateRange.value.start;
    }
  } else {
    if (singleDate.value) {
      dateRange.value.start = singleDate.value;
      dateRange.value.end = null;
      fetchReturnDates(singleDate.value);
    }
  }
});

// Fetch available flight dates from the API
const fetchAvailableDates = async () => {
  if (!departure.value || !arrival.value) {
    return;
  }

  try {
    isSearchingDates.value = true;
    errorMessage.value = "";

    const response = await $fetch('/api/flights/available-dates', {
      method: 'POST',
      body: {
        origin: departure.value,
        destination: arrival.value
      }
    });

    if (response.success && response.data) {
      availableDates.value = response.data.dates;

      // If we have available dates, set the default date to the first available date
      if (availableDates.value.length > 0) {
        const firstDate = toCalendarDate(availableDates.value[0].date);

        if (tripType.value === TripType.ROUND_TRIP) {
          dateRange.value.start = firstDate;

          // Also fetch return dates
          await fetchReturnDates(firstDate);
        } else {
          singleDate.value = firstDate;
        }
      }
    } else if (response.error) {
      errorMessage.value = response.error.message;
      console.error('Error fetching dates:', response.error);
    }
  } catch (error) {
    errorMessage.value = "Failed to load available dates. Please try again.";
    console.error('Error in fetchAvailableDates:', error);
  } finally {
    isSearchingDates.value = false;
  }
};

// Update the fetchReturnDates function
const fetchReturnDates = async (departureDate) => {
  if (!departure.value || !arrival.value || !departureDate) {
    return;
  }

  try {
    const response = await $fetch('/api/flights/available-dates', {
      method: 'POST',
      body: {
        origin: arrival.value,
        destination: departure.value
      }
    });

    if (response.success && response.data) {
      const departureDateStr = toDateString(departureDate);
      availableReturnDates.value = response.data.dates.filter(
        date => date.date >= departureDateStr
      );
    }
  } catch (error) {
    console.error('Error in fetchReturnDates:', error);
    availableReturnDates.value = [];
  }
};

// Function to handle date selection
const handleDateSelection = (date) => {
  if (showDatePicker.value === 'departure') {
    if (tripType.value === TripType.ROUND_TRIP) {
      dateRange.value.start = date;
      // Clear return date when departure changes
      dateRange.value.end = null;
      // Fetch new return dates
      fetchReturnDates(date);
    } else {
      singleDate.value = date;
    }
  } else if (showDatePicker.value === 'return') {
    dateRange.value.end = date;
  }
};

// Handle booking
const handleBooking = async () => {
  if (!departure.value || !arrival.value) {
    errorMessage.value = "Please select both departure and destination airports.";
    return;
  }

  // Basic date validation
  if (tripType.value === TripType.ROUND_TRIP) {
    if (!dateRange.value.start || !dateRange.value.end) {
      errorMessage.value = "Bitte wählen Sie sowohl Hin- als auch Rückflug.";
      return;
    }

    const departureDateStr = toDateString(dateRange.value.start);
    const returnDateStr = toDateString(dateRange.value.end);

    if (returnDateStr < departureDateStr) {
      errorMessage.value = "Der Rückflug muss nach dem Hinflug stattfinden.";
      return;
    }
  } else {
    if (!singleDate.value) {
      errorMessage.value = "Bitte wählen Sie ein Flugtag.";
      return;
    }
  }

  try {
    isSearchingFlights.value = true;
    errorMessage.value = "";

    const searchParams = {
      origin: departure.value,
      destination: arrival.value,
      tripType: tripType.value,
      passengers: {
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants
      }
    };

    if (tripType.value === TripType.ROUND_TRIP) {
      searchParams.departureDate = toDateString(dateRange.value.start);
      searchParams.returnDate = toDateString(dateRange.value.end);
    } else {
      searchParams.departureDate = toDateString(singleDate.value);
    }

    console.log('Search params:', searchParams);

    const response = await $fetch('/api/flights/search', {
      method: 'POST',
      body: searchParams
    });

    console.log('Search response:', response);

    if (response.success && response.data) {
      // Find the exact flights for the selected dates
      const departureFlight = response.data.flights.find(
        flight => flight.date === searchParams.departureDate &&
          flight.origin === searchParams.origin &&
          flight.destination === searchParams.destination
      );

      let returnFlight = null;
      if (tripType.value === TripType.ROUND_TRIP) {
        returnFlight = response.data.flights.find(
          flight => flight.date === searchParams.returnDate &&
            flight.origin === searchParams.destination &&
            flight.destination === searchParams.origin
        );
      }

      if (!departureFlight) {
        errorMessage.value = "Kein Flug für das ausgewählte Datum gefunden.";
        return;
      }

      if (tripType.value === TripType.ROUND_TRIP && !returnFlight) {
        errorMessage.value = "Kein Rückflug für das ausgewählte Datum gefunden.";
        return;
      }

      const queryParams = {
        id: departureFlight.id,
        adults: searchParams.passengers.adults,
        children: searchParams.passengers.children,
        infants: searchParams.passengers.infants,
        departureDate: searchParams.departureDate
      };

      if (tripType.value === TripType.ROUND_TRIP && returnFlight) {
        queryParams.returnId = returnFlight.id;
        queryParams.returnDate = searchParams.returnDate;
      }

      console.log('Navigating with params:', queryParams);

      navigateTo({
        path: '/flights',
        query: queryParams
      });
    } else if (response.error) {
      errorMessage.value = response.error.message;
    }
  } catch (error) {
    console.error('Error in handleBooking:', error);
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    isSearchingFlights.value = false;
  }
};

// Function to confirm date selection
const confirmDateSelection = () => {
  // Close the date picker
  showDatePicker.value = null;

  // Validate the selected dates
  if (tripType.value === TripType.ROUND_TRIP) {
    // Ensure both departure and return dates are selected
    if (!dateRange.value.start || !dateRange.value.end) {
      errorMessage.value = "Bitte wählen Sie sowohl Hin- als auch Rückflug.";
      return;
    }

    // Ensure return date is after departure date
    const departureDate = toDateString(dateRange.value.start);
    const returnDate = toDateString(dateRange.value.end);

    if (returnDate < departureDate) {
      errorMessage.value = "Der Rückflug muss nach dem Hinflug stattfinden.";
      return;
    }
  } else {
    // For one-way trips, ensure a date is selected
    if (!singleDate.value) {
      errorMessage.value = "Bitte wählen Sie ein Flugtag.";
      return;
    }
  }

  // Clear any existing error message
  errorMessage.value = "";
};

// Simplified date selection functions
const isDateDisabled = (date) => {
  const dateStr = toDateString(date);
  return !availableDates.value.some(d => d.date === dateStr);
};

const isReturnDateDisabled = (date) => {
  const dateStr = toDateString(date);
  return !availableReturnDates.value.some(d => d.date === dateStr);
};

// Initialize dates when component mounts
onMounted(() => {
  // Set initial dates if they exist in localStorage
  const savedDateRange = localStorage.getItem('dateRange');
  const savedSingleDate = localStorage.getItem('singleDate');

  if (savedDateRange) {
    const { start, end } = JSON.parse(savedDateRange);
    dateRange.value = {
      start: start ? toCalendarDate(start) : null,
      end: end ? toCalendarDate(end) : null
    };
  }

  if (savedSingleDate) {
    singleDate.value = toCalendarDate(savedSingleDate);
  }

  // Add click outside handlers
  document.addEventListener('click', (event) => {
    const passengersDropdown = document.querySelector('.passengers-dropdown');
    const passengersButton = document.querySelector('.passengers-button');

    if (passengersActive.value &&
      passengersDropdown &&
      !passengersDropdown.contains(event.target) &&
      !passengersButton?.contains(event.target)) {
      passengersActive.value = false;
    }

    const datePicker = document.querySelector('.calendar-wrapper');
    const datePickerButtons = document.querySelectorAll('.date-picker-button');

    if (showDatePicker.value &&
      datePicker &&
      !datePicker.contains(event.target) &&
      !Array.from(datePickerButtons).some(button => button.contains(event.target))) {
      showDatePicker.value = null;
    }
  });
});

// Save dates when they change
watch([dateRange, singleDate], ([newDateRange, newSingleDate]) => {
  if (newDateRange) {
    localStorage.setItem('dateRange', JSON.stringify({
      start: newDateRange.start ? toDateString(newDateRange.start) : null,
      end: newDateRange.end ? toDateString(newDateRange.end) : null
    }));
  }

  if (newSingleDate) {
    localStorage.setItem('singleDate', toDateString(newSingleDate));
  }
}, { deep: true });

onUnmounted(() => {
  document.removeEventListener('click', () => { });
});
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

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-fade-in-delayed {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
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

@keyframes plane-float {

  0%,
  100% {
    transform: translateY(0) scale(1) rotate(-8deg);
  }

  50% {
    transform: translateY(-24px) scale(1.03) rotate(-10deg);
  }
}

.animate-plane-float {
  animation: plane-float 7s ease-in-out infinite;
}
</style>
