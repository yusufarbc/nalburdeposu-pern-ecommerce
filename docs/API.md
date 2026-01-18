# API Dokümantasyonu

## Base URL
**Production**: `https://api.nalburdeposu.com.tr/api/v1`  
**Development**: `http://localhost:8080/api/v1`

---

## Ürünler

### Tüm Ürünleri Listele
```http
GET /products
```

**Query Parameters:**
| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `kategoriId` | string (UUID) | Kategori ID'sine göre filtrele |
| `markaId` | string (UUID) | Marka ID'sine göre filtrele |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "bosch-matkap-v3",
      "ad": "Bosch Matkap V3",
      "fiyat": 1299.99,
      "indirimliFiyat": 999.99,
      "resimUrl": "https://cdn.../image.jpg",
      "kategori": { "id": "uuid", "ad": "El Aletleri" },
      "marka": { "id": "uuid", "ad": "Bosch" }
    }
  ]
}
```

---

### Ürün Detayı
```http
GET /products/:slug
```

**Response:**
```json
{
  "id": "uuid",
  "slug": "bosch-matkap-v3",
  "ad": "Bosch Matkap V3",
  "fiyat": 1299.99,
  "indirimliFiyat": 999.99,
  "aciklama": "Profesyonel kullanım için...",
  "resimUrl": "https://cdn.../image.jpg",
  "resimler": [
    { "url": "https://cdn.../image1.jpg", "sira": 0 },
    { "url": "https://cdn.../image2.jpg", "sira": 1 }
  ],
  "kategori": { "id": "uuid", "ad": "El Aletleri" },
  "marka": { "id": "uuid", "ad": "Bosch", "logoUrl": "https://cdn.../logo.png" }
}
```

---

## Kategoriler

### Tüm Kategorileri Listele
```http
GET /categories
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "ad": "Hırdavat",
      "slug": "hirdavat",
      "resim": null,
      "sira": 0,
      "altKategoriler": [
        { "id": "uuid", "ad": "Matkaplar", "slug": "matkaplar", "resim": "https://..." }
      ]
    }
  ]
}
```

---

## Markalar

### Tüm Markaları Listele
```http
GET /brands
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "ad": "Bosch",
      "slug": "bosch",
      "logoUrl": "https://cdn.../bosch.png",
      "sira": 0
    }
  ]
}
```

---

## Siparişler

### Checkout Başlat
```http
POST /orders/checkout
```

**Request Body:**
```json
{
  "items": [
    { "id": "product-uuid", "quantity": 2 }
  ],
  "customerInfo": {
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "eposta": "ahmet@example.com",
    "telefon": "5321234567",
    "adres": "Atatürk Cad. No:123",
    "sehir": "Samsun",
    "ilce": "İlkadım",
    "postaKodu": "55060"
  },
  "kurumsalFatura": {
    "kurumsalMi": true,
    "sirketAdi": "ABC Ltd. Şti.",
    "vergiDairesi": "Samsun",
    "vergiNumarasi": "1234567890"
  }
}
```

**Response:**
```json
{
  "paymentPageUrl": "https://sandbox-api.iyzipay.com/...",
  "token": "payment-token",
  "orderId": "order-uuid"
}
```

---

### Sipariş Takip
```http
GET /orders/track/:token
```

**Response:**
```json
{
  "siparisNumarasi": "ND-20260111-ABC123",
  "durum": "HAZIRLANIYOR",
  "toplamTutar": 1299.99,
  "kargoUcreti": 0,
  "kargoTakipNo": "123456789",
  "kargoFirmasi": "Aras Kargo",
  "kalemler": [
    {
      "urunAdSnapshot": "Bosch Matkap V3",
      "adet": 1,
      "fiyat": 1299.99
    }
  ],
  "gecmis": [
    { "yeniDurum": "BEKLEMEDE", "tarih": "2026-01-11T10:00:00Z" },
    { "yeniDurum": "HAZIRLANIYOR", "tarih": "2026-01-11T14:00:00Z" }
  ]
}
```

---

### Sipariş İptal
```http
POST /orders/:orderId/cancel
```

**Request Body:**
```json
{
  "reason": "Yanlış ürün sipariş ettim"
}
```

---

## İade Talepleri

### İade Talebi Oluştur
```http
POST /returns
```

**Request Body:**
```json
{
  "siparisId": "order-uuid",
  "iadeTipi": "KUSURLU_URUN",
  "sebepAciklamasi": "Ürün hasarlı geldi",
  "fotografUrls": ["https://..."]
}
```

---

## Sistem Ayarları

### Kargo Ayarlarını Getir
```http
GET /settings
```

**Response:**
```json
{
  "kargoDesiCarpani": 5.50,
  "ambarEsikDesi": 100,
  "ucretsizKargoAltLimit": 500.00
}
```

---

## Hata Yanıtları

Tüm hatalar aşağıdaki formatta döner:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "E-posta adresi geçersiz",
    "details": [...]
  }
}
```

### HTTP Durum Kodları
| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz İstek |
| 404 | Bulunamadı |
| 500 | Sunucu Hatası |
