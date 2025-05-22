// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}', // <-- This is crucial for pages/flights.vue
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
        './assets/**/*.css', // Include CSS files for any custom classes or Tailwind directives
        './nuxt.config.{js,ts}' // For dynamic class generation in config
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}