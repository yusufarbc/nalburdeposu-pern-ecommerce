import { z } from 'zod';

/**
 * İstek Validasyon Middleware'i (Zod ile).
 * Gelen isteğin body kısmını verilen şemaya göre doğrular.
 * 
 * @param {import('zod').ZodSchema} schema - Doğrulama şeması.
 * @returns {Function} Express middleware fonksiyonu.
 */
export const validateRequest = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Doğrulama Hatası:', JSON.stringify(error.errors, null, 2));
            return res.status(400).json({
                status: 'failure',
                errorMessage: 'Doğrulama Hatası (Validation Error)',
                errors: error.errors
            });
        }
        next(error);
    }
};
