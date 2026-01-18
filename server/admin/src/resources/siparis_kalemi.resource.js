import { getModelByName } from '@adminjs/prisma';

export const CreateSiparisKalemiResource = (prisma) => ({
    resource: {
        model: getModelByName('SiparisKalemi'),
        client: prisma
    },
    options: {
        navigation: false, // Hidden from sidebar
        properties: {
            id: { isVisible: { list: false, show: true, edit: false, filter: true } },
            siparisId: {
                type: 'string',
                isVisible: { list: false, show: true, edit: false, filter: true }
            },
            urunId: { isVisible: { list: true, show: true, edit: false } },

            // Highlight Snapshots
            urunAdSnapshot: {
                label: 'Sipariş Anındaki Ad',
                isVisible: { list: true, show: true, edit: false }
            },
            urunFiyatSnapshot: {
                label: 'Sipariş Anındaki Fiyat',
                type: 'currency',
                props: { symbol: '₺' },
                isVisible: { list: true, show: true, edit: false }
            },

            adet: { isVisible: { list: true, show: true, edit: false } },
            toplamFiyat: { type: 'currency', props: { symbol: '₺' } }
        },
        actions: {
            new: { isVisible: false },
            edit: { isVisible: false },
            delete: { isVisible: false },
            bulkDelete: { isVisible: false }
        }
    }
});
