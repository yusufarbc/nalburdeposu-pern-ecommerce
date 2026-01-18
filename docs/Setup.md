# Kurulum & Dağıtım

## Ön Gereksinimler
- Docker & Docker Compose
- Node.js (sadece lokal geliştirme için)

## Lokal Geliştirme

Tüm stack konteynerize edilmiştir. Uygulamayı başlatmak için:

```bash
# 1. Server dizinine git
cd server

# 2. Tüm servisleri başlat
docker-compose up --build -d

# 3. Logları kontrol et
docker-compose logs -f
```

### Erişim Noktaları
- **API**: [http://localhost:8080/api/v1/products](http://localhost:8080/api/v1/products)
- **Admin Panel**: [http://localhost:8081/admin](http://localhost:8081/admin)

### Client Geliştirme
```bash
cd client
npm install
npm run dev
```
Client geliştirme sunucusu: [http://localhost:3000](http://localhost:3000)

## Veritabanı Yönetimi

Veritabanı otomatik olarak başlatılır. Sıfırlamak veya seed data eklemek için:

```bash
# DB'yi sıfırla (DİKKAT: veri kaybı)
docker-compose down -v
docker-compose up -d
```

### Migration
```bash
cd server/api
npx prisma migrate dev --name migration_adi
```

## Production Dağıtımı

### Mimari
```
┌─────────────────┐     ┌─────────────────┐
│ Cloudflare      │     │ VDS Server      │
│ Pages           │     │                 │
│ (Client Build)  │────▶│ Cloudflare      │
│                 │     │ Tunnel          │
└─────────────────┘     │      │          │
                        │      ▼          │
                        │ ┌───────────┐   │
                        │ │ Caddy     │   │
                        │ │ (Proxy)   │   │
                        │ └─────┬─────┘   │
                        │       │         │
                        │   ┌───┴───┐     │
                        │   │       │     │
                        │   ▼       ▼     │
                        │ ┌───┐ ┌─────┐   │
                        │ │API│ │Admin│   │
                        │ └─┬─┘ └──┬──┘   │
                        │   │      │      │
                        │   ▼      ▼      │
                        │ ┌──────────┐    │
                        │ │PostgreSQL│    │
                        │ └──────────┘    │
                        └─────────────────┘
```

### Client Dağıtımı (Cloudflare Pages)

1. **Build oluştur:**
   ```bash
   cd client
   npm run build
   ```

2. **Cloudflare Pages'a yükle:**
   - Cloudflare Dashboard > Pages > Create Project
   - `dist` klasörünü yükle
   - Veya Git repo bağla (otomatik deploy)

### Server Dağıtımı (VDS)

1. **Repository'yi klonla:**
   ```bash
   git clone https://github.com/your-username/nalburdeposu.git
   cd nalburdeposu/server
   ```

2. **Environment değişkenlerini ayarla:**
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Docker Compose ile başlat:**
   ```bash
   docker-compose up --build -d
   ```

4. **Cloudflare Tunnel yapılandır:**
   - `TUNNEL_TOKEN` environment variable'ı ayarla
   - Tunnel otomatik başlayacaktır

## Environment Değişkenleri

### Zorunlu
| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL bağlantı string'i |
| `PARAM_CLIENT_CODE=
PARAM_CLIENT_USERNAME=
PARAM_CLIENT_PASSWORD=
PARAM_GUID=ET_KEY` | Iyzico gizli anahtar |
| `SMTP_PASS` | Brevo SMTP şifresi |
| `TUNNEL_TOKEN` | Cloudflare Tunnel token |

### Opsiyonel
| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `API_PORT` | 8080 | API port |
| `ADMIN_PORT` | 8081 | Admin panel port |
| `NODE_ENV` | development | Ortam |

## Health Check

```bash
# API durumu
curl http://localhost:8080/api/v1/health

# Container durumları
docker-compose ps
```
