import nodemailer from 'nodemailer';
import { config } from '../config.js';

/**
 * Service for handling email notifications via Brevo SMTP.
 * Sends order confirmations, cancellation notices, and other transactional emails.
 * 
 * CORPORATE COLOR PALETTE:
 * - Brand Yellow: #deff36
 * - Corporate Black: #191919 (Header/Footer)
 * - Action Red: #dc2a12 (Buttons)
 * - Background White: #FFFFFF
 * - Soft Gray: #F4F4F4 (Info boxes)
 * - Text Gray: #666666 (Secondary text)
 */
export class EmailService {
    /**
     * Creates an instance of EmailService with SMTP configuration.
     * @param {Object} smtpConfig - SMTP configuration object.
     * @param {string} smtpConfig.host - SMTP host (e.g., smtp-relay.brevo.com).
     * @param {number} smtpConfig.port - SMTP port (usually 587).
     * @param {string} smtpConfig.user - SMTP username.
     * @param {string} smtpConfig.pass - SMTP password/API key.
     */
    constructor(smtpConfig) {
        this.transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: false,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass,
            },
        });

        // Sender: siparis@nalburdeposu.com.tr
        this.senderEmail = '"Nalbur Deposu" <siparis@nalburdeposu.com.tr>';
        // Reply-To: bilgi@nalburdeposu.com.tr
        this.replyToEmail = 'bilgi@nalburdeposu.com.tr';
    }

    /**
     * Creates a common email template with header, content, and footer.
     * @param {string} title - Email header title.
     * @param {string} content - HTML content for the email body.
     * @param {string} [headerColor='#191919'] - Header background color.
     * @returns {string} Complete HTML email template.
     * @private
     */
    _createEmailTemplate(title, content, headerColor = '#191919') {
        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #F4F4F4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F4F4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${headerColor}; padding: 25px 30px; text-align: center;">
                            <img src="${config.clientUrl}/images/logo-yellow.svg" alt="Nalbur Deposu" style="display: block; margin: 0 auto 15px auto; height: 40px; border: 0;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600;">${title}</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #191919; line-height: 1.6;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #191919; padding: 20px 30px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #deff36; font-size: 14px; font-weight: 600;">NALBUR DEPOSU</p>
                            <p style="margin: 0; color: #666666; font-size: 12px;">
                                Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.<br>
                                Sorularınız için: <a href="mailto:bilgi@nalburdeposu.com.tr" style="color: #deff36;">bilgi@nalburdeposu.com.tr</a>
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                                © ${new Date().getFullYear()} Nalbur Deposu. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    }

    /**
     * Sends order confirmation email to customer.
     * @param {string} toEmail - Recipient email address.
     * @param {string} toName - Recipient name.
     * @param {Object} orderDetails - Order summary object.
     * @param {string} orderDetails.id - Order ID.
     * @param {string} orderDetails.orderNumber - Order number for display.
     * @param {string} orderDetails.trackingToken - Token for order tracking link.
     * @param {number} orderDetails.total - Total amount.
     * @returns {Promise<void>}
     */
    async sendOrderConfirmation(toEmail, toName, orderDetails) {
        console.log(`[Email] Sipariş Onayı gönderiliyor: ${toEmail} - Sipariş: ${orderDetails.id}`);

        const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p>Siparişiniz başarıyla alındı ve hazırlanıyor. Teşekkür ederiz!</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${orderDetails.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Toplam Tutar:</strong> <span style="font-size: 18px; color: #191919; font-weight: bold;">₺${Number(orderDetails.total).toFixed(2)}</span></p>
            </div>

            <p>Siparişinizin detaylarını, kargo takibini ve faturanızı görüntülemek için aşağıdaki butona tıklayın:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${orderLink}" style="background-color: #dc2a12; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Siparişimi Görüntüle</a>
            </div>

            <p style="color: #666666; font-size: 13px;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `Siparişiniz Onaylandı ✅ - #${orderDetails.orderNumber}`,
            html: this._createEmailTemplate('Siparişiniz Onaylandı!', content),
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('[Email] Sipariş onayı gönderildi. MessageId: %s', info.messageId);
        } catch (error) {
            console.error('[Email] Sipariş onayı gönderilemedi:', error);
        }
    }

    /**
     * Müşteriye sipariş iptal bilgilendirmesi gönderir.
     * @param {string} toEmail - Alıcı e-posta adresi.
     * @param {string} toName - Alıcı adı.
     * @param {Object} details - İptal detayları (orderNumber, refundStatus, cancelReason).
     */
    async sendCancellationNotification(toEmail, toName, details) {
        const isRefunded = details.refundStatus === 'SUCCESS';
        const refundMessage = isRefunded
            ? 'Ödeme iadeniz bankanıza iletilmiştir. Banka prosedürlerine göre 3-7 iş günü içinde hesabınıza yansıyacaktır.'
            : 'Ödeme iadesi hakkında detaylı bilgi için lütfen bizimle iletişime geçiniz.';

        const reasonHtml = details.cancelReason
            ? `<div style="background-color: #F4F4F4; padding: 15px; border-left: 4px solid #dc2a12; margin: 20px 0; color: #191919;">
                 <strong style="display:block; margin-bottom:5px; color: #dc2a12;">İptal Nedeni:</strong>
                 ${details.cancelReason}
               </div>`
            : '';

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz iptal edilmiştir.</p>
            
            ${reasonHtml}
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <h3 style="margin: 0 0 10px 0; color: #191919; font-size: 16px;">İade Durumu</h3>
                <p style="margin: 0; color: #666666;">${refundMessage}</p>
            </div>

            <p style="color: #666666;">Yaşanan aksaklık için özür diler, anlayışınız için teşekkür ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.clientUrl}" style="background-color: #191919; color: #deff36; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ana Sayfaya Dön</a>
                <br><br>
                <a href="${config.clientUrl}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sipariş Detayı</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `Sipariş İptali - #${details.orderNumber}`,
            html: this._createEmailTemplate('Sipariş İptal Bilgilendirmesi', content, '#dc2a12'),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[Email] İptal bildirimi gönderildi: ${toEmail}`);
        } catch (error) {
            console.error('[Email] İptal bildirimi gönderilemedi:', error);
        }
    }
}
