# Frontend Mimarisi

**React (Vite)** ve **Tailwind CSS** ile geliştirilmiş **CSR (Client-Side Rendering)** tabanlı modern bir arayüzdür. **PWA** desteği mevcuttur.

## Dizin Yapısı

```
client/src/
├── components/         # Yeniden kullanılabilir UI bileşenleri
│   ├── Header.jsx      # Navigasyon, Arama, Sepet trigger
│   ├── Footer.jsx      # Site footer, sosyal medya, legal linkler
│   ├── ProductCard.jsx # Ürün özet kartı
│   ├── CartSidebar.jsx # Slide-out sepet görünümü
│   ├── CategoryFilter.jsx # Kategori filtresi
│   ├── ErrorBoundary.jsx # Hata yakalama
│   └── SEO.jsx         # Meta tag yönetimi
│
├── pages/              # Sayfa bileşenleri
│   ├── Home.jsx        # Ana sayfa (ürün listesi + arama + filtre)
│   ├── ProductDetail.jsx # Ürün detay sayfası
│   ├── CheckoutPage.jsx # Misafir checkout formu
│   ├── OrderTrackingPage.jsx # Sipariş takip sayfası
│   ├── PaymentSuccess.jsx # Ödeme başarılı
│   └── PaymentFailure.jsx # Ödeme başarısız
│
├── context/            # React Context API
│   └── CartContext.jsx # Sepet state yönetimi
│
├── hooks/              # Custom React hooks
│   ├── useProducts.js  # Ürün data fetching
│   └── useCategories.js # Kategori data fetching
│
├── services/           # API iletişimi
│   └── apiService.js   # Axios instance ve API fonksiyonları
│
├── utils/              # Yardımcı fonksiyonlar
│   ├── formatters.js   # Fiyat, tarih formatları
│   └── structuredData.js # SEO schema generators
│
├── locales/            # i18n çeviri dosyaları
│   └── tr/             # Türkçe çeviriler
│
├── App.jsx             # Ana uygulama, routing
├── main.jsx            # Entry point
└── index.css           # Global stiller, Tailwind
```

## State Yönetimi

### CartContext
Alışveriş sepeti state'ini yönetir:
- Sepet öğeleri (ürünler, adetler)
- Toplam tutarlar
- Sidebar görünürlüğü
- `localStorage`'a persist

```jsx
// Kullanım örneği
const { cart, addToCart, removeFromCart, total } = useCart();
```

## Routing

React Router v6 ile:

| Path | Sayfa | Açıklama |
|------|-------|----------|
| `/` | Home | Ürün listesi, arama, filtre |
| `/urun/:slug` | ProductDetail | Ürün detayları |
| `/checkout` | CheckoutPage | Misafir checkout formu |
| `/siparis-takip` | OrderTrackingPage | Sipariş durumu takibi |
| `/odeme-basarili` | PaymentSuccess | Başarılı ödeme sonrası |
| `/odeme-basarisiz` | PaymentFailure | Başarısız ödeme sonrası |

## SEO Stratejisi

### Meta Tag Yönetimi
`react-helmet-async` ile dinamik meta taglar:
- Title, Description
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URL

### Structured Data (JSON-LD)
- WebSite schema
- Product schema
- LocalBusiness schema
- BreadcrumbList schema

### PWA Özellikleri
- Service Worker (Workbox)
- Offline cache stratejisi
- App manifest
- Push notification ready

## Performans Optimizasyonları

### Code Splitting
```javascript
// vite.config.js
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  ui: ['lucide-react', 'clsx']
}
```

### Lazy Loading
- Görsel lazy loading (`loading="lazy"`)
- Component lazy loading (`React.lazy`)

### Caching
- API yanıtları için NetworkFirst stratejisi
- Statik varlıklar için CacheFirst

## Tema ve Stil

### Renk Paleti
| İsim | Değer | Kullanım |
|------|-------|----------|
| `brand-yellow` | #DEFF36 | Vurgu, CTA butonları |
| `corporate-black` | #191919 | Başlıklar, ana metin |
| `action-red` | #DC2A12 | İndirim, uyarılar |

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
