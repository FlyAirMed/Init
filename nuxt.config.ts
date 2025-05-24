// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon'],

  css: ['~/assets/css/main.css'],
  ssr: false,
  future: {
    compatibilityVersion: 4
  },

  colorMode: {
    preference: 'light', // oder 'light' / 'dark'
    fallback: 'light', 
    classSuffix: 'light'       // Setzt nur "dark" als Klasse, kein "-light"
  },

  compatibilityDate: '2024-11-27',

  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    adminEmail: process.env.ADMIN_EMAIL,
    emailFrom: process.env.EMAIL_FROM,
    adminPassword: process.env.ADMIN_PASSWORD,
    public: {
      stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    routeRules: {
      '/api/**': {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://js.stripe.com; img-src 'self' data: https://*.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;"
        }
      }
    },
    // Set host and port for Nitro server
  },

  // To set port and host, use NUXT_PORT and NUXT_HOST environment variables or pass via CLI.
})