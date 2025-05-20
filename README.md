# Flight Booking System with Stripe Payments

This is a Nuxt 3 application that implements a flight booking system with Stripe payments, email notifications, and booking management.

## Features

- ✅ Stripe payment integration
- 📧 Email notifications for order confirmations
- ✈️ Flight booking management
- 🎨 Modern and responsive UI
- 🔒 Secure payment processing
- 📱 Mobile-friendly design

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Stripe account
- SMTP server for email notifications

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
ADMIN_EMAIL=admin@example.com

# Application Configuration
APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

## Stripe Webhook Setup

1. Install the Stripe CLI
2. Run the following command to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

## Usage

1. Navigate to the checkout page
2. Enter your email address
3. Enter your payment details
4. Submit the payment
5. Receive confirmation email
6. Booking will be processed automatically

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests

## Security

- All sensitive data is stored in environment variables
- Stripe handles all payment processing
- SMTP credentials are secured
- Webhook signatures are verified

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
