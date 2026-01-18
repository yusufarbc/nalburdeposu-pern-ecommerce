/**
 * @module marka.resource
 * @description AdminJS resource configuration for Brand (Marka) management.
 * Uses manual R2 upload in hooks instead of uploadFeature for reliability.
 */

import { getModelByName } from '@adminjs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { R2CustomProvider } from '../utils/r2-provider.js';
import { generateSlug } from '../utils/slug-generator.js';
import { getNextSequenceValue } from '../utils/auto-increment.js';
import { Components } from '../component-loader.js';

/**
 * Factory function to create the Marka (Brand) resource configuration.
 */
export const CreateMarkaResource = (prisma, componentLoader) => {

    // Shared R2 provider instance
    const r2Provider = new R2CustomProvider();

    /**
     * Before hook - handles slug generation and auto-increment.
     * Also extracts image file for processing in after hook.
     */
    const beforeHook = async (request, context) => {
        console.log('[Marka] Before hook triggered');
        console.log('[Marka] Payload keys:', Object.keys(request.payload || {}));
        console.log('[Marka] Files keys:', Object.keys(request.files || {}));

        // Extract logo file for after hook processing
        let logoFile = null;

        // Check in request.files first
        if (request.files && request.files.logoFile) {
            logoFile = request.files.logoFile;
            console.log('[Marka] Found logoFile in files:', logoFile.name);
        }

        // Also check payload
        if (request.payload && request.payload.logoFile) {
            if (typeof request.payload.logoFile === 'object' && request.payload.logoFile.path) {
                logoFile = request.payload.logoFile;
                console.log('[Marka] Found logoFile in payload:', logoFile.name);
            }
            // Remove from payload to avoid Prisma error
            delete request.payload.logoFile;
        }

        // Store in context for after hook
        if (logoFile) {
            context.logoFile = logoFile;
        }

        // Slug generation
        if (request.payload && request.payload.ad) {
            request.payload.slug = generateSlug(request.payload.ad);
        }

        // Auto-increment sira for new records
        if (request.method === 'post' && !request.params.recordId) {
            if (!request.payload.sira) {
                request.payload.sira = await getNextSequenceValue(prisma, 'marka', 'sira');
            }
        }

        return request;
    };

    /**
     * After hook - uploads image to R2 and updates record with URL.
     */
    const afterHook = async (response, request, context) => {
        console.log('[Marka] After hook triggered');

        // Only process if we have a logo file and a successful record
        if (context.logoFile && response.record && response.record.params.id) {
            const file = context.logoFile;
            console.log('[Marka] Uploading logo to R2:', file.name);

            try {
                // Generate unique path
                const ext = file.name.split('.').pop() || 'webp';
                const key = `brands/logo_${uuidv4()}.${ext}`;

                // Upload to R2
                await r2Provider.upload(file, key);
                console.log('[Marka] R2 upload successful:', key);

                // Update record with logo URL
                await prisma.marka.update({
                    where: { id: response.record.params.id },
                    data: { logoUrl: key }
                });
                console.log('[Marka] Updated record with logoUrl:', key);

                // Update response record
                response.record.params.logoUrl = key;

            } catch (error) {
                console.error('[Marka] R2 upload failed:', error);
            }
        }

        return response;
    };

    return {
        resource: {
            model: getModelByName('Marka'),
            client: prisma
        },
        options: {
            navigation: {
                name: 'Katalog Yönetimi',
                icon: 'Tag',
            },
            properties: {
                id: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 0 },
                ad: { isTitle: true, isRequired: true, position: 1 },
                slug: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 2 },
                logoFile: {
                    isVisible: { list: false, show: false, edit: true, new: true, filter: false },
                    position: 3,
                    label: 'Marka Logosu',
                    components: {
                        edit: Components.ImageCrop,
                    }
                },
                logoUrl: {
                    isVisible: { list: true, show: true, edit: false, new: false, filter: false },
                    position: 4,
                    label: 'Logo'
                },
                aktif: { isVisible: { list: true, show: true, edit: true, filter: true }, position: 5, label: 'Aktif mi?' },

                sira: { isVisible: { list: true, show: true, edit: false, new: false, filter: true }, position: 6, label: 'Sıralama' },
                olusturulmaTarihi: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 7 },
                guncellenmeTarihi: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 8 },
                urunler: { isVisible: false },
            },
            actions: {
                new: { label: 'Yeni Marka', before: beforeHook, after: afterHook },
                edit: { label: 'Düzenle', before: beforeHook, after: afterHook },
                list: { label: 'Listele' },
                reorder: {
                    actionType: 'resource',
                    icon: 'Layers',
                    label: 'Sıralama',
                    component: Components.Reorder,
                    handler: async (request, response, context) => {
                        const { method, payload } = request;
                        if (method === 'post') {
                            const { items } = payload;
                            try {
                                await prisma.$transaction(
                                    items.map(item =>
                                        prisma.marka.update({
                                            where: { id: item.id },
                                            data: { sira: item.sira }
                                        })
                                    )
                                );
                                return { record: {}, msg: 'Sıralama güncellendi' };
                            } catch (error) {
                                console.error('[Marka Reorder] Error:', error);
                                throw new Error('Sıralama kaydedilemedi');
                            }
                        }
                        const brands = await prisma.marka.findMany({
                            orderBy: { sira: 'asc' },
                            select: { id: true, ad: true, sira: true }
                        });
                        return { data: brands };
                    }
                }
            }
        },
        // No features needed - we handle upload manually in hooks
        features: []
    };
};
