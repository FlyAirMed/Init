import nodemailer from 'nodemailer';
import { useRuntimeConfig } from '#imports';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: MailOptions) => {
  const config = useRuntimeConfig();
  
  // Validiere E-Mail-Empfänger
  if (!options.to) {
    throw new Error('E-Mail-Empfänger ist erforderlich');
  }

  // Validiere SMTP-Konfiguration
  if (!config.smtpHost || !config.smtpPort || !config.smtpUser || !config.smtpPassword) {
    throw new Error('SMTP-Konfiguration ist unvollständig');
  }

  // Erstelle einen Transporter mit der Konfiguration aus dem Runtime Config
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword
    },
  });

  try {
    // Sende E-Mail
    const info = await transporter.sendMail({
      from: `"Flugbuchung" <${config.smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('E-Mail gesendet:', info.messageId);
    return info;
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    throw error;
  }
}; 