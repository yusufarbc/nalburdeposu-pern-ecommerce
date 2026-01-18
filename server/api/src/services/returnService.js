import prisma from '../prisma.js';

export class ReturnService {
    /**
     * İade talebi oluşturur.
     * @param {Object} data - { token, iadeTipi, sebepAciklamasi, fotografUrls }
     */
    async createReturnRequest(data) {
        const { token, iadeTipi, sebepAciklamasi, fotografUrls } = data;

        // 1. Siparişi Bul
        const order = await prisma.siparis.findUnique({
            where: { takipTokeni: token },
            include: { iadeTalebi: true }
        });

        if (!order) {
            throw new Error('Sipariş bulunamadı.');
        }

        // 2. Kontroller
        if (order.durum !== 'TESLIM_EDILDI') {
            throw new Error('Sadece teslim edilmiş siparişler için iade talebi oluşturulabilir.');
        }

        if (order.iadeTalebi) {
            throw new Error('Bu sipariş için zaten bir iade talebi mevcut.');
        }

        // 3. 14 Gün Kuralı
        if (!order.teslimTarihi) {
            // Eğer teslim tarihi yoksa, bir hata veya varsayılan bir davranış (örneğin delivered status update time kullanılmalıydı)
            // Ancak şimdilik güvenli olması için teslim tarihinin kayıtlı olmasını zorunlu kılıyoruz.
            // Eski siparişler için bu sorun olabilir, manuel düzeltme gerekebilir.
            throw new Error('Sipariş teslim tarihi bilgisi eksik, iade işlemi başlatılamıyor. Lütfen destek ile iletişime geçin.');
        }

        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        const timeDiff = new Date() - new Date(order.teslimTarihi);

        if (timeDiff > fourteenDaysInMs) {
            throw new Error('İade süresi (14 gün) dolmuştur.');
        }

        // 4. İade Talebini Oluştur
        const iade = await prisma.iadeTalebi.create({
            data: {
                siparisId: order.id,
                talepTipi: iadeTipi,
                aciklama: sebepAciklamasi,
                fotografUrls: fotografUrls || [],
                durum: 'ONAY_BEKLENIYOR'
            }
        });

        // 5. Sipariş Durumunu Güncelle
        await prisma.siparis.update({
            where: { id: order.id },
            data: { durum: 'IADE_TALEP_EDILDI' }
        });

        return iade;
    }

    /**
     * Siparişin iade durumunu getirir.
     */
    async getReturnStatus(token) {
        const order = await prisma.siparis.findUnique({
            where: { takipTokeni: token },
            include: { iadeTalebi: true }
        });

        if (!order) throw new Error('Sipariş bulunamadı.');

        return order.iadeTalebi;
    }
}
