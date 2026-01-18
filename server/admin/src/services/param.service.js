import crypto from 'crypto';
import soap from 'soap';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Service for handling Param POS payment gateway integrations in Admin Panel.
 * Uses SOAP web services.
 */
export class ParamAdminService {
    constructor() {
        this.config = {
            clientCode: process.env.PARAM_CLIENT_CODE,
            clientUsername: process.env.PARAM_CLIENT_USERNAME,
            clientPassword: process.env.PARAM_CLIENT_PASSWORD,
            guid: process.env.PARAM_GUID,
            baseUrl: process.env.PARAM_BASE_URL || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
        };
        this.client = null;
    }

    /**
     * Initializes the SOAP client.
     */
    async _ensureClient() {
        if (!this.client) {
            // WSDL file is expected to be in the same directory or accessible
            // Since we don't want to duplicate the WSDL file, we might point to the API one OR
            // better, just use the remote URL if creating client from URL is reliable.
            // But usually local WSDL is safer. 
            // For now, let's try to use the one from api/src/services if possible, or assume it's copied.
            // To be safe and independent: We will point to the remote WSDL from config.baseUrl 
            // OR we rely on a local copy. 
            // Let's rely on the REMOTE WSDL specified in config.baseUrl which is usually reliable for SOAP clients.

            this.client = await soap.createClientAsync(this.config.baseUrl);
        }
    }

    _createSecurityObject() {
        return {
            CLIENT_CODE: this.config.clientCode,
            CLIENT_USERNAME: this.config.clientUsername,
            CLIENT_PASSWORD: this.config.clientPassword
        };
    }

    /**
     * Cancels or Refunds a payment.
     * @param {string} dekontId - Param dekont (receipt) ID (stored as odemeId in DB).
     * @param {string} type - 'IPTAL' (Cancel) or 'IADE' (Refund).
     * @param {number|string} amount - Amount to refund (required for IADE, optional/empty for IPTAL).
     * @returns {Promise<Object>} Result.
     */
    async _processTransaction(dekontId, type, amount = '') {
        await this._ensureClient();

        console.log(`[Param Admin] Processing ${type} for ID: ${dekontId}, Amount: ${amount}`);

        const request = {
            G: this._createSecurityObject(),
            GUID: this.config.guid,
            Durum: type,
            Dekont_ID: dekontId,
            Tutar: amount ? Number(amount).toFixed(2).replace('.', ',') : ''
        };

        return new Promise((resolve, reject) => {
            this.client.TP_Islem_Iptal_Iade(request, (err, result) => {
                if (err) {
                    console.error(`[Param Admin] ${type} Error:`, err);
                    return reject(err);
                }

                const response = result?.TP_Islem_Iptal_IadeResult;

                if (response?.Sonuc !== '1') {
                    // Check for common error: "İşlem daha önce iptal edilmiş" to handle gracefully?
                    return reject(new Error(response?.Sonuc_Str || `${type} işlemi başarısız`));
                }

                resolve({
                    status: 'success',
                    dekontId: dekontId,
                    message: `${type} işlemi başarılı.`
                });
            });
        });
    }

    /**
     * Cancels a payment (Void). Usually for same-day cancellations.
     * @param {string} paymentId - The 'odemeId' (Dekont ID).
     */
    async cancelPayment(paymentId) {
        return this._processTransaction(paymentId, 'IPTAL');
    }

    /**
     * Refunds a payment. Can be partial or full.
     * @param {string} paymentId - The 'odemeId' (Dekont ID).
     * @param {number} amount - Amount to refund.
     */
    async refundPayment(paymentId, amount) {
        if (!amount) throw new Error('İade tutarı gereklidir.');
        return this._processTransaction(paymentId, 'IADE', amount);
    }
}
