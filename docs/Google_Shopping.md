# Google Shopping Entegrasyonu

Bu döküman, Nalbur Deposu'nun Google Merchant Center entegrasyonunu açıklamaktadır.

## 🛒 Genel Bakış

Google Shopping, ürünlerin Google Arama sonuçlarında ve Google Alışveriş sekmesinde görünmesini sağlar. Bu entegrasyon, otomatik XML feed oluşturarak ürünlerin Merchant Center'a aktarılmasını sağlar.

## 📡 Feed Endpoint'leri

### XML Feed (Merchant Center için)

```
GET https://api.nalburdeposu.com.tr/api/v1/feeds/google
```

Bu endpoint, Google Merchant Center'ın periyodik olarak tarayacağı XML dosyasını döner.

**Özellikler:**
- RSS 2.0 formatı (Google Shopping namespace)
- Sadece aktif ve stokta olan ürünler
- 1 saat cache süresi
- UTF-8 encoding

### Feed İstatistikleri

```
GET https://api.nalburdeposu.com.tr/api/v1/feeds/google/stats
```

Admin paneli için feed durumu bilgisi döner.

**Örnek Yanıt:**
```json
{
  "totalActiveProducts": 150,
  "productsInFeed": 120,
  "productsWithGTIN": 85,
  "feedUrl": "/api/v1/feeds/google",
  "lastUpdated": "2026-01-14T10:00:00.000Z"
}
```

## 🗄️ Veritabanı Alanları

`Urun` modeline eklenen Google Shopping alanları:

| Alan | Tip | Açıklama |
|------|-----|----------|
| `barkod` | String? | GTIN/EAN barkod numarası |
| `stokAdedi` | Int | Stok miktarı (0 = feed'de görünmez) |
| `googleKategori` | String? | Google Product Category ID |

## 🏷️ Google Product Category

Ürünler, kategorilerine göre otomatik olarak Google taksonomi ID'lerine eşleştirilir:

| Kategori Slug | Google ID | Açıklama |
|---------------|-----------|----------|
| `el-aletleri` | 1167 | Tools > Hand Tools |
| `elektrikli-aletler` | 1169 | Tools > Power Tools |
| `boya` | 2918 | Paint & Painting Supplies |
| `hirdavat` | 115 | Hardware |
| `insaat` | 2878 | Building Materials |

> 📋 Tam liste: [Google Taxonomy (TR)](https://www.google.com/basepages/producttype/taxonomy-with-ids.tr-TR.txt)

## ⚙️ Merchant Center Kurulumu

### 1. Feed Ekleme

1. [Google Merchant Center](https://merchants.google.com) → Ürünler → Feedler
2. **Yeni Feed Ekle (+)**
3. Hedef ülke: **Türkiye**
4. Dil: **Türkçe**
5. Yöntem: **Zamanlanmış Tarama (Scheduled Fetch)**
6. URL: `https://api.nalburdeposu.com.tr/api/v1/feeds/google`
7. Tarama sıklığı: **Günlük**

### 2. Web Sitesi Doğrulama

Google Workspace (`bilgi@nalburdeposu.com.tr`) kullanıldığı için:

1. Google Search Console'a giriş yap
2. `nalburdeposu.com.tr` property'sini ekle
3. Merchant Center ayarlarında "Search Console ile doğrula" seç

### 3. Feed Doğrulama

Feed'i test etmek için:

```bash
curl -H "Accept: application/xml" https://api.nalburdeposu.com.tr/api/v1/feeds/google
```

## ✅ Ürün Gereksinimleri

Google'ın kabul edeceği ürünler için:

- [x] `aktif: true` olmalı
- [x] `stokAdedi > 0` olmalı
- [x] `fiyat` pozitif değer olmalı
- [ ] `barkod` (GTIN) önerilir ama zorunlu değil
- [ ] `aciklama` en az 100 karakter önerilir

## 🔧 Troubleshooting

### Feed yüklenmiyor

1. URL'in public erişime açık olduğunu kontrol et
2. Cloudflare WAF kurallarını kontrol et (Google botuna izin ver)
3. Rate limiting sınırını kontrol et

### Ürünler reddediliyor

1. Merchant Center'daki "Tanılama" sekmesini kontrol et
2. Eksik alanları tamamla (barkod, açıklama)
3. Görsel URL'lerinin erişilebilir olduğunu doğrula

## 📊 İzleme

Feed durumunu takip etmek için:

1. `/api/v1/feeds/google/stats` endpoint'ini kontrol et
2. Merchant Center → Tanılama sekmesini izle
3. Google Search Console'da zengin sonuçları kontrol et
