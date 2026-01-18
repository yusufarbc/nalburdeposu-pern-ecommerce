/**
 * @module urun.resource
 * @description AdminJS resource configuration for Product (Ürün) management.
 * Uses manual R2 upload in hooks instead of uploadFeature for reliability.
 */

import { getModelByName } from '@adminjs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { R2CustomProvider } from '../utils/r2-provider.js';
import { generateSlug } from '../utils/slug-generator.js';
import { Components } from '../component-loader.js';

/**
 * Factory function to create the Urun (Product) resource configuration.
 */
export const CreateUrunResource = (prisma, componentLoader) => {

    // Shared R2 provider instance
    const r2Provider = new R2CustomProvider();

    /**
     * Before hook - handles slug generation and extracts image file.
     */
    const beforeHook = async (request, context) => {
        console.log('[Urun] Before hook triggered');
        console.log('[Urun] Payload keys:', Object.keys(request.payload || {}));
        console.log('[Urun] Files keys:', Object.keys(request.files || {}));

        // Extract image file for after hook processing
        let imageFile = null;

        // Check in request.files first
        if (request.files && request.files.imageFile) {
            imageFile = request.files.imageFile;
            console.log('[Urun] Found imageFile in files:', imageFile.name);
        }

        // Also check payload
        if (request.payload && request.payload.imageFile) {
            if (typeof request.payload.imageFile === 'object' && request.payload.imageFile.path) {
                imageFile = request.payload.imageFile;
                console.log('[Urun] Found imageFile in payload:', imageFile.name);
            }
            // Remove from payload to avoid Prisma error
            delete request.payload.imageFile;
        }

        // Store in context for after hook
        if (imageFile) {
            context.imageFile = imageFile;
        }



        // Slug generation
        if (request.payload && request.payload.ad) {
            request.payload.slug = generateSlug(request.payload.ad);
        }

        return request;
    };

    /**
     * After hook - uploads image to R2 and updates record with URL.
     */
    const afterHook = async (response, request, context) => {
        console.log('[Urun] After hook triggered');

        // Only process if we have an image file and a successful record
        if (context.imageFile && response.record && response.record.params.id) {
            const file = context.imageFile;
            console.log('[Urun] Uploading image to R2:', file.name);

            try {
                // Generate unique path
                const key = `products/${uuidv4()}_${file.name}`;

                // Upload to R2
                await r2Provider.upload(file, key);
                console.log('[Urun] R2 upload successful:', key);

                // Update record with image URL
                await prisma.urun.update({
                    where: { id: response.record.params.id },
                    data: { resimUrl: key }
                });
                console.log('[Urun] Updated record with resimUrl:', key);

                // Update response record
                response.record.params.resimUrl = key;

            } catch (error) {
                console.error('[Urun] R2 upload failed:', error);
            }
        }

        return response;
    };

    return {
        resource: {
            model: getModelByName('Urun'),
            client: prisma
        },
        options: {
            navigation: {
                name: 'Katalog Yönetimi',
                icon: 'Package',
            },
            properties: {
                // === BASIC INFO ===
                id: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 0 },
                ad: { isTitle: true, isRequired: true, position: 1, label: '📦 Ürün Adı' },
                marka: {
                    isVisible: { list: true, show: true, edit: true, new: true, filter: true },
                    position: 2,
                    label: '🏷️ Marka'
                },
                markaId: { isVisible: false },
                kategori: { isVisible: { list: true, show: true, edit: true, new: true, filter: true }, position: 3, label: '📂 Kategori' },
                kategoriId: { isVisible: false },

                // === PRICING & STOCK ===
                fiyat: { type: 'currency', props: { symbol: '₺' }, isRequired: true, position: 4, label: '💰 Fiyat' },
                indirimliFiyat: { type: 'currency', props: { symbol: '₺' }, position: 5, label: '🏷️ İndirimli Fiyat' },
                stokAdedi: {
                    type: 'number',
                    position: 6,
                    label: '📦 Stok Adedi',
                    isVisible: { list: true, show: true, edit: true, new: true, filter: true }
                },
                agirlik: { type: 'number', position: 7, label: '⚖️ Ağırlık (Kg)' },

                // === IMAGE ===
                imageFile: {
                    isRequired: false,
                    position: 8,
                    label: '📸 Ürün Görseli',
                    isVisible: { list: false, show: false, edit: true, new: true, filter: false },
                    components: {
                        edit: Components.ImageCrop
                    }
                },

                // === STATUS & FEATURES (Checkboxes grouped) ===
                aktif: {
                    type: 'boolean',
                    position: 9,
                    label: '✅ Aktif',
                    isVisible: { list: true, show: true, edit: true, new: true, filter: true }
                },
                oneCikan: {
                    type: 'boolean',
                    position: 10,
                    label: '⭐ Öne Çıkan',
                    isVisible: { list: true, show: true, edit: true, new: true, filter: true }
                },
                firsatUrunu: {
                    type: 'boolean',
                    position: 11,
                    label: '🔥 Fırsat',
                    isVisible: { list: true, show: true, edit: true, new: true, filter: true }
                },
                yeniUrun: {
                    type: 'boolean',
                    position: 12,
                    label: '✨ Yeni',
                    isVisible: { list: false, show: true, edit: true, new: true, filter: true }
                },
                cokSatanlar: {
                    type: 'boolean',
                    position: 13,
                    label: '🏆 Çok Satan',
                    isVisible: { list: false, show: true, edit: true, new: true, filter: true }
                },

                // === ANALYTICS (Read-only) ===
                goruntulemeSayisi: {
                    type: 'number',
                    position: 14,
                    label: '👁️ Görüntülenme',
                    isVisible: { list: false, show: true, edit: false, new: false, filter: false }
                },
                satisAdedi: {
                    type: 'number',
                    position: 15,
                    label: '📦 Satış Adedi',
                    isVisible: { list: false, show: true, edit: false, new: false, filter: false }
                },

                // === DESCRIPTION (Last) ===
                aciklama: {
                    type: 'richtext',
                    position: 16,
                    label: '📝 Ürün Açıklaması',
                    isVisible: { list: false, show: true, edit: true, new: true, filter: false }
                },

                // === SYSTEM FIELDS (Hidden/Auto) ===
                slug: { isVisible: { list: false, show: true, edit: false, new: false, filter: true }, position: 17 },
                olusturulmaTarihi: { isVisible: { list: true, show: true, edit: false, new: false, filter: true }, position: 18 },
                guncellenmeTarihi: { isVisible: { list: true, show: true, edit: false, new: false, filter: true }, position: 19 },
                resimler: { isVisible: { list: true, show: true, edit: false, new: false, filter: false }, position: 20 },
                siparisKalemleri: { isVisible: false },
                resimUrl: { isVisible: { list: true, show: true, edit: false, new: false, filter: false }, position: 21, label: 'Görsel' },
            },
            actions: {
                new: { label: 'Yeni Ürün', before: beforeHook, after: afterHook },
                edit: { label: 'Düzenle', before: beforeHook, after: afterHook },
                show: { label: 'Detay', component: Components.ProductShow },
                list: { label: 'Listele' }
            }
        },
        // No features needed - we handle upload manually in hooks
        features: []
    };
};
