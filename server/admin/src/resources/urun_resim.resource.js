/**
 * @module urun_resim.resource
 * @description AdminJS resource configuration for Product Images.
 * Uses manual R2 upload in hooks.
 */

import { getModelByName } from '@adminjs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { R2CustomProvider } from '../utils/r2-provider.js';
import { Components } from '../component-loader.js';

/**
 * Factory function to create the UrunResim resource configuration.
 */
export const CreateUrunResimResource = (prisma, componentLoader) => {

    const r2Provider = new R2CustomProvider();

    const beforeHook = async (request, context) => {
        console.log('[UrunResim] Before hook triggered');

        // Extract file
        let imageFile = null;
        if (request.files && request.files.file) {
            imageFile = request.files.file;
        }
        if (request.payload && request.payload.file && typeof request.payload.file === 'object') {
            imageFile = request.payload.file;
            delete request.payload.file;
        }

        if (imageFile) {
            context.imageFile = imageFile;
        }

        return request;
    };

    const afterHook = async (response, request, context) => {
        console.log('[UrunResim] After hook triggered');

        if (context.imageFile && response.record && response.record.params.id) {
            const file = context.imageFile;

            try {
                const key = `products/gallery/img_${uuidv4()}.webp`;
                await r2Provider.upload(file, key);
                console.log('[UrunResim] R2 upload successful:', key);

                await prisma.urunResim.update({
                    where: { id: response.record.params.id },
                    data: { url: key }
                });

                response.record.params.url = key;
            } catch (error) {
                console.error('[UrunResim] R2 upload failed:', error);
            }
        }

        return response;
    };

    return {
        resource: {
            model: getModelByName('UrunResim'),
            client: prisma
        },
        options: {
            navigation: false,
            properties: {
                url: { isVisible: { list: true, show: true, edit: false, filter: false } },
                id: { isVisible: { list: false, show: true, edit: false, filter: true } },
                file: {
                    isVisible: { list: false, show: false, edit: true, new: true, filter: false },
                    components: { edit: Components.ImageCrop }
                },
                sira: { type: 'number' },
                urunId: { isVisible: { list: false, show: true, edit: true, filter: true } },
            },
            actions: {
                new: { before: beforeHook, after: afterHook },
                edit: { before: beforeHook, after: afterHook },
            }
        },
        features: []
    };
};
