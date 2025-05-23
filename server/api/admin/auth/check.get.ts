import { defineEventHandler, getCookie } from 'h3';

export default defineEventHandler((event) => {
    const adminSession = getCookie(event, 'admin_session');
    
    return {
        success: adminSession === 'authenticated',
        message: adminSession === 'authenticated' ? 'Authentifiziert' : 'Nicht authentifiziert'
    };
}); 