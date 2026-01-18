import { getModelByName } from '@adminjs/prisma';

export const CreateSistemAyarlariResource = (prisma) => ({
    resource: {
        model: getModelByName('SistemAyarlari'),
        client: prisma
    },
    options: {
        navigation: null, // Hide from sidebar
        properties: {
            id: { isVisible: false },
            kargoAgirlikCarpani: {
                label: 'Kargo Ağırlık Çarpanı (TL)',
                description: 'Eski sistem için ağırlık çarpanı (Opsiyonel).'
            },
            ambarEsikAgirlik: {
                label: 'Ambar Eşik Ağırlığı (kg)',
                description: 'Bu ağırlık üzerindeki siparişler ambar/nakliye olarak işaretlenir.'
            },
            ucretsizKargoAltLimit: {
                label: 'Ücretsiz Kargo Alt Limiti (TL)',
                description: 'Sepet tutarı bu limiti geçerse kargo ücretsiz olur.'
            },
            kargoFiyatListesi: {
                label: 'Kademeli Kargo Fiyat Listesi',
                description: 'Örnek: [{"maxWeight": 1, "price": 50}, {"maxWeight": 2, "price": 100}]',
                type: 'textarea'
            },
            updatedAt: { isVisible: { list: true, show: true, edit: false } }
        },
        actions: {
            new: { isAccessible: false }, // Singleton: No new
            delete: { isAccessible: false }, // Singleton: No delete
            bulkDelete: { isAccessible: false },
            edit: { isAccessible: true, label: 'Düzenle' },
            list: { isAccessible: true, label: 'Listele' },
            show: { isAccessible: true, label: 'Detay' }
        }
    }
});
