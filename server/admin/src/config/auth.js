import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';

/**
 * Builds the AdminJS router with Authentication.
 * Uses environment variables for single-user authentication.
 */
export const buildAdminRouter = (admin) => {
    // Environment variables verification
    if (!process.env.ADMIN_PATH || !process.env.ADMIN_LOGIN_PATH) {
        throw new Error('ADMIN_PATH and ADMIN_LOGIN_PATH must be set');
    }
    if (!process.env.COOKIE_PASSWORD || !process.env.SESSION_SECRET) {
        throw new Error('COOKIE_PASSWORD and SESSION_SECRET must be set for security');
    }

    const rootPath = process.env.ADMIN_PATH;
    const loginPath = process.env.ADMIN_LOGIN_PATH;
    const logoutPath = `${rootPath}/logout`;

    return AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, password) => {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (email === adminEmail && password === adminPassword) {
                return {
                    email: adminEmail,
                    role: 'admin',
                };
            }
            return null;
        },
        cookieName: process.env.COOKIE_NAME || 'adminjs',
        cookiePassword: process.env.COOKIE_PASSWORD,
        loginPath,
        logoutPath,
    }, null, {
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
    });
};
