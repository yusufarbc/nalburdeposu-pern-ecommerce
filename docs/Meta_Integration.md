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

### Entegrasyon Noktaları

- **Footer**: WhatsApp iletişim butonu
- **Sipariş Takip**: Destek için WhatsApp yönlendirmesi
- **Ürün Detay**: Satış öncesi sorular için WhatsApp

### Yapılandırma

WhatsApp numarası `Header.jsx` ve `Footer.jsx` bileşenlerinde tanımlıdır:

```javascript
const whatsappUrl = `https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(message)}`;
```

## Google Workspace

| Servis | Kullanım |
|--------|----------|
| Gmail | bilgi@nalburdeposu.com.tr |
| Google Analytics | Web trafiği analizi (planlanıyor) |
| Google Search Console | SEO izleme |

## E-posta Servisi (Brevo)

Transaksiyonel e-postalar Brevo SMTP üzerinden gönderilmektedir:

- Sipariş onayı
- Kargo bildirimi
- Sipariş iptali
- İade talebi bildirimleri

### Yapılandırma

`.env` dosyasında:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_user
SMTP_PASS=your_brevo_password
SMTP_SENDER=bilgi@nalburdeposu.com.tr
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
