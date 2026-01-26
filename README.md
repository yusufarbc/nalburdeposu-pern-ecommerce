# Nalbur Deposu 🔧

**Hırdavat ve inşaat malzemeleri e-ticaret platformu - PERN Stack**

[https://nalburdeposu.com.tr](https://nalburdeposu.com.tr/)





![etrade_software_arch](https://github.com/user-attachments/assets/69ebf930-6d49-4d68-bc45-311365d38b9d)


## 🚀 Genel Bakış

Nalbur Deposu, hırdavat ve inşaat malzemeleri satışı için geliştirilmiş modern bir e-ticaret platformudur. Yüksek performans, ölçeklenebilirlik ve üstün kullanıcı deneyimi hedeflenerek tasarlanmıştır.

**Temel Özellikler:**
- 🛒 **Mağaza**: React + Vite ile geliştirilmiş PWA destekli mobil uyumlu arayüz
- 🔌 **Backend**: Express.js REST API (MSC Architecture), Prisma ORM ve Zod validasyonu
- 👨‍💼 **Admin Panel**: AdminJS ile kapsamlı yönetim paneli
- 💳 **Ödeme**: Param Payment Gateway entegrasyonu (3D Secure)
- 📧 **E-posta**: Brevo transaksiyonel e-posta servisi
- ☁️ **Altyapı**: Docker Compose ile konteynerize deployment
- 🎯 **SOLID Prensipleri**: Yazılım mimarisi SOLID prensiplerine uygun tasarlanmıştır
- 📱 **Dijital Pazarlama**: Meta Business Suite (Facebook, Instagram, WhatsApp) ve Google Workspace entegrasyonu

## 🏗️ Mimari

```
nalburdeposu/
├── client/                # Frontend (React + Vite + PWA)
│   ├── src/
│   │   ├── components/    # UI bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API servisleri
│   │   └── utils/         # Yardımcı fonksiyonlar
│   └── public/            # Statik dosyalar
│
├── server/
│   ├── api/               # Backend API (Express + Prisma)
│   │   ├── src/
│   │   │   ├── controllers/   # HTTP request handlers
│   │   │   ├── services/      # İş mantığı katmanı
│   │   │   ├── repositories/  # Veri erişim katmanı
│   │   │   └── routes/        # API route tanımları
│   │   └── prisma/            # Veritabanı şeması
│   │
│   ├── admin/             # Admin Panel (AdminJS)
│   └── docker-compose.yml # Container orchestration
│
└── docs/                  # Proje dokümantasyonu
```

## 🛠️ Teknoloji Stack

### Frontend (Client)
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| React | 18.x | UI framework |
| Vite | 4.x | Build tool |
| Tailwind CSS | 3.x | Utility-first CSS |
| PWA | - | Progressive Web App desteği |
| react-helmet-async | 2.x | SEO meta tag yönetimi |

### Backend (API)
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Node.js | 18.x | Runtime |
| Express | 4.x | Web framework |
| Prisma | 5.x | ORM |
| PostgreSQL | 15 | Veritabanı |
| Zod | 3.x | Schema validation |

### Altyapı
| Teknoloji | Açıklama |
|-----------|----------|
| Docker | Konteynerizasyon |
| Cloudflare Pages | Frontend hosting |
| Cloudflare Tunnel | Güvenli backend erişimi |
| Caddy | Reverse proxy |
| Cloudflare R2 | Object storage (resimler) |
| VDS Server | Backend (Docker Compose deployment) |
| Param | Payment Gateway (3D Secure) |

## 📦 Kurulum

### Gereksinimler
- Docker & Docker Compose
- Node.js v18+ (lokal geliştirme için)

### Hızlı Başlangıç

1. **Repository'yi klonlayın:**
   ```bash
   git clone https://github.com/yusufarbc/nalburdeposu.git
   cd nalburdeposu
   ```

2. **Environment değişkenlerini ayarlayın:**
   ```bash
   cp server/.env.example server/.env
   # .env dosyasını düzenleyin
   ```

3. **Docker ile başlatın:**
   ```bash
   cd server
   docker-compose up --build
   ```

4. **Servislere erişin:**
   - **API**: http://localhost:8080/api/v1
   - **Admin Panel**: http://localhost:8081/admin

### Client Geliştirme

```bash
cd client
npm install
npm run dev
```

## 🔐 Güvenlik

- **Cloudflare WAF**: DDoS koruması ve bot filtreleme
- **Helmet.js**: Güvenli HTTP headers
- **Rate Limiting**: API endpoint koruması
- **Prisma ORM**: SQL injection önleme
- **Param 3D Secure**: Güvenli ödeme işleme
- **Cloudflare R2**: Güvenli dosya depolama
- **Yurtdışı Koruması**: Cloudflare WAF ile Türkiye dışı erişim engeli

## 🤖 Yapay Zeka & SEO

- **AI Görünürlüğü**: Schema.org JSON-LD yapısal veri işaretleme (Product, Breadcrumb)
- **SEO**: React Helmet Async ile dinamik meta tag yönetimi
- **Sitemap**: API üzerinden sunulan dinamik sitemap.xml
- **Robots.txt**: AI botlarına (GPTBot, CCBot vb.) açık yapılandırma

## 📄 Dokümantasyon

Detaylı dokümantasyon için `/docs` klasörüne bakın:

- [Mimari](./docs/Architecture.md)
- [API Referansı](./docs/API.md)
- [Backend Yapısı](./docs/Backend_Structure.md)
- [Frontend Yapısı](./docs/Frontend_Structure.md)
- [Deployment](./docs/Deployment.md)
- [Kurulum](./docs/Setup.md)
- [Meta Entegrasyonu](./docs/Meta_Integration.md)
- [Google Shopping](./docs/Google_Shopping.md)

## 📱 Dijital Pazarlama

- **Google Shopping**: Merchant Center XML Feed entegrasyonu
- **Meta Business Suite**: Facebook & Instagram entegrasyonu
- **WhatsApp Business**: Müşteri iletişimi
- **Google Workspace**: bilgi@nalburdeposu.com.tr

## 📍 Konum & Kapsam

- **Lokasyon**: Samsun, Türkiye
- **Kapsam**: Sadece Türkiye geneli kargo ile satış.
- **Yurtdışı**: Cloudflare ve VDS seviyesinde yurtdışı trafiği kapatılmıştır.
- **İletişim**: bilgi@nalburdeposu.com.tr (Google Workspace)

## 📄 Lisans

Bu proje **Tüm Hakları Saklıdır (All Rights Reserved)** prensibiyle korunmaktadır.
Kodlar sadece inceleme ve referans amaçlı paylaşılmıştır. İzinsiz kopyalanması, dağıtılması veya ticari/bireysel projelerde kullanılması kesinlikle yasaktır.
Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

---

**Nalbur Deposu** © 2026 - Profesyonel Hırdavat & İnşaat Malzemeleri
