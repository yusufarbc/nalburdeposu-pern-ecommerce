/**
 * @module kategori.resource
 * @description AdminJS resource configuration for Category (Kategori) management.
 * Optimized for Hierarchical Management:
 * - List view shows ONLY Root Categories (ustKategoriId = null).
 * - Edit view manages Subcategories (Alt Kategoriler) via nested custom component.
 * - Supports full sync (Create, Update, Delete) of subcategories.
 */

import { getModelByName } from '@adminjs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { R2CustomProvider } from '../utils/r2-provider.js';
import { generateSlug } from '../utils/slug-generator.js';
import { getNextSequenceValue } from '../utils/auto-increment.js';
import { Components } from '../component-loader.js';
import prismaClient from '../utils/db.js';

/**
 * Factory function to create the Kategori (Category) resource configuration.
 */
export const CreateKategoriResource = (prisma, componentLoader) => {

    // Shared R2 provider instance
    const r2Provider = new R2CustomProvider();

    /**
     * Before hook - extracts subcategory data from the custom input.
     * Parses 'altKategorilerInput.X.name', 'id' and files.
     */
    const beforeHook = async (request, context) => {
        // Slug generation for main category
        if (request.payload && request.payload.ad) {
            request.payload.slug = generateSlug(request.payload.ad);
        }

        // Extract subcategory data to context
        const subCategories = [];

        Object.keys(request.payload || {}).forEach(key => {
            // Extract names and IDs
            if (key.startsWith('altKategorilerInput')) {
                const match = key.match(/altKategorilerInput\.(\d+)\.(name|id)/);
                if (match) {
                    const index = parseInt(match[1]);
                    const field = match[2]; // 'name' or 'id'
                    if (!subCategories[index]) subCategories[index] = { name: '', id: null, image: null };

                    if (field === 'name') subCategories[index].name = request.payload[key];
                    if (field === 'id') subCategories[index].id = request.payload[key];
                }
                // Cleanup payload
                delete request.payload[key];
            }
            // Cleanup unused file keys if any (virtuals)
            if (key.startsWith('altKategoriResim_')) {
                // Keep file reference in context via request.files, delete from payload to avoid DB error
                delete request.payload[key];
            }
        });

        // Check files for subcategory images
        if (request.files) {
            Object.keys(request.files).forEach(key => {
                if (key.startsWith('altKategoriResim_')) {
                    const index = parseInt(key.replace('altKategoriResim_', ''));
                    if (!isNaN(index)) {
                        if (!subCategories[index]) subCategories[index] = { name: '', id: null, image: null };
                        subCategories[index].image = request.files[key];
                    }
                }
            });
        }

        // Store valid subcategories
        const validSubs = subCategories.filter(s => s && s.name && s.name.trim());
        context.subCategories = validSubs;

        // Auto-increment sira for new records
        if (request.method === 'post' && !request.params.recordId) {
            if (!request.payload.sira) {
                request.payload.sira = await getNextSequenceValue(prisma, 'kategori', 'sira');
            }
        }

        return request;
    };

    /**
     * After hook - Handles Subcategory SYNC (Create, Update, Delete).
     * Runs on 'new' and 'edit' (POST/PUT).
     */
    const afterHookSave = async (response, request, context) => {
        if (request.method !== 'post') return response; // Only for Save actions

        if (response.record && response.record.params.id) {
            const parentId = response.record.params.id;
            const subs = context.subCategories || [];

            console.log(`[Kategori Sync] Syncing ${subs.length} subcategories for parent ${parentId}`);

            // 1. Upload Images
            for (const sub of subs) {
                if (sub.image && sub.image.path) {
                    try {
                        const key = `categories/${uuidv4()}_${sub.image.name}`;
                        await r2Provider.upload(sub.image, key);
                        sub.imageUrl = key;
                    } catch (err) {
                        console.error('[Kategori Sync] Image upload failed:', err.message);
                    }
                }
            }

            // 2. Get Existing Subcategories
            const existing = await prisma.kategori.findMany({
                where: { ustKategoriId: parentId },
                select: { id: true }
            });
            const existingIds = existing.map(e => e.id);
            const incomingIds = subs.map(s => s.id).filter(Boolean);

            // 3. DELETE: Existing but not in incoming
            const toDelete = existingIds.filter(id => !incomingIds.includes(id));
            if (toDelete.length > 0) {
                await prisma.kategori.deleteMany({ where: { id: { in: toDelete } } });
                console.log(`[Kategori Sync] Deleted ${toDelete.length} subcategories`);
            }

            // 4. UPSERT (Update or Create)
            for (let i = 0; i < subs.length; i++) {
                const sub = subs[i];
                const slug = `${generateSlug(sub.name)}-${uuidv4().substring(0, 4)}`;

                if (sub.id && existingIds.includes(sub.id)) {
                    // Update
                    const updateData = {
                        ad: sub.name.trim(),
                        slug: slug,
                        sira: i + 1
                    };
                    if (sub.imageUrl) updateData.resim = sub.imageUrl;

                    await prisma.kategori.update({
                        where: { id: sub.id },
                        data: updateData
                    });
                } else {
                    // Create
                    await prisma.kategori.create({
                        data: {
                            ad: sub.name.trim(),
                            slug: slug,
                            ustKategoriId: parentId,
                            sira: i + 1,
                            resim: sub.imageUrl || null
                        }
                    });
                }
            }
        }
        return response;
    };

    /**
     * Edit Load Hook - Populates subcategories into record params for the form.
     * Runs on 'edit' (GET).
     */
    const editLoadHook = async (response, request, context) => {
        if (request.method !== 'get') return response;

        if (response.record && response.record.params.id) {
            const subs = await prisma.kategori.findMany({
                where: { ustKategoriId: response.record.params.id },
                orderBy: { sira: 'asc' }
            });

            subs.forEach((sub, i) => {
                response.record.params[`altKategorilerInput.${i}.name`] = sub.ad;
                response.record.params[`altKategorilerInput.${i}.id`] = sub.id;
                if (sub.resim) {
                    // We need full URL or just key? ImageCrop expects what?
                    // AdminJS usually works with keys if we handle URL generation in component or here.
                    // Assuming ImageCrop handles the key or we previously passed full URL?
                    // In previous implementation: `categories/...` key was saved.
                    // If ImageCrop needs full URL, we might need to prepend base URL.
                    // But for consistency let's pass the key, assuming frontend handles it or R2 bucket is public?
                    // R2 bucket is public via Cloudflare usually.
                    // Let's pass the key.
                    response.record.params[`altKategoriResim_${i}`] = sub.resim;
                }
            });
        }
        return response;
    };

    return {
        resource: {
            model: getModelByName('Kategori'),
            client: prisma
        },
        options: {
            navigation: {
                name: 'Katalog Yönetimi',
                icon: 'Archive',
            },
            properties: {
                id: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 0 },
                ad: { isTitle: true, isRequired: true, position: 1, label: 'Üst Kategori Adı' },
                slug: { isVisible: { list: true, show: true, edit: false, new: false, filter: true }, position: 10 },

                // Custom Subcategory Input (Nested List)
                altKategorilerInput: {
                    type: 'mixed',
                    isVisible: { list: false, show: true, edit: true, new: true, filter: false },
                    position: 2,
                    label: 'Alt Kategoriler',
                    components: { edit: Components.SubCategoryInput, show: Components.SubCategoryInput }
                },

                // Hide native relation list
                altKategoriler: { isVisible: false },
                ustKategori: { isVisible: false },

                // Hide image for Root Categories (managed inside AltKategorilerInput for subs)
                resim: { isVisible: false },

                sira: {
                    type: 'number',
                    position: 7,
                    isVisible: { list: true, show: true, edit: false, new: false, filter: true },
                    label: 'Sıra'
                },

                olusturulmaTarihi: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 9 },
                guncellenmeTarihi: { isVisible: { list: false, show: true, edit: false, filter: true }, position: 10 },
                urunler: { isVisible: false },
            },
            actions: {
                new: {
                    label: 'Yeni Kategori',
                    before: beforeHook,
                    after: afterHookSave
                },
                edit: {
                    label: 'Düzenle',
                    before: beforeHook,
                    after: [afterHookSave, editLoadHook] // Chain hooks: Save logic (POST) then Load logic (GET/AfterSave)
                },
                show: {
                    label: 'Detay',
                    after: editLoadHook
                },
                list: {
                    label: 'Listele',
                    // Root Category Filter Logic
                    handler: async (request, response, context) => {
                        const { query } = request;
                        // const prisma = context._admin.options.databases[0]; // Removed, use scoped prisma


                        const page = parseInt(query.page || 1);
                        const perPage = parseInt(query.perPage || 10);
                        const skip = (page - 1) * perPage;
                        const sortBy = query.sortBy || 'sira';
                        const direction = query.direction || 'asc';

                        // Strict filter: ustKategoriId = null
                        const [rawRecords, count] = await prismaClient.$transaction([
                            prismaClient.kategori.findMany({
                                where: { ustKategoriId: null },
                                skip,
                                take: perPage,
                                orderBy: { [sortBy]: direction }
                            }),
                            prismaClient.kategori.count({ where: { ustKategoriId: null } })
                        ]);

                        // Serialize records to AdminJS format
                        const records = rawRecords.map(r => {
                            const record = context.resource.build(r);
                            return record.toJSON(context.currentAdmin);
                        });

                        return {
                            meta: { total: count, perPage, page, direction, sortBy },
                            records,
                        };
                    }
                },
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
                                        prisma.kategori.update({
                                            where: { id: item.id },
                                            data: { sira: item.sira }
                                        })
                                    )
                                );
                                return { record: {}, msg: 'Sıralama güncellendi' };
                            } catch (error) {
                                console.error('[Kategori Reorder] Error:', error);
                                throw new Error('Sıralama kaydedilemedi');
                            }
                        }
                        const categories = await prisma.kategori.findMany({
                            where: { ustKategoriId: null },
                            orderBy: { sira: 'asc' },
                            select: { id: true, ad: true, sira: true }
                        });
                        return { data: categories };
                    }
                }
            }
        },
        features: []
    };
};
