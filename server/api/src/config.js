import dotenv from 'dotenv';
dotenv.config();

/**
 * Application Configuration File.
 * Centralizes all environment variables and constants.
 */
export const config = {
  // Server Port
  port: process.env.PORT || 8080,

  // CORS Origins (Frontend URL should be added here)
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Environment (development / production)
  nodeEnv: process.env.NODE_ENV || 'development',

  // Param POS Payment Gateway Settings
  param: {
    clientCode: process.env.PARAM_CLIENT_CODE,
    clientUsername: process.env.PARAM_CLIENT_USERNAME,
    clientPassword: process.env.PARAM_CLIENT_PASSWORD,
    guid: process.env.PARAM_GUID,
    baseUrl: process.env.PARAM_BASE_URL || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
    callbackUrl: process.env.API_URL || 'https://api.nalburdeposu.com.tr'
  },

  // Email Service Settings (SMTP / Brevo)
  brevo: {
    apiKey: process.env.BREVO_API_KEY, // For backward compatibility
    smtp: {
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      sender: process.env.SMTP_SENDER || 'Nalbur Deposu <siparis@nalburdeposu.com.tr>',
      replyTo: process.env.SMTP_REPLY_TO || 'bilgi@nalburdeposu.com.tr',
    }
  },

  // Frontend URL (Store Link)
  clientUrl: process.env.CLIENT_URL || 'https://nalburdeposu.com.tr',

  // CDN URL (For Images)
  cdnUrl: process.env.CDN_URL || 'https://cdn.nalburdeposu.com.tr',

  // Google Shopping Feed Token
  googleMerchantToken: process.env.GOOGLE_MERCHANT_TOKEN
};

