import { getModelByName } from '@adminjs/prisma';
import { Components } from '../component-loader.js';

export const CreateSiparisGecmisiResource = (prisma) => ({
    resource: {
        model: getModelByName('SiparisGecmisi'),
        client: prisma
    },
    options: {
        id: 'SiparisGecmisi',
        navigation: {
            name: 'Satış Yönetimi',
            icon: 'Clipboard',
        },
        labels: {
            name: 'İşlem Geçmişi',
            header: 'İşlem Geçmişi',
            referenceName: 'İşlem Geçmişi',
            menu: 'İşlem Geçmişi' // Force menu label if possible
        },
        sort: {
            sortBy: 'tarih',
            direction: 'desc',
        },
        properties: {
            id: { isVisible: { list: false, show: true, edit: false, filter: true } },
            siparisId: { isVisible: { list: true, show: true, edit: false, filter: true } },
            siparis: { isVisible: true },
            eskiDurum: { isVisible: { list: true, show: true, edit: false, filter: true } },
            yeniDurum: { isVisible: { list: true, show: true, edit: false, filter: true } },
            not: { isVisible: { list: true, show: true, edit: false, filter: true } },
            islemYapan: { isVisible: { list: true, show: true, edit: false, filter: true } },
            tarih: { isVisible: { list: true, show: true, edit: false, filter: true } },
        },
        actions: {
            new: { isVisible: false },
            edit: { isVisible: false },
            delete: { isVisible: false },
            bulkDelete: { isVisible: false },
            show: {
                component: Components.HistoryTimeline
            }
        }
    }
});
