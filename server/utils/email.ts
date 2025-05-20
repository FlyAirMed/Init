import nodemailer from 'nodemailer';

interface OrderConfirmationEmail {
  email: string;
  orderId: string;
  amount: number;
  currency: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOrderConfirmation({
  email,
  orderId,
  amount,
  currency,
}: OrderConfirmationEmail) {
  const formattedAmount = (amount / 100).toFixed(2);
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: [email, process.env.ADMIN_EMAIL],
    subject: 'Order Confirmation',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order has been successfully processed.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount:</strong> ${formattedAmount} ${currency.toUpperCase()}</p>
      <p>We will process your booking shortly.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 