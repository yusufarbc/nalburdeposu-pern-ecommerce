# Meta Entegrasyonu

Nalbur Deposu, dijital pazarlama için Meta ve Google Workspace ekosistemlerini kullanmaktadır.

## Meta Business Suite

### Facebook & Instagram

- **Business Manager**: Tek panel üzerinden Facebook ve Instagram yönetimi
- **Facebook Page**: Ürün tanıtımları ve müşteri etkileşimi
- **Instagram Business**: Görsel ürün showcase'i

### Gelecek Entegrasyonlar (Planlanıyor)

- [ ] Facebook Pixel - Dönüşüm takibi
- [ ] Instagram Shopping - Uygulama içi alışveriş
- [ ] Meta Conversions API - Server-side event tracking

## WhatsApp Business

**Ana İletişim Kanalı** - Müşteri desteği için WhatsApp Business kullanılmaktadır.

- **Telefon Numarası**: +90 542 182 68 55
- **Kullanım Alanları**: 
  - Müşteri desteği ve satış öncesi sorular
  - Sipariş takibi
  - Hızlı iletişim

### Entegrasyon Noktaları

1. **Header** (`Header.jsx`)
   - Telefon numarası: `tel:+905421826855`
   - Görünürlük: Desktop üst bar

2. **Footer** (`Footer.jsx`)
   - WhatsApp doğrudan mesaj butonu
   - URL format: `https://wa.me/905421826855?text=Merhaba...`
   - Social media icon grubu içinde

3. **Gelecek Entegrasyonlar (Planlanıyor)**
   - [ ] Ürün detay sayfalarında "WhatsApp'tan Sor" butonu
   - [ ] Sipariş takip sayfasında WhatsApp destek bağlantısı
   - [ ] WhatsApp Business API ile otomatik mesajlaşma

## Google Workspace

**E-posta Yönetimi**: bilgi@nalburdeposu.com.tr Google Workspace hesabı kullanılmaktadır.

### Kullanılan Servisler

| Servis | Kullanım | Durum |
|--------|----------|-------|
| **Gmail** | bilgi@nalburdeposu.com.tr (Ana iletişim hesabı) | ✅ Aktif |
| **Google Search Console** | SEO izleme, sitemap yönetimi | ✅ Aktif |
| **Google Merchant Center** | Google Shopping feed entegrasyonu | ✅ Aktif |
| **Google Analytics** | Web trafiği ve dönüşüm analizi | 🔄 Planlanıyor |
| **Google Tag Manager** | Event tracking | 🔄 Planlanıyor |

### Google Shopping Entegrasyonu

- **Feed URL**: `https://api.nalburdeposu.com.tr/api/v1/feeds/google-shopping.xml`
- **Güncelleme**: Otomatik (her gün)
- **İçerik**: Ürün bilgileri, stok, fiyat
- **Detaylı Dokümantasyon**: [Google_Shopping.md](./Google_Shopping.md)

## E-posta Servisi (Brevo)

**Transaksiyonel E-posta Sağlayıcı**: Brevo (Sendinblue) SMTP servisi kullanılmaktadır.

### Gönderilen E-posta Tipleri

- ✅ Sipariş onayı
- ✅ Kargo bildirimi (Sipariş kargoya verildi)
- ✅ Sipariş teslim edildi
- ✅ Sipariş iptali (Admin veya kullanıcı)
- ✅ İade talebi oluşturuldu
- ✅ İade talebi onaylandı/reddedildi

### Backend Yapılandırma

Brevo SMTP ayarları `server/api/.env` dosyasında:

```env
# Brevo (Sendinblue) SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_login_email
SMTP_PASS=your_brevo_smtp_key
SMTP_SENDER=bilgi@nalburdeposu.com.tr
```

### Servis Katmanı

E-posta gönderimi `server/api/src/services/email.service.js` üzerinden yönetilir:

```javascript
// Sipariş onay e-postası
await emailService.sendOrderConfirmation(order, kullaniciEmail);

// Kargo bildirim e-postası  
await emailService.sendShipmentNotification(siparis);
```

## SEO Entegrasyonları

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://nalburdeposu.com.tr/sitemap.xml
```

### Structured Data (JSON-LD)

- WebSite schema
- LocalBusiness schema (Samsun, Türkiye)
- Product schema
- BreadcrumbList schema

### Open Graph Meta Tags

Tüm sayfalarda Facebook/Instagram paylaşımı için OG meta tagları mevcuttur.
