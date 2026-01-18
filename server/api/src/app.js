import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config.js';
import prisma from './prisma.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import brandRoutes from './routes/brands.js';
import settingsRoutes from './routes/settings.js';
import returnRoutes from './routes/returnRoutes.js';
import seoRoutes from './routes/seo.js';
import feedRoutes from './routes/feeds.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();

// Trust proxy for Caddy/Cloudflare (fixes express-rate-limit X-Forwarded-For error)
app.set('trust proxy', 1);

/**
 * Middleware Configuration
 */
// CORS Settings
app.use(cors({
    origin: config.corsOrigin
}));

// Security Headers
app.use(helmet());

// Gzip Compression
app.use(compression());

// Body Parsers
// urlencoded required for form submissions and callbacks
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * API Routes (v1)
 */
// Health Check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// Rate Limiter
app.use('/api/v1', apiLimiter);

// Core Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/returns', returnRoutes);
app.use('/api/v1', seoRoutes);

// Google Merchant Center & Feed Routes
app.use('/api/v1/feeds', feedRoutes);

/**
 * Global Hata Yakalayıcı
 */
app.use(errorHandler);

/**
 * Sunucuyu Başlatma Fonksiyonu.
 * Veritabanı bağlantısını açar ve sunucuyu dinlemeye başlar.
 */
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Veritabanı Bağlantısı Başarılı 🚀');

        app.listen(config.port, '0.0.0.0', () => {
            console.log(`API Sunucusu Başlatıldı: Port ${config.port} 🌐`);
        });
    } catch (error) {
        console.error('Sunucu Başlatılamadı:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
