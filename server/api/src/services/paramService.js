import crypto from 'crypto';
import soap from 'soap';

/**
 * Service for handling Param POS payment gateway integrations.
 * Uses SOAP web services with 3D Secure support.
 * 
 * @see https://dev.param.com.tr/tr/api
 */
export class ParamService {
    /**
     * Creates an instance of ParamService with API credentials.
     * @param {Object} config - Configuration object.
     * @param {string} config.clientCode - Param client code.
     * @param {string} config.clientUsername - Param client username.
     * @param {string} config.clientPassword - Param client password.
     * @param {string} config.guid - Param GUID.
     * @param {string} config.baseUrl - WSDL URL (test or production).
     * @param {string} config.callbackUrl - Base URL for success/error callbacks.
     */
    constructor(config) {
        this.config = config;
        this.client = null;
    }

    /**
     * Initializes the SOAP client.
     * @returns {Promise<void>}
     * @private
     */
    async _ensureClient() {
        if (!this.client) {
            const wsdlPath = new URL('./param.wsdl', import.meta.url).pathname;

            this.client = await soap.createClientAsync(wsdlPath, {
                endpoint: this.config.baseUrl // Override the endpoint in WSDL with the config URL (Test/Prod)
            });
        }
    }

    /**
     * Creates security authentication object for Param API.
     * Note: GUID is NOT part of ST_WS_Guvenlik per WSDL spec - it's a separate parameter.
     * @returns {Object} ST_WS_Guvenlik object.
     * @private
     */
    _createSecurityObject() {
        return {
            CLIENT_CODE: this.config.clientCode,
            CLIENT_USERNAME: this.config.clientUsername,
            CLIENT_PASSWORD: this.config.clientPassword
        };
    }

    /**
     * Calculates SHA256 hash in Base64 format for transaction security.
     * Format: CLIENT_CODE + GUID + Taksit + Islem_Tutar + Toplam_Tutar + Siparis_ID
     * @param {string} taksit - Installment count (empty string for single payment).
     * @param {string} islemTutar - Transaction amount.
     * @param {string} toplamTutar - Total amount.
     * @param {string} siparisId - Order ID.
     * @returns {string} Base64 encoded SHA256 hash.
     * @private
     */
    _calculateHash(taksit, islemTutar, toplamTutar, siparisId) {
        const hashData = `${this.config.clientCode}${this.config.guid}${taksit}${islemTutar}${toplamTutar}${siparisId}`;

        console.log('[Param] Hash Components:', {
            clientCode: this.config.clientCode,
            guid: this.config.guid,
            guidLength: this.config.guid?.length,
            taksit,
            islemTutar,
            toplamTutar,
            siparisId,
            fullHashInput: hashData
        });

        return crypto.createHash('sha256').update(hashData, 'utf8').digest('base64');
    }

    /**
     * Validates GUID format (should be 36 characters: 8-4-4-4-12 with dashes).
     * @param {string} guid - GUID to validate.
     * @returns {boolean} True if valid.
     * @private
     */
    _validateGuid(guid) {
        if (!guid || guid.length !== 36) {
            console.error(`[Param] Invalid GUID length: ${guid?.length || 0}, expected 36`);
            return false;
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(guid)) {
            console.error(`[Param] Invalid GUID format: ${guid}`);
            return false;
        }
        return true;
    }

    /**
     * Formats amount to Param's expected format (comma as decimal separator).
     * @param {number|string} amount - Amount to format.
     * @returns {string} Formatted amount (e.g., "150,00").
     * @private
     */
    _formatAmount(amount) {
        return Number(amount).toFixed(2).replace('.', ',');
    }

    /**
     * Initiates a 3D Secure payment process.
     * Calls TP_WMD_UCD method and returns HTML form for 3D redirect.
     * @param {Object} order - Order details from database.
     * @param {Array<Object>} basketItems - Array of cart items.
     * @param {Object} buyer - Buyer information.
     * @returns {Promise<Object>} Object containing UCD_HTML for 3D redirect.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        await this._ensureClient();

        // Validate GUID before proceeding
        if (!this._validateGuid(this.config.guid)) {
            throw new Error('Param GUID yapılandırması geçersiz. Lütfen sistem yöneticisiyle iletişime geçin.');
        }

        const islemTutar = this._formatAmount(order.toplamTutar);
        const toplamTutar = this._formatAmount(order.toplamTutar);
        const taksit = 1; // Single payment as integer (WSDL expects s:integer)

        // Calculate security hash
        const errorUrl = `${this.config.callbackUrl}/api/v1/payment/param/error`;
        const successUrl = `${this.config.callbackUrl}/api/v1/payment/param/success`;

        // Calculate security hash
        // Formula: ClientCode + GUID + Taksit + IslemTutar + ToplamTutar + SiparisId
        const orderId = order.siparisNumarasi;

        // Build hash data string - Taksit must be included as actual value (not empty)
        const hashDataString = `${this.config.clientCode}${this.config.guid}${taksit}${islemTutar}${toplamTutar}${orderId}`;
        // IMPORTANT: Param uses SHA1, not SHA256 (despite docs saying "SHA2B64")
        // Evidence: Example hash in docs is 28 chars (SHA1) not 44 chars (SHA256)
        const hash = crypto.createHash('sha1').update(hashDataString, 'utf8').digest('base64');

        console.log(`[Param] Hash Input String: ${hashDataString}`);
        console.log(`[Param] Calculated Hash: ${hash}`);



        const request = {
            G: this._createSecurityObject(),
            GUID: this.config.guid,
            KK_Sahibi: buyer.name + ' ' + buyer.surname,
            KK_No: buyer.cardNumber,
            KK_SK_Ay: buyer.cardExpMonth.padStart(2, '0'),
            KK_SK_Yil: buyer.cardExpYear.length === 2 ? `20${buyer.cardExpYear}` : buyer.cardExpYear, // Convert YY to YYYY
            KK_CVC: buyer.cardCvc,
            KK_Sahibi_GSM: buyer.phone?.replace(/\D/g, '') || '',
            Hata_URL: errorUrl,
            Basarili_URL: successUrl,
            Siparis_ID: orderId,
            Siparis_Aciklama: `Nalbur Deposu Sipariş #${orderId}`,
            Taksit: taksit, // Integer type as per WSDL
            Islem_Tutar: islemTutar,
            Toplam_Tutar: toplamTutar,
            Islem_Hash: hash,
            Islem_Guvenlik_Tip: '3D',
            Islem_ID: orderId,
            IPAdr: buyer.ip || '127.0.0.1',
            Ref_URL: this.config.callbackUrl,
            Data1: '',
            Data2: '',
            Data3: '',
            Data4: '',
            Data5: ''
        };

        console.log('[Param] Starting 3D payment for order:', order.id);

        return new Promise((resolve, reject) => {
            this.client.TP_WMD_UCD(request, (err, result) => {
                if (err) {
                    console.error('[Param] SOAP Error:', err);
                    return reject(err);
                }

                const response = result?.TP_WMD_UCDResult;

                if (!response) {
                    return reject(new Error('Param API did not return a valid response'));
                }

                // Check for API-level errors
                if (response.Sonuc && response.Sonuc !== '1') {
                    console.error('[Param] API Error:', response.Sonuc_Str);
                    return reject(new Error(response.Sonuc_Str || 'Ödeme başlatılamadı'));
                }

                // Return the HTML form for 3D redirect
                resolve({
                    status: 'success',
                    ucdHtml: response.UCD_HTML,
                    dekontId: response.Dekont_ID,
                    siparisId: order.id
                });
            });
        });
    }

    /**
     * Verifies payment callback from Param.
     * Called after 3D Secure redirect returns to our callback URL.
     * @param {Object} callbackData - POST data from Param callback.
     * @returns {Object} Verification result with status and payment details.
     */
    verifyCallback(callbackData) {
        console.log('[Param] Verifying callback:', callbackData);

        // mdStatus values:
        // 1 = 3D authentication successful
        // 0, 2, 3, 4, 5, 6, 7, 8, 9 = various failure states
        const mdStatus = callbackData.mdStatus || callbackData.md_status;
        const isSuccess = mdStatus === '1';

        // Param callback sends 'orderId' (our siparisNumarasi), not 'siparis_id'
        const siparisNumarasi = callbackData.orderId || callbackData.siparis_id || callbackData.Siparis_ID;

        if (!isSuccess) {
            return {
                status: 'failure',
                errorCode: mdStatus,
                errorMessage: callbackData.md_errormessage || 'Ödeme doğrulaması başarısız',
                siparisNumarasi: siparisNumarasi
            };
        }

        return {
            status: 'success',
            paymentId: callbackData.islemGUID || callbackData.dekont_id || callbackData.Dekont_ID,
            siparisNumarasi: siparisNumarasi,
            amount: callbackData.transactionAmount || callbackData.islem_tutar || callbackData.Islem_Tutar,
            rawResult: callbackData
        };
    }

    /**
     * Cancels/refunds a payment.
     * Calls TP_Islem_Iptal_Iade method.
     * @param {string} dekontId - Param dekont (receipt) ID.
     * @param {string} reason - Cancellation reason.
     * @returns {Promise<Object>} Cancellation result.
     */
    async cancelPayment(dekontId, reason) {
        await this._ensureClient();

        console.log(`[Param] Cancelling payment ${dekontId}, Reason: ${reason}`);

        const request = {
            G: this._createSecurityObject(),
            GUID: this.config.guid,
            Durum: 'IPTAL', // IPTAL for cancel, IADE for refund
            Dekont_ID: dekontId,
            Tutar: '' // Empty for full cancellation
        };

        return new Promise((resolve, reject) => {
            this.client.TP_Islem_Iptal_Iade(request, (err, result) => {
                if (err) {
                    console.error('[Param] Cancel Error:', err);
                    return reject(err);
                }

                const response = result?.TP_Islem_Iptal_IadeResult;

                if (response?.Sonuc !== '1') {
                    return reject(new Error(response?.Sonuc_Str || 'İptal işlemi başarısız'));
                }

                resolve({
                    status: 'success',
                    dekontId: dekontId,
                    message: 'Ödeme iptal edildi'
                });
            });
        });
    }

    /**
     * Gets installment options for a card BIN (first 6 digits).
     * Calls TP_Ozel_Oran_SK_Liste method.
     * @param {string} bin - First 6 digits of card number.
     * @param {number} amount - Transaction amount.
     * @returns {Promise<Array>} Available installment options.
     */
    async getInstallmentOptions(bin, amount) {
        await this._ensureClient();

        const request = {
            G: this._createSecurityObject(),
            Bin: bin,
            Tutar: this._formatAmount(amount)
        };

        return new Promise((resolve, reject) => {
            this.client.TP_Ozel_Oran_SK_Liste(request, (err, result) => {
                if (err) {
                    return reject(err);
                }

                const response = result?.TP_Ozel_Oran_SK_ListeResult;

                if (response?.Sonuc !== '1') {
                    return resolve([]); // Return empty array if no installments available
                }

                resolve(response.DT_Bilgi || []);
            });
        });
    }
}
