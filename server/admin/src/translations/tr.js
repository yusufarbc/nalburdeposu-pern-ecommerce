export const tr = {
    language: 'en', // HACK: Force 'en' to ensure these are used by default
    translations: {
        actions: {
            new: 'Yeni Ekle',
            edit: 'Düzenle',
            show: 'Detay',
            delete: 'Sil',
            bulkDelete: 'Toplu Sil',
            list: 'Listele',
            search: 'Ara',
            addNewItem: 'Yeni Ekle',
        },
        buttons: {
            save: 'Kaydet',
            filter: 'Filtrele',
            login: 'Giriş Yap',
            logout: 'Çıkış',
            create: 'Oluştur',
            confirm: 'Onayla',
            cancel: 'İptal',
            back: 'Geri',
        },
        labels: {
            loginWelcome: 'NalburDeposu Yönetim Paneli',
            Urun: 'Ürün Yönetimi',
            Kategori: 'Kategori Yönetimi',
            Siparis: 'Sipariş Yönetimi',
            SiparisKalemi: 'Sipariş Ürünleri',
            SiparisGecmisi: 'İşlem Geçmişi',
            Navigation: 'Navigasyon',
            Pages: 'Yapılandırma', // Rename Pages group to merge or replace
            pages: 'Yapılandırma', // Lowercase fallback
            Resources: 'Kaynaklar',
            filters: 'Filtreler',
            OdemeDurumuBadge: 'Ödeme Durumu', // Badge label
        },
        messages: {
            successfullyCreated: 'Başarıyla oluşturuldu',
            successfullyUpdated: 'Başarıyla güncellendi',
            successfullyDeleted: 'Başarıyla silindi',
            loginWelcome: 'Lütfen yönetici kimlik bilgilerinizle oturum açın.',
            errorFetchingRecords: 'Kayıtlar getirilirken hata oluştu',
            forbiddenError: 'Bu işlemi yapmaya yetkiniz yok',
            invalidCredentials: 'E-posta veya şifre hatalı',
        },
        properties: {
            // Ortak Alanlar (ve Login)
            email: 'E-Posta',
            password: 'Şifre',
            ad: 'Ad',
            fiyat: 'Fiyat (₺)',
            stok: 'Stok Adedi',
            sku: 'Stok Kodu (SKU)',
            aktif: 'Aktif mi?',
            slug: 'SEO URL (Slug)',
            resimUrl: 'Ana Görsel URL',
            imageFile: 'Ürün Görseli (Dosya Seç)',
            aciklama: 'Açıklama',
            kategoriId: 'Kategori',
            kategori: 'Kategori',
            ustKategori: 'Üst Kategori',
            siparisNumarasi: 'Sipariş No',
            toplamTutar: 'Toplam Tutar',
            kargoUcreti: 'Kargo Ücreti',
            durum: 'Sipariş Durumu',
            odemeDurumu: 'Ödeme Durumu',
            eposta: 'Müşteri E-Posta',
            telefon: 'Telefon',
            adres: 'Adres',
            islemYapan: 'İşlemi Yapan',
            eskiDurum: 'Eski Durum',
            yeniDurum: 'Yeni Durum',
            not: 'Not / Açıklama',
            desi: 'Desi',

            // Snapshot Alanları
            urunAdSnapshot: 'Sipariş Anındaki Ad',
            urunFiyatSnapshot: 'Sipariş Anındaki Fiyat',

            olusturulmaTarihi: 'Oluşturulma Tarihi',
            guncellenmeTarihi: 'Güncellenme Tarihi',
        },
        // Root Level Login Keys (AdminJS v7 sometimes uses these)
        welcomeHeader: 'NalburDeposu Yönetim Paneli',
        welcomeMessage: 'Lütfen yönetici kimlik bilgilerinizle oturum açın.',
        loginWelcome: 'NalburDeposu Yönetim Paneli',
        email: 'E-Posta',
        password: 'Şifre',
        loginButton: 'Giriş Yap',
        login: 'Giriş Yap',

        // Nested Login Keys
        Login: {
            loginButton: 'Giriş Yap',
            email: 'E-Posta',
            password: 'Şifre',
            welcomeHeader: 'NalburDeposu Yönetim Paneli',
            welcomeMessage: 'Lütfen yönetici kimlik bilgilerinizle oturum açın.',
            properties: {
                email: 'E-Posta',
                password: 'Şifre'
            }
        }
    }
};
