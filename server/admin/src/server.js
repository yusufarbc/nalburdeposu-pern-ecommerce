import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { getAdminOptions } from './config/options.js';
import { buildAdminRouter } from './config/auth.js';

dotenv.config({ path: '../../.env' });

/**
 * Main application entry point for the Admin Service.
 * Follows SOLID principles by delegating configuration to specialized modules.
 */
const start = async () => {
    console.log("Starting Admin Service...");

    const app = express();
    app.use(cors());
    app.set('trust proxy', 1); // Trust Caddy/Cloudflare for secure cookies

    // [DEBUG] Raw Request Logger
    app.use((req, res, next) => {
        if (req.method === 'POST' || req.method === 'PUT') {
            console.log('[RAW SERVER] Request to:', req.originalUrl);
            console.log('[RAW SERVER] Content-Type:', req.headers['content-type']);
            // Check if multipart
            if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
                console.log('[RAW SERVER] Multipart detected');
            } else {
                console.log('[RAW SERVER] NOT Multipart!');
            }
        }
        next();
    });

    // 1. Database & Adapter Registration
    const prisma = new PrismaClient();
    AdminJS.registerAdapter({ Database, Resource });

    // 2. AdminJS Configuration
    const adminOptions = getAdminOptions(prisma);
    const admin = new AdminJS(adminOptions);

    // 3. Router Construction (Auth + AdminJS)
    console.log('[DEBUG] Admin Options RootPath:', admin.options.rootPath);
    const adminRouter = buildAdminRouter(admin);
    // Use the rootPath defined in adminOptions which comes from process.env.ADMIN_PATH
    app.use(admin.options.rootPath, adminRouter);
    app.use(admin.options.rootPath, express.static('public')); // Serve static assets under the secret path

    // 4. Server Listen
    app.get('/', (req, res) => {
        res.redirect(admin.options.rootPath);
    });

    if (!process.env.ADMIN_PORT) {
        throw new Error('ADMIN_PORT environment variable is required');
    }
    const PORT = process.env.ADMIN_PORT;
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
};

start().catch(e => {
    console.error("AdminJS Startup Failed:", e);
    process.exit(1);
});
