import { defineEventHandler, getCookie, createError } from 'h3';

export default defineEventHandler((event) => {
    // Prüfe, ob es sich um einen Admin-Endpoint handelt
    if (event.path.startsWith('/api/admin')) {
        // Erlaube den Login-Endpoint
        if (event.path === '/api/admin/auth/login') {
            return;
        }
        
        const adminSession = getCookie(event, 'admin_session');
        
        if (!adminSession || adminSession !== 'authenticated') {
            throw createError({
                statusCode: 401,
                message: 'Nicht autorisiert'
            });
        }
    }
}); 