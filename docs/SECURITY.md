# Güvenlik Politikası

## Desteklenen Sürümler

| Sürüm | Destekleniyor       |
|-------|---------------------|
| 1.0.x | :white_check_mark:  |

## Güvenlik Açığı Bildirimi

Güvenlik açığı tespit ettiyseniz, lütfen **herkese açık issue oluşturmayın**.

### Bildirim Yöntemleri

1. **E-posta**: bilgi@nalburdeposu.com.tr adresine detaylı rapor gönderin
2. **Konu Satırı**: `[GÜVENLİK] Kısa açıklama`

### Raporunuzda Bulunması Gerekenler

- Açığın detaylı açıklaması
- Reproduce adımları
- Etkilenen dosya/modül yolları
- Olası etki analizi
- (Varsa) Önerilen çözüm

### Yanıt Süresi

- **İlk Yanıt**: 48 saat içinde
- **Değerlendirme**: 7 iş günü içinde
- **Düzeltme**: Kritiklik seviyesine göre 7-30 gün

## Güvenlik Uygulamalarımız

### Altyapı Güvenliği

- **Cloudflare WAF**: DDoS koruması ve bot filtreleme
- **Cloudflare Tunnel**: Origin IP gizleme
- **Helm.js**: Güvenli HTTP başlıkları
- **Rate Limiting**: API endpoint koruması

### Veri Güvenliği

- **Prisma ORM**: SQL Injection önleme
- **Iyzico 3D Secure**: PCI DSS uyumlu ödeme
- **Cloudflare R2**: Güvenli dosya depolama
- **PostgreSQL**: Şifreli bağlantılar

### Uygulama Güvenliği

- Tüm girdiler Zod ile valide edilir
- Hassas veriler loglanmaz
- Session bazlı admin authentication
- CORS origin kısıtlaması

## Bağımlılık Güvenliği

Düzenli olarak `npm audit` çalıştırılır ve güvenlik yamaları uygulanır.

```bash
# Güvenlik taraması
cd client && npm audit
cd server/api && npm audit
cd server/admin && npm audit
```

## Sorumluluk Beyanı

Bu yazılım "OLDUĞU GİBİ" sağlanmaktadır. Güvenlik önlemleri sürekli geliştiriliyor olsa da, %100 güvenlik garantisi verilemez.
