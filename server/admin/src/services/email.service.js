import nodemailer from 'nodemailer';

/**
 * Admin paneli için e-posta servisi.
 * Sipariş durumu değişikliklerinde müşterilere bildirim gönderir.
 * 
 * KURUMSAL RENK PALETİ:
 * - Ana Marka: #deff36 (Sarı-Yeşil)
 * - Kurumsal Siyah: #191919 (Header/Footer)
 * - Aksiyon Kırmızısı: #dc2a12 (Butonlar)
 * - Zemin Beyazı: #FFFFFF
 * - Yumuşak Gri: #F4F4F4 (Kutucuklar)
 * - Metin Grisi: #666666 (İkincil metinler)
 */
export class EmailAdminService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Gönderici: siparis@nalburdeposu.com.tr
        this.senderEmail = '"Nalbur Deposu" <siparis@nalburdeposu.com.tr>';
        // Yanıtla: bilgi@nalburdeposu.com.tr
        this.replyToEmail = 'bilgi@nalburdeposu.com.tr';
    }

    /**
     * Ortak e-posta şablonu oluşturur
     * @param {string} title - Başlık
     * @param {string} content - İçerik HTML
     * @param {string} headerColor - Başlık arka plan rengi (varsayılan: #191919)
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
                            <img src="${process.env.CLIENT_URL}/images/logo-yellow.svg" alt="Nalbur Deposu" style="display: block; margin: 0 auto 15px auto; height: 40px; border: 0;">
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
     * Kargo bildirimi gönderir.
     */
    async sendShippingNotification(toEmail, toName, details) {
        if (!toEmail) return;

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz hazırlanmış ve kargo firmasına teslim edilmiştir.</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <p style="margin: 5px 0;"><strong>Kargo Firması:</strong> ${details.kargoFirmasi}</p>
                <p style="margin: 5px 0;"><strong>Takip Numarası:</strong> <span style="font-family: monospace; font-size: 16px; color: #191919; font-weight: bold;">${details.kargoTakipNo}</span></p>
            </div>

            <p>Ürünlerinizin en kısa sürede size ulaşmasını dileriz.</p>
            <p style="color: #666666;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `Siparişiniz Kargoya Verildi! 🚚 - #${details.orderNumber}`,
            html: this._createEmailTemplate('Kargonuz Yola Çıktı! 🚚', content)
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] Kargo bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] Kargo bildirimi hatası:', error);
            throw error;
        }
    }

    /**
     * İptal bildirimi gönderir.
     */
    async sendCancellationNotification(toEmail, toName, details) {
        if (!toEmail) return;

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
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `Sipariş İptali - #${details.orderNumber}`,
            html: this._createEmailTemplate('Sipariş İptal Bilgilendirmesi', content, '#dc2a12')
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] İptal bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] İptal bildirimi hatası:', error);
            return false;
        }
    }

    /**
     * İade onay bildirimi gönderir.
     */
    async sendReturnApproved(toEmail, toName, details) {
        if (!toEmail) return;

        const adminNoteHtml = details.adminNote
            ? `<div style="background-color: #F4F4F4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #deff36;">
                 <strong style="color: #191919;">Satıcı Notu:</strong>
                 <p style="margin: 5px 0 0 0; color: #666666;">${details.adminNote}</p>
               </div>`
            : '';

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz için oluşturduğunuz iade talebi onaylanmıştır.</p>
            
            <div style="background-color: #F4F4F4; padding: 25px; border-radius: 6px; margin: 25px 0; text-align: center; border: 2px solid #deff36;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Kargo İade Kodunuz:</p>
                <h2 style="margin: 10px 0; font-size: 32px; letter-spacing: 3px; color: #191919; font-weight: bold;">${details.returnCode}</h2>
                <p style="margin: 0; color: #191919;"><strong>Kargo Firması:</strong> ${details.shippingCompany}</p>
            </div>

            ${adminNoteHtml}

            <p>Lütfen ürünü paketlerken hasar görmeyecek şekilde ambalajlamaya özen gösteriniz.</p>
            <p style="color: #666666;">Kargo şubesine giderek yukarıdaki kodu belirtmeniz yeterlidir. Ürün tarafımıza ulaştıktan sonra iade süreci tamamlanacaktır.</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `İade Talebiniz Onaylandı ✅ - #${details.orderNumber}`,
            html: this._createEmailTemplate('İade Talebiniz Onaylandı', content, '#191919')
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] İade onay bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] İade onay bildirimi hatası:', error);
            return false;
        }
    }

    /**
     * Teslimat bildirimi gönderir.
     */
    async sendDeliveryNotification(toEmail, toName, details) {
        if (!toEmail) return;

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişinizin teslim edildiği bildirilmiştir. Ürünlerinizi güle güle kullanmanızı dileriz.</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <p style="margin: 0; color: #191919;">Teslimatla ilgili bir sorun yaşadıysanız veya ürünlerinizde bir kusur varsa, teslim tarihinden itibaren <strong>14 gün</strong> içerisinde iade talebi oluşturabilirsiniz.</p>
            </div>

            <p style="color: #666666;">Sipariş detaylarını görüntülemek ve gerektiğinde iade talebi oluşturmak için aşağıdaki butonu kullanabilirsiniz:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `Siparişiniz Teslim Edildi! ✅ - #${details.orderNumber}`,
            html: this._createEmailTemplate('Siparişiniz Teslim Edildi! ✅', content, '#191919')
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] Teslimat bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] Teslimat bildirimi hatası:', error);
            return false;
        }
    }


    /**
     * İade tamamlandı (ücret iadesi) bildirimi gönderir.
     */
    async sendReturnCompleted(toEmail, toName, details) {
        if (!toEmail) return;

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz için başlattığınız iade süreci tamamlanmıştır.</p>
            
            <div style="background-color: #F4F4F4; padding: 25px; border-radius: 6px; margin: 25px 0; border: 2px solid #deff36;">
                <h3 style="margin: 0 0 10px 0; color: #191919; font-size: 18px;">İade İşlemi Onaylandı</h3>
                <p style="margin: 0; color: #191919;">Gönderdiğiniz ürünler tarafımıza ulaşmış ve gerekli kontroller yapılmıştır.</p>
                <p style="margin: 15px 0 0 0; color: #191919;"><strong>Ödeme iadeniz bankanıza iletilmiştir.</strong> Banka prosedürlerine göre 3-7 iş günü içinde hesabınıza yansıyacaktır.</p>
            </div>

            <p style="color: #666666;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `İade İşleminiz Tamamlandı ✅ - #${details.orderNumber}`,
            html: this._createEmailTemplate('İade İşleminiz Tamamlandı', content, '#191919')
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] İade tamamlandı bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] İade tamamlandı bildirimi hatası:', error);
            return false;
        }
    }

    /**
     * İade reddedildi bildirimi gönderir.
     */
    async sendReturnRejected(toEmail, toName, details) {
        if (!toEmail) return;

        const reasonHtml = details.rejectionReason
            ? `<div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #dc2a12;">
                 <strong style="color: #dc2a12; display: block; margin-bottom: 5px;">Red Nedeni:</strong>
                 <p style="margin: 0; color: #191919;">${details.rejectionReason}</p>
               </div>`
            : '';

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz için oluşturduğunuz iade talebi incelenmiş ve ne yazık ki onaylanmamıştır.</p>
            
            ${reasonHtml}

            <p>Müşteri hizmetlerimizle iletişime geçerek detaylı bilgi alabilirsiniz.</p>
            <p style="color: #666666;">Anlayışınız için teşekkür ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
            </div>
        `;

        const mailOptions = {
            from: this.senderEmail,
            replyTo: this.replyToEmail,
            to: toEmail,
            subject: `İade Talebiniz Hakkında Bilgilendirme ❌ - #${details.orderNumber}`,
            html: this._createEmailTemplate('İade Talebiniz Reddedildi', content, '#191919') // Standart Siyah başlık
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] İade red bildirimi gönderildi: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[Email] İade red bildirimi hatası:', error);
            return false;
        }
    }
}
