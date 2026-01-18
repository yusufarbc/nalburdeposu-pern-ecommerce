/**
 * @module siparis.resource
 * @description AdminJS resource configuration for Order (Sipariş) management.
 * 
 * Features:
 * - Complete order lifecycle management (BEKLEMEDE → TAMAMLANDI)
 * - Status change actions: hazirla, kargola, teslimEt, iptalEt
 * - Invoice status management (faturaDuzenle)
 * - Bulk actions for processing multiple orders
 * - Order history logging (SiparisGecmisi)
 * - Custom show view with order details
 * 
 * Order Status Flow:
 * BEKLEMEDE → HAZIRLANIYOR → KARGOLANDI → TESLIM_EDILDI → TAMAMLANDI
 *                                       ↘ IPTAL_EDILDI
 *                                       ↘ IADE_TALEP_EDILDI → IADE_EDILDI
 * 
 * @requires @adminjs/prisma
 */

import { getModelByName } from '@adminjs/prisma';
import { Components } from '../component-loader.js';
import { ParamAdminService } from '../services/param.service.js';
import { EmailAdminService } from '../services/email.service.js';

const paramService = new ParamAdminService();
const emailService = new EmailAdminService();

/**
 * Factory function to create the Siparis (Order) resource configuration.
 * Follows Dependency Inversion Principle - Prisma client is injected.
 * 
 * @param {Object} prisma - Prisma client instance for database operations
 * @returns {Object} AdminJS resource configuration object
 * 
 * @example
 * import { CreateSiparisResource } from './resources/siparis.resource.js';
 * const siparisResource = CreateSiparisResource(prisma);
 */
export const CreateSiparisResource = (prisma) => ({
    resource: {
        model: getModelByName('Siparis'),
        client: prisma
    },
    options: {
        navigation: {
            name: 'Satış Yönetimi',
            icon: 'ShoppingBag',
        },
        sort: {
            direction: 'desc',
            sortBy: 'olusturulmaTarihi',
        },
        properties: {
            id: { isVisible: { list: false, show: true, edit: false, filter: true } },
            siparisNumarasi: { isTitle: true, position: 1 },

            // Status Section
            durum: {
                position: 2,
                availableValues: [
                    { value: 'BEKLEMEDE', label: 'Beklemede ⏳' },
                    { value: 'HAZIRLANIYOR', label: 'Hazırlanıyor 📦' },
                    { value: 'KARGOLANDI', label: 'Kargolandı 🚚' },
                    { value: 'TESLIM_EDILDI', label: 'Teslim Edildi ✅' },
                    { value: 'TAMAMLANDI', label: 'Tamamlandı 🏁' },
                    { value: 'IPTAL_EDILDI', label: 'İptal Edildi 🚫' },
                    { value: 'IADE_TALEP_EDILDI', label: 'İade Talep Edildi ↩️' },
                    { value: 'IADE_EDILDI', label: 'İade Edildi 💸' },
                ],
                components: {
                    list: Components.StatusBadge,
                    show: Components.StatusBadge,
                }
            },
            faturaDurumu: {
                position: 3,
                availableValues: [
                    { value: 'DUZENLENMEDI', label: 'Düzenlenmedi' },
                    { value: 'DUZENLENDI', label: 'Düzenlendi 📝' },
                    { value: 'ODENDI', label: 'Ödendi 💵' },
                ],
                components: {
                    list: Components.InvoiceStatusBadge,
                    show: Components.InvoiceStatusBadge,
                }
            },

            // Financials
            toplamTutar: { position: 4, type: 'currency', props: { symbol: '₺' } },
            kargoUcreti: { position: 5, type: 'currency', props: { symbol: '₺' } },
            odemeDurumu: {
                position: 6,
                components: {
                    list: Components.OdemeDurumuBadge,
                    show: Components.OdemeDurumuBadge,
                }
            },

            // Customer Info
            ad: { position: 7, isVisible: { list: true, show: true, edit: false, filter: true } },
            soyad: { position: 8, isVisible: { list: true, show: true, edit: false, filter: true } },
            eposta: { position: 9, isVisible: { list: true, show: true, edit: false, filter: true } },
            telefon: { position: 10, isVisible: { list: false, show: true, edit: false, filter: true } },
            adres: { position: 11, type: 'textarea', isVisible: { list: false, show: true, edit: false, filter: false } },
            sehir: { position: 12, isVisible: { list: false, show: true, edit: false, filter: true } },
            ilce: { position: 13, isVisible: { list: false, show: true, edit: false, filter: true } },

            // Shipping Info
            kargoFirmasi: { position: 14, isVisible: { list: true, edit: true, show: true, filter: true } },
            kargoTakipNo: { position: 15, isVisible: { list: true, edit: true, show: true, filter: true } },

            // Relations - Items
            kalemler: {
                position: 16,
                isVisible: { list: false, edit: false, show: true, filter: false },
                reference: 'SiparisKalemi',
            },
            gecmis: { position: 17, isVisible: { list: false, edit: false, show: true, filter: false } },
        },
        actions: {
            list: {
                label: 'Listele',
            },
            hazirla: {
                actionType: 'record',
                icon: 'Package',
                label: 'Hazırla ⚙️',
                handler: async (request, response, context) => {
                    const { record, currentAdmin } = context;
                    try {
                        await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'HAZIRLANIYOR' } });
                        await prisma.siparisGecmisi.create({
                            data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'HAZIRLANIYOR', islemYapan: 'Admin', not: 'Sipariş hazırlanıyor.' }
                        });
                        return {
                            record: record.toJSON(currentAdmin),
                            notice: { message: 'Sipariş hazırlanıyor.', type: 'success' },
                            redirectUrl: `/admin/resources/Siparis/records/${record.params.id}/show`
                        };
                    } catch (error) {
                        console.error('Hazırla Error:', error);
                        return { record: record.toJSON(currentAdmin), notice: { message: 'Hata: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            kargola: {
                actionType: 'record',
                icon: 'Truck',
                label: 'Kargola 📦',
                handler: async (request, response, context) => {
                    const { currentAdmin } = context;
                    let { record } = context;

                    // 1. Safe Error Response Helper
                    const returnError = (message) => {
                        return {
                            record: record ? record.toJSON(currentAdmin) : {},
                            notice: { message: 'Hata: ' + message, type: 'error' }
                        };
                    };

                    if (request.method === 'post') {
                        try {
                            // Modal üzerinden gelen veriyi al
                            const { kargoFirmasi, kargoTakipNo, recordId } = request.payload;

                            // 2. Fallback: Context'te record yoksa, payload'daki ID'yi kullan
                            if (!record && recordId) {
                                const prismaRecord = await prisma.siparis.findUnique({ where: { id: recordId } });
                                if (prismaRecord) {
                                    // AdminJS record yapısını simüle et veya direkt kullan
                                    record = { params: prismaRecord };
                                }
                            }

                            if (!record || !record.params) {
                                return returnError('Sipariş kaydı bulunamadı (Record undefined).');
                            }

                            if (!kargoFirmasi || !kargoTakipNo) {
                                return returnError('Kargo Firması ve Takip Numarası zorunludur.');
                            }

                            await prisma.siparis.update({
                                where: { id: record.params.id },
                                data: {
                                    durum: 'KARGOLANDI',
                                    kargoFirmasi,
                                    kargoTakipNo
                                }
                            });

                            // Güncel record ile geçmiş kaydı
                            await prisma.siparisGecmisi.create({
                                data: {
                                    siparisId: record.params.id,
                                    eskiDurum: record.params.durum,
                                    yeniDurum: 'KARGOLANDI',
                                    islemYapan: 'Admin',
                                    not: `Kargolandı: ${kargoFirmasi} - ${kargoTakipNo}`
                                }
                            });

                            // E-posta Bildirimi Gönder
                            try {
                                await emailService.sendShippingNotification(record.params.eposta, record.params.ad, {
                                    orderNumber: record.params.siparisNumarasi,
                                    kargoFirmasi,
                                    kargoTakipNo,
                                    trackingToken: record.params.takipTokeni
                                });
                                console.log(`[Email] Sipariş ${record.params.siparisNumarasi} için kargo maili gönderildi.`);
                            } catch (mailError) {
                                console.error(`[Email Hata] Kargo maili gönderilemedi: ${mailError.message}`);
                            }

                            return {
                                record: record.params, // record.toJSON gerek yok, raw params dönebiliriz veya context.record varsa onu
                                redirectUrl: `/admin/resources/Siparis/records/${record.params.id}/show`,
                                notice: {
                                    message: 'Sipariş kargolandı ve müşteriye bildirim e-postası gönderildi.',
                                    type: 'success',
                                },
                            };
                        } catch (error) {
                            console.error('Kargola Error:', error);
                            return returnError(error.message);
                        }
                    }
                    return { record: record ? record.toJSON(currentAdmin) : {} };
                },
                component: Components.KargolaAction,
            },
            teslimEt: {
                actionType: 'record',
                icon: 'CheckCircle',
                label: 'Teslim Et ✅',
                handler: async (request, response, context) => {
                    const { record, currentAdmin } = context;
                    try {
                        await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'TESLIM_EDILDI', teslimTarihi: new Date() } });
                        await prisma.siparisGecmisi.create({
                            data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'TESLIM_EDILDI', islemYapan: 'Admin', not: 'Sipariş teslim edildi.' }
                        });

                        try {
                            const fullOrder = await prisma.siparis.findUnique({ where: { id: record.params.id } });
                            await emailService.sendDeliveryNotification(fullOrder.eposta, fullOrder.ad, {
                                orderNumber: fullOrder.siparisNumarasi,
                                trackingToken: fullOrder.takipTokeni
                            });
                            console.log(`[Email] Sipariş ${fullOrder.siparisNumarasi} için teslimat maili gönderildi.`);
                        } catch (mailError) {
                            console.error(`[Email Hata] Teslimat maili gönderilemedi: ${mailError.message}`);
                        }

                        return {
                            record: record.toJSON(currentAdmin),
                            notice: { message: 'Sipariş teslim edildi.', type: 'success' },
                            redirectUrl: `/admin/resources/Siparis/records/${record.params.id}/show`
                        };
                    } catch (error) {
                        console.error('Teslim Et Error:', error);
                        return { record: record.toJSON(currentAdmin), notice: { message: 'Hata: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            /*
            faturaKes: {
                actionType: 'record',
                icon: 'FileText',
                label: 'Fatura Kes 🧾',
                showInDrawer: true,
                handler: async (request, response, context) => {
                    const { record, h, currentAdmin } = context;

                    if (request.method === 'post') {
                        const { faturaNo } = request.payload;
                        try {
                            await prisma.siparis.update({
                                where: { id: record.params.id },
                                data: {
                                    faturaDurumu: 'DUZENLENDI',
                                    faturaNo: faturaNo || 'Girilmedi',
                                    faturaTarihi: new Date()
                                }
                            });

                            // Email bildirimi eklenebilir

                            return {
                                record: record.toJSON(currentAdmin),
                                redirectUrl: h.resourceActionUrl({ resourceId: 'Siparis', actionName: 'list' }),
                                notice: { message: 'Fatura başarıyla işlendi!', type: 'success' }
                            };
                        } catch (error) {
                            console.error('Fatura Kes Error:', error);
                            return { record: record.toJSON(currentAdmin), notice: { message: 'Hata: ' + error.message, type: 'error' } };
                        }
                    }
                    return { record: record.toJSON(currentAdmin) };
                },
                params: {
                    faturaNo: {
                        type: 'string',
                        label: 'Fatura Numarası (Opsiyonel)',
                        helpText: 'E-fatura entegratöründen aldığınız numarayı buraya girebilirsiniz.',
                    },
                }
            },
            */

            /*
            faturaDuzenle: {
                actionType: 'record',
                icon: 'FileText',
                label: 'Fatura Düzenle 📝',
                handler: async (request, response, context) => {
                    const { record, currentAdmin } = context;
                    try {
                        await prisma.siparis.update({ where: { id: record.params.id }, data: { faturaDurumu: 'DUZENLENDI' } });
                        await prisma.siparisGecmisi.create({
                            data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: record.params.durum, islemYapan: 'Admin', not: 'Fatura düzenlendi.' }
                        });
                        return { record: record.toJSON(currentAdmin), notice: { message: 'Fatura düzenlendi olarak işaretlendi.', type: 'success' } };
                    } catch (error) {
                        console.error('Fatura Düzenle Error:', error);
                        return { record: record.toJSON(currentAdmin), notice: { message: 'Hata: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            */
            iptalEt: {
                actionType: 'record',
                icon: 'XCircle',
                label: 'İptal Et ve İade Yap 💸',
                component: Components.IptalEtAction,
                handler: async (request, response, context) => {
                    const { record, currentAdmin } = context;
                    try {
                        console.log('--- IPTAL ET HANDLER STARTED ---');
                        console.log('Request Method:', request.method);

                        if (request.method === 'post') {
                            const { iptalNotu } = request.payload;
                            console.log('Processing IptalEt with note:', iptalNotu);

                            const siparis = await prisma.siparis.findUnique({ where: { id: record.params.id } });

                            if (!siparis) {
                                throw new Error('Sipariş bulunamadı.');
                            }

                            let noticeMessage = 'Sipariş iptal edildi.';
                            let operationNote = `Sipariş iptal edildi. ${iptalNotu ? `(Not: ${iptalNotu})` : ''}`;

                            // Ödeme Başarılıysa İptal Yap
                            if (siparis.odemeDurumu === 'SUCCESS' && siparis.odemeId) {
                                try {
                                    await paramService.cancelPayment(siparis.odemeId);
                                    await prisma.siparis.update({
                                        where: { id: record.params.id },
                                        data: {
                                            durum: 'IPTAL_EDILDI',
                                            odemeDurumu: 'IADE_EDILDI'
                                        }
                                    });
                                    noticeMessage = 'Sipariş iptal edildi ve ödeme iadesi (IPTAL) yapıldı.';
                                    operationNote = `Sipariş iptal edildi ve Param iptali yapıldı. ${iptalNotu ? `(Not: ${iptalNotu})` : ''}`;
                                } catch (paramError) {
                                    console.error('Param İptal Hatası:', paramError);
                                    await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'IPTAL_EDILDI' } });
                                    operationNote = `Sipariş iptal edildi ancak Param iptali başarısız: ${paramError.message}`;
                                    throw new Error(`İptal edildi ANCAK ödeme iptali yapılamadı: ${paramError.message}`);
                                }
                            } else {
                                await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'IPTAL_EDILDI' } });
                                noticeMessage = 'Sipariş iptal edildi. (Ödeme iadesi gerekmedi)';
                            }

                            await prisma.siparisGecmisi.create({
                                data: {
                                    siparisId: record.params.id,
                                    eskiDurum: record.params.durum,
                                    yeniDurum: 'IPTAL_EDILDI',
                                    islemYapan: 'Admin',
                                    not: operationNote
                                }
                            });

                            // İptal Maili Gönder
                            try {
                                await emailService.sendCancellationNotification(record.params.eposta, record.params.ad, {
                                    orderNumber: record.params.siparisNumarasi,
                                    refundStatus: siparis.odemeDurumu === 'SUCCESS' && siparis.odemeId ? 'SUCCESS' : 'NONE',
                                    cancelReason: iptalNotu,
                                    trackingToken: siparis.takipTokeni
                                });
                                console.log(`[Email] Sipariş ${record.params.siparisNumarasi} için iptal maili gönderildi.`);
                            } catch (mailError) {
                                console.error(`[Email Hata] İptal maili gönderilemedi: ${mailError.message}`);
                            }

                            return {
                                record: record.toJSON(currentAdmin),
                                notice: { message: noticeMessage, type: 'success' },
                                redirectUrl: `/admin/resources/Siparis/records/${record.params.id}/show`
                            };
                        }
                        // GET isteği gelirse (component açıldığında)
                        return { record: record.toJSON(currentAdmin) };
                    } catch (error) {
                        console.error('İptal Et Error:', error);
                        return { record: record.toJSON(currentAdmin), notice: { message: 'Hata: ' + error.message, type: 'error' } };
                    }
                },
            },
            delete: { isVisible: false },
            bulkDelete: { isVisible: false },

            // --- BULK ACTIONS ---
            /*
            bulkFaturaDuzenle: {
                actionType: 'bulk',
                icon: 'FileText',
                label: 'Seçilenlere Fatura Kes',
                handler: async (request, response, context) => {
                    const { records, currentAdmin } = context;
                    try {
                        for (const record of records) {
                            await prisma.siparis.update({ where: { id: record.params.id }, data: { faturaDurumu: 'DUZENLENDI' } });
                            await prisma.siparisGecmisi.create({
                                data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: record.params.durum, islemYapan: 'Admin', not: 'Toplu işlem ile fatura düzenlendi.' }
                            });
                        }
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: `${records.length} sipariş için fatura düzenlendi.`, type: 'success' } };
                    } catch (error) {
                        console.error('Bulk Fatura Düzenle Error:', error);
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: 'Bir hata oluştu: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            */
            bulkHazirla: {
                actionType: 'bulk',
                icon: 'Package',
                label: 'Seçilenleri Hazırla',
                handler: async (request, response, context) => {
                    const { records, currentAdmin } = context;
                    try {
                        for (const record of records) {
                            await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'HAZIRLANIYOR' } });
                            await prisma.siparisGecmisi.create({
                                data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'HAZIRLANIYOR', islemYapan: 'Admin', not: 'Toplu işlem ile hazırlanıyor.' }
                            });
                        }
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: `${records.length} sipariş hazırlanıyor durumuna getirildi.`, type: 'success' } };
                    } catch (error) {
                        console.error('Bulk Hazırla Error:', error);
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: 'Bir hata oluştu: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            bulkKargola: {
                actionType: 'bulk',
                icon: 'Truck',
                label: 'Seçilenleri Kargola',
                handler: async (request, response, context) => {
                    const { records, currentAdmin } = context;
                    try {
                        for (const record of records) {
                            await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'KARGOLANDI' } });
                            await prisma.siparisGecmisi.create({
                                data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'KARGOLANDI', islemYapan: 'Admin', not: 'Toplu işlem ile kargolandı. (Takip No Girilmedi)' }
                            });
                        }
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: `${records.length} sipariş kargolandı durumuna getirildi.`, type: 'success' } };
                    } catch (error) {
                        console.error('Bulk Kargola Error:', error);
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: 'Bir hata oluştu: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            bulkTeslimEt: {
                actionType: 'bulk',
                icon: 'CheckCircle',
                label: 'Seçilenleri Teslim Et',
                handler: async (request, response, context) => {
                    const { records, currentAdmin } = context;
                    try {
                        for (const record of records) {
                            await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'TESLIM_EDILDI' } });
                            await prisma.siparisGecmisi.create({
                                data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'TESLIM_EDILDI', islemYapan: 'Admin', not: 'Toplu işlem ile teslim edildi.' }
                            });
                        }
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: `${records.length} sipariş teslim edildi durumuna getirildi.`, type: 'success' } };
                    } catch (error) {
                        console.error('Bulk Teslim Et Error:', error);
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: 'Bir hata oluştu: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },
            bulkIptalEt: {
                actionType: 'bulk',
                icon: 'XCircle',
                label: 'Seçilenleri İptal Et',
                variant: 'danger',
                handler: async (request, response, context) => {
                    const { records, currentAdmin } = context;
                    try {
                        for (const record of records) {
                            await prisma.siparis.update({ where: { id: record.params.id }, data: { durum: 'IPTAL_EDILDI' } });
                            await prisma.siparisGecmisi.create({
                                data: { siparisId: record.params.id, eskiDurum: record.params.durum, yeniDurum: 'IPTAL_EDILDI', islemYapan: 'Admin', not: 'Toplu işlem ile iptal edildi.' }
                            });
                        }
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: `${records.length} sipariş iptal edildi.`, type: 'success' } };
                    } catch (error) {
                        console.error('Bulk İptal Et Error:', error);
                        return { records: records.map(r => r.toJSON(currentAdmin)), notice: { message: 'Bir hata oluştu: ' + error.message, type: 'error' } };
                    }
                },
                component: false,
            },

            edit: {
                label: 'Düzenle',
                before: async (request, context) => {
                    if (request.params.recordId) {
                        try {
                            const initialRecord = await prisma.siparis.findUnique({
                                where: { id: request.params.recordId }
                            });
                            context.initialRecord = initialRecord;
                        } catch (error) {
                            console.error('Error fetching initial record:', error);
                        }
                    }
                    return request;
                },
                after: async (response, request, context) => {
                    const { record, initialRecord } = context;
                    if (request.method === 'post' && initialRecord && initialRecord.durum !== record.params.durum) {
                        await prisma.siparisGecmisi.create({
                            data: {
                                siparisId: record.params.id,
                                eskiDurum: initialRecord.durum,
                                yeniDurum: record.params.durum,
                                islemYapan: 'Admin',
                                not: 'Admin panelinden durum güncellendi.'
                            }
                        });
                    }
                    return response;
                }
            },
            show: {
                label: 'Detay',
                component: Components.OrderShow,
                after: async (response, request, context) => {
                    const { record } = response;
                    try {
                        const items = await prisma.siparisKalemi.findMany({
                            where: { siparisId: record.params.id },
                            include: { urun: true }
                        });

                        let totalDesi = 0;
                        items.forEach(item => {
                            const itemDesi = item.urun ? Number(item.urun.desi) : 1;
                            totalDesi += itemDesi * item.adet;
                        });

                        const settings = await prisma.sistemAyarlari.findUnique({ where: { id: 'global-settings' } });

                        record.params.ui_items = JSON.stringify(items);
                        record.params.ui_totalDesi = totalDesi;
                        if (settings) {
                            record.params.ui_settings = JSON.stringify(settings);
                        }
                    } catch (error) {
                        console.error('Error fetching items for show view:', error);
                    }
                    return response;
                }
            },

        }
    }
});

