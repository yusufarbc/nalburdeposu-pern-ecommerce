
import { getModelByName } from '@adminjs/prisma';
import { ParamAdminService } from '../services/param.service.js';
import { EmailAdminService } from '../services/email.service.js';
import { Components } from '../component-loader.js';

const paramService = new ParamAdminService();
const emailService = new EmailAdminService();

export const CreateIadeTalebiResource = (prisma) => {
    return {
        resource: { model: getModelByName('IadeTalebi'), client: prisma },
        options: {
            navigation: {
                name: 'Satış Yönetimi',
                icon: 'ShoppingBag',
            },
            sort: {
                sortBy: 'olusturulmaTarihi',
                direction: 'desc',
            },
            properties: {
                siparisId: { isVisible: false },
                durum: {
                    components: {
                        list: Components.ReturnStatusBadge,
                        show: Components.ReturnStatusBadge,
                    }
                },
                aciklama: { type: 'textarea', isResizable: true, label: 'İade Sebebi Açıklaması' },
                talepTipi: { isVisible: { list: true, filter: true, show: true, edit: true }, label: 'İade Tipi' },
                fotografUrls: {
                    type: 'string',
                    isArray: true,
                    components: {
                        list: (props) => {
                            return props.record.params.fotografUrls ? 'Fotoğraflar Var' : 'Yok';
                        }
                    }
                },
                manuelIadeKodu: {
                    description: 'Kargo firmasından aldığınız iade kodunu buraya giriniz.',
                }
            },
            listProperties: ['siparisId', 'talepTipi', 'durum', 'olusturulmaTarihi'],
            actions: {
                new: { isVisible: false },
                edit: { isVisible: true, label: 'Düzenle' },
                show: {
                    isVisible: true,
                    label: 'Detaylar',
                    component: Components.ReturnShow
                },
                list: { isVisible: true, label: 'Listele' },
                delete: { isVisible: false },

                approveReturn: {
                    actionType: 'record',
                    icon: 'Check',
                    label: 'İadeyi Onayla',
                    isVisible: (context) => ['ONAY_BEKLENIYOR', 'REDDEDILDI'].includes(context.record.params.durum),
                    component: Components.ApproveReturnAction,
                    handler: async (request, response, context) => {
                        const { record } = context;

                        // Only process on POST (submission)
                        if (request.method === 'post') {
                            const { manuelIadeKodu, kargoFirmasi, adminNotu } = request.payload || {};

                            if (!manuelIadeKodu || !kargoFirmasi) {
                                return {
                                    record: record.toJSON(context.currentAdmin),
                                    notice: { message: 'Lütfen İade Kodu ve Kargo Firması giriniz.', type: 'error' }
                                };
                            }

                            try {
                                // 1. Güncelle
                                const updatedReturn = await prisma.iadeTalebi.update({
                                    where: { id: record.params.id },
                                    data: {
                                        durum: 'MUSTERI_GONDERIMI_BEKLENIYOR',
                                        manuelIadeKodu,
                                        kargoFirmasi,
                                        adminNotu
                                    },
                                    include: { siparis: true }
                                });

                                // 2. Mail Gönder
                                await emailService.sendReturnApproved(updatedReturn.siparis.eposta, updatedReturn.siparis.ad, {
                                    orderNumber: updatedReturn.siparis.siparisNumarasi,
                                    returnCode: manuelIadeKodu,
                                    shippingCompany: kargoFirmasi,
                                    adminNote: adminNotu,
                                    trackingToken: updatedReturn.siparis.takipTokeni
                                });

                                return {
                                    record: record.toJSON(context.currentAdmin),
                                    notice: { message: 'İade onaylandı ve müşteriye kod gönderildi.', type: 'success' },
                                    redirectUrl: `/admin/resources/IadeTalebi/records/${record.params.id}/show`
                                };
                            } catch (error) {
                                console.error('Approve Return Error:', error);
                                return {
                                    record: record.toJSON(context.currentAdmin),
                                    notice: { message: 'Hata oluştu: ' + error.message, type: 'error' }
                                };
                            }
                        }

                        // For GET requests, just return the record
                        return { record: record.toJSON(context.currentAdmin) };
                    }
                },

                rejectReturn: {
                    actionType: 'record',
                    icon: 'X',
                    label: 'Talebi Reddet',
                    component: Components.RejectReturnAction,
                    isVisible: (context) => ['ONAY_BEKLENIYOR', 'MUSTERI_GONDERIMI_BEKLENIYOR'].includes(context.record.params.durum),
                    handler: async (request, response, context) => {
                        const { record } = context;

                        // POST isteği ile red nedeni alalım
                        if (request.method === 'post') {
                            const { adminNotu } = request.payload || {};

                            try {
                                const updatedReturn = await prisma.iadeTalebi.update({
                                    where: { id: record.params.id },
                                    data: {
                                        durum: 'REDDEDILDI',
                                        adminNotu: adminNotu // Red nedenini admin notu olarak kaydediyoruz
                                    },
                                    include: { siparis: true }
                                });

                                // Mail Gönder
                                await emailService.sendReturnRejected(updatedReturn.siparis.eposta, updatedReturn.siparis.ad, {
                                    orderNumber: updatedReturn.siparis.siparisNumarasi,
                                    rejectionReason: adminNotu,
                                    trackingToken: updatedReturn.siparis.takipTokeni
                                });

                                return {
                                    record: record.toJSON(context.currentAdmin),
                                    notice: { message: 'İade talebi reddedildi ve müşteriye bilgi verildi.', type: 'success' },
                                    redirectUrl: `/admin/resources/IadeTalebi/records/${record.params.id}/show`
                                };
                            } catch (error) {
                                return {
                                    record: record.toJSON(context.currentAdmin),
                                    notice: { message: 'Hata: ' + error.message, type: 'error' },
                                    redirectUrl: `/admin/resources/IadeTalebi/records/${record.params.id}/show`
                                };
                            }
                        }

                        // GET isteği (Form göstermek için)
                        return { record: record.toJSON(context.currentAdmin) };
                    }
                },

                completeReturn: {
                    actionType: 'record',
                    icon: 'CheckCircle',
                    label: 'İadeyi Tamamla (Ücret İadesi)',
                    isVisible: (context) => ['MUSTERI_GONDERIMI_BEKLENIYOR'].includes(context.record.params.durum),
                    component: false,
                    handler: async (request, response, context) => {
                        const { record } = context;

                        try {
                            // 1. Siparişi ve İadeyi Bul
                            const currentReturn = await prisma.iadeTalebi.findUnique({
                                where: { id: record.params.id },
                                include: { siparis: true }
                            });

                            if (!currentReturn) throw new Error('İade kaydı bulunamadı.');

                            let refundNote = 'İade tamamlandı.';
                            let noticeMessage = 'İade süreci tamamlandı ve müşteriye bilgi verildi.';
                            let noticeType = 'success';

                            // 2. Ödeme İadesi Dene (Varsa)
                            if (currentReturn.siparis.odemeId && currentReturn.siparis.odemeDurumu === 'SUCCESS') {
                                try {
                                    await paramService.refundPayment(currentReturn.siparis.odemeId, currentReturn.siparis.toplamTutar);
                                    refundNote += ' Ödeme iadesi yapıldı (Param).';
                                    noticeMessage += ' Ödeme iadesi Param üzerinden başarıyla gerçekleşti. 💸';
                                } catch (gwError) {
                                    console.error('Ödeme Gateway İade Hatası:', gwError);
                                    refundNote += ` Ödeme gateway iadesi BAŞARISIZ: ${gwError.message} (Manuel kontrol gerekir).`;
                                    noticeMessage += ` DİKKAT: Ödeme iadesi başarısız oldu (${gwError.message}). Lütfen panelden manuel kontrol edin! ⚠️`;
                                    noticeType = 'warning';
                                }
                            }

                            // 3. Durumları Güncelle
                            const updatedReturn = await prisma.iadeTalebi.update({
                                where: { id: record.params.id },
                                data: { durum: 'IADE_TAMAMLANDI' },
                                include: { siparis: true }
                            });

                            await prisma.siparis.update({
                                where: { id: currentReturn.siparisId },
                                data: {
                                    durum: 'IADE_EDILDI',
                                    odemeDurumu: 'IADE_EDILDI'
                                }
                            });

                            await prisma.siparisGecmisi.create({
                                data: {
                                    siparisId: currentReturn.siparisId,
                                    eskiDurum: currentReturn.siparis.durum,
                                    yeniDurum: 'IADE_EDILDI',
                                    islemYapan: 'Admin',
                                    not: refundNote
                                }
                            });

                            // 4. Mail Gönder
                            await emailService.sendReturnCompleted(updatedReturn.siparis.eposta, updatedReturn.siparis.ad, {
                                orderNumber: updatedReturn.siparis.siparisNumarasi,
                                trackingToken: updatedReturn.siparis.takipTokeni
                            });

                            return {
                                record: record.toJSON(context.currentAdmin),
                                notice: { message: noticeMessage, type: noticeType },
                                redirectUrl: `/admin/resources/IadeTalebi/records/${record.params.id}/show`
                            };

                        } catch (error) {
                            console.error('Complete Return Error:', error);
                            return {
                                record: record.toJSON(context.currentAdmin),
                                notice: { message: 'Hata: ' + error.message, type: 'error' },
                                redirectUrl: `/admin/resources/IadeTalebi/records/${record.params.id}/show`
                            };
                        }
                    }
                }
            }
        }
    };
};
