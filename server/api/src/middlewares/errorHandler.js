import { config } from '../config.js';

/**
 * Global Hata Yakalama Middleware'i.
 * Uygulama genelinde fırlatılan tüm hataları (next(err)) yakalar ve standart bir formatta döner.
 * 
 * @param {Error} err - Fırlatılan hata nesnesi.
 * @param {import('express').Request} req - Express istek nesnesi.
 * @param {import('express').Response} res - Express yanıt nesnesi.
 * @param {import('express').NextFunction} next - Express next fonksiyonu.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(`[Hata] ${err.message}`, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu Hatası (Internal Server Error)';

    res.status(statusCode).json({
        success: false,
        error: message,
        // Geliştirme ortamındaysak stack trace'i göster
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    });
};
