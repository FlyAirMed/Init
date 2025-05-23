import { defineEventHandler, readBody, setCookie } from 'h3';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const { username, password } = await readBody(event);

        // Hier sollten Sie die Anmeldedaten gegen Ihre Datenbank oder eine sichere Konfiguration prüfen
        // Dies ist nur ein Beispiel - in der Produktion sollten Sie sichere Passwort-Hashing verwenden
        const config = useRuntimeConfig();
        if (username === config.adminEmail && password === config.adminPassword) {
            // Setze einen sicheren Session-Cookie
            setCookie(event, 'admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 24 Stunden
            });

            return {
                success: true,
                message: 'Erfolgreich angemeldet'
            };
        }

        throw createError({
            statusCode: 401,
            message: 'Ungültige Anmeldedaten'
        });
    } catch (error) {
        console.error('Login error:', error);
        throw createError({
            statusCode: 401,
            message: error.message || 'Ein Fehler ist aufgetreten'
        });
    }
}); 