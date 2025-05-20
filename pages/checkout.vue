<template>
  <div class="checkout-page">
    <h1>Checkout</h1>
    
    <div class="booking-summary">
      <h2>Booking Summary</h2>
      <div class="summary-details">
        <p><strong>Flight:</strong> {{ bookingDetails.flightNumber }}</p>
        <p><strong>From:</strong> {{ bookingDetails.from }}</p>
        <p><strong>To:</strong> {{ bookingDetails.to }}</p>
        <p><strong>Date:</strong> {{ bookingDetails.date }}</p>
        <p><strong>Price:</strong> {{ formatAmount(amount) }} {{ currency.toUpperCase() }}</p>
      </div>
    </div>

    <PaymentForm
      :amount="amount"
      :currency="currency"
      :booking-details="bookingDetails"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
</template>

<script setup lang="ts">
const amount = 5000; // 50.00 EUR
const currency = 'eur';

const bookingDetails = {
  flightNumber: 'FL123',
  from: 'Berlin',
  to: 'Paris',
  date: '2024-06-01',
};

const formatAmount = (amount: number) => {
  return (amount / 100).toFixed(2);
};

const handlePaymentSuccess = () => {
  // Handle successful payment
  console.log('Payment successful!');
};

const handlePaymentError = (error: Error) => {
  // Handle payment error
  console.error('Payment failed:', error);
};
</script>

<style scoped>
.checkout-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.booking-summary {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.summary-details {
  margin-top: 10px;
}

.summary-details p {
  margin: 5px 0;
}
</style> 