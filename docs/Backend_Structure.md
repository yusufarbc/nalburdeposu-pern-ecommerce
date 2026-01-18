# Backend Mimarisi

Backend, **SOLID Prensiplerine** uygun **Katmanlı Mimari** kullanır.

## Dizin Yapısı

```
server/api/src/
├── controllers/           # HTTP request handlers
│   ├── productController.js
│   ├── categoryController.js
│   ├── brandController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── returnController.js
│   └── settingsController.js
│
├── services/              # İş mantığı katmanı
│   ├── productService.js
│   ├── categoryService.js
│   ├── brandService.js
│   ├── orderService.js
│   ├──- **paramService.js**: Param SOAP servisi ile iletişim kurar.teway
│   ├── emailService.js    # Transaksiyonel e-posta
│   └── returnService.js
│
├── repositories/          # Veri erişim katmanı
│   ├── baseRepository.js  # Temel CRUD operasyonları
│   ├── productRepository.js
│   ├── categoryRepository.js
│   ├── brandRepository.js
│   └── orderRepository.js
│
├── routes/                # Express route tanımları
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── brandRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── returnRoutes.js
│   └── settingsRoutes.js
│
├── middlewares/           # Express middlewares
│   ├── errorHandler.js    # Global hata yakalama
│   └── validateRequest.js # Zod validasyon
│
├── validators/            # Zod şemaları
│   └── orderValidator.js
│
├── utils/                 # Yardımcı fonksiyonlar
│
├── app.js                 # Express app tanımı
├── container.js           # Dependency Injection container
├── config.js              # Environment config
└── prisma.js              # Prisma client instance
```

## SOLID Uygulama Detayları

### Single Responsibility Principle (SRP)
Her sınıf tek bir sorumluluğa sahiptir:

```javascript
// Controller - Sadece HTTP işlemleri
class ProductController {
  async getAll(req, res, next) {
    const products = await this.productService.getAllProducts();
    res.json({ data: products });
  }
}

// Service - Sadece iş mantığı
class ProductService {
  async getAllProducts(filters) {
    return this.productRepository.findAllWithCategories(filters);
  }
}

// Repository - Sadece veri erişimi
class ProductRepository extends BaseRepository {
  async findAllWithCategories(filters) {
    return this.prisma.urun.findMany({ ... });
  }
}
```

### Open/Closed Principle (OCP)
`BaseRepository` genişletilebilir:

```javascript
class BaseRepository {
  constructor(prisma, modelName) {
    this.prisma = prisma;
    this.model = prisma[modelName];
  }

  async findById(id) { ... }
  async findAll() { ... }
  async create(data) { ... }
  async update(id, data) { ... }
  async delete(id) { ... }
}

// Genişletme
class ProductRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma, 'urun');
  }

  // Özel metodlar ekle
  async findBySlug(slug) { ... }
}
```

### Dependency Inversion Principle (DIP)
`container.js` ile Dependency Injection:

```javascript
// container.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Repositories
const productRepository = new ProductRepository(prisma);
const orderRepository = new OrderRepository(prisma);

// Services
const productService = new ProductService(productRepository);
const orderService = new OrderService(orderRepository, iyzicoService, emailService);

// Controllers
const productController = new ProductController(productService);
const orderController = new OrderController(orderService);

export { productController, orderController, ... };
```

## Temel Servisler

### ProductService
Ürün iş mantığını yönetir:
- `getAllProducts(filters)`: Kategori/marka filtreli ürün listesi
- `getProductBySlug(slug)`: Tek ürün detayı

### OrderService
Sipariş yaşam döngüsünü yönetir:
- `createOrder(data)`: Yeni sipariş oluştur
- `processPaymentCallback(data)`: Ödeme sonucu işle
- `updateOrderStatus(orderId, status)`: Durum güncelle
- `cancelOrder(orderId, reason)`: Sipariş iptal

### IyzicoService
Param POS Entegrasyonu entegrasyonu:
- `initiate3DPayment(order)`: 3D Secure başlat
- `processCallback(token)`: Callback işle
- `refundPayment(paymentId, amount)`: İade işle

### EmailService
Brevo transaksiyonel e-posta servisi:
- `sendOrderConfirmation(order)`: Sipariş onay
- `sendShippingNotification(order)`: Kargo bildirim
- `sendCancellationEmail(order, reason)`: İptal bildirim

## Veritabanı Şeması

### Ana Modeller
- `Urun` - Ürünler
- `Kategori` - Hiyerarşik kategoriler
- `Marka` - Markalar
- `Siparis` - Siparişler
- `SiparisKalemi` - Sipariş kalemleri
- `SiparisGecmisi` - Sipariş durum geçmişi
- `IadeTalebi` - İade talepleri
- `SistemAyarlari` - Global ayarlar

### İlişkiler
```
Urun ─┬─ Kategori (N:1)
      ├─ Marka (N:1)
      └─ UrunResim (1:N)

Siparis ─┬─ SiparisKalemi (1:N)
         ├─ SiparisGecmisi (1:N)
         └─ IadeTalebi (1:1)
```

## Hata Yönetimi

Global error handler middleware:

```javascript
// errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Geçersiz istek',
        details: err.errors
      }
    });
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Sunucu hatası'
    }
  });
};
```

## Validasyon

Zod ile request validasyonu:

```javascript
// orderValidator.js
export const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().positive()
  })),
  customerInfo: z.object({
    ad: z.string().min(2),
    soyad: z.string().min(2),
    eposta: z.string().email(),
    telefon: z.string().regex(/^5\d{9}$/),
    // ...
  })
});
```
