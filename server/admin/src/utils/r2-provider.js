import { BaseProvider } from '@adminjs/upload';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

/**
 * @module r2-provider
 * @description Custom provider for uploading files to Cloudflare R2 storage.
 * Extends AdminJS BaseProvider to integrate with @adminjs/upload feature.
 * 
 * Environment Variables Required:
 * - R2_ENDPOINT: Cloudflare R2 endpoint URL
 * - R2_ACCESS_KEY: R2 access key ID
 * - R2_SECRET_KEY: R2 secret access key
 * - R2_BUCKET_NAME: Name of the R2 bucket
 * - CDN_URL: Public CDN URL for serving files
 */

/**
 * S3-compatible client configured for Cloudflare R2.
 * @type {S3Client}
 * @private
 */
const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    },
});

/**
 * R2 bucket name from environment variables.
 * @type {string}
 * @private
 */
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * Custom provider class for Cloudflare R2 storage.
 * Implements file upload, deletion, and URL generation.
 * 
 * @extends BaseProvider
 * @example
 * import { R2CustomProvider } from '../utils/r2-provider.js';
 * 
 * uploadFeature({
 *   provider: new R2CustomProvider(),
 *   // ... other options
 * })
 */
export class R2CustomProvider extends BaseProvider {
    /**
     * Creates a new R2CustomProvider instance.
     * Initializes the provider with the configured bucket name.
     */
    constructor() {
        super(BUCKET_NAME);
        console.log('[R2Provider] Initialized with bucket:', BUCKET_NAME);
    }

    /**
     * Uploads a file to R2 storage.
     * Automatically resizes images to 800x800 and converts to WebP format.
     * 
     * @param {Object} file - File object from AdminJS upload
     * @param {string} file.path - Local file path
     * @param {string} file.name - Original filename
     * @param {string} key - Storage key/path for the file
     * @returns {Promise<string>} The storage key of the uploaded file
     * @throws {Error} If file path is missing or upload fails
     * 
     * @example
     * const key = await provider.upload(file, 'products/image_123.webp');
     * // Returns: 'products/image_123.webp'
     */
    async upload(file, key) {
        console.log('[R2Provider] Uploading file:', file.name, 'with key:', key);

        // Use suggested key if provided and valid, otherwise generate one
        const standardName = key || `products/img_${uuidv4()}.webp`;
        console.log('[R2Provider] Final storage key:', standardName);

        // Process with Sharp (Resize + WebP conversion)
        let buffer;
        if (file.path) {
            buffer = await sharp(file.path)
                .resize(800, 800, {
                    fit: 'cover',
                    position: 'entropy'
                })
                .webp({ quality: 80 })
                .toBuffer();
        } else {
            throw new Error('[R2Provider] File path missing');
        }

        // Upload to R2
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: standardName,
            Body: buffer,
            ContentType: 'image/webp'
        };

        await r2.send(new PutObjectCommand(uploadParams));

        console.log('[R2Provider] Upload successful. Key saved:', standardName);
        return standardName;
    }

    /**
     * Deletes a file from R2 storage.
     * 
     * @param {string} key - Storage key/path of the file to delete
     * @param {string} [bucket] - Optional bucket name (uses default if not provided)
     * @returns {Promise<void>}
     * 
     * @example
     * await provider.delete('products/old_image.webp');
     */
    async delete(key, bucket) {
        try {
            console.log('[R2Provider] Deleting file:', key);
            await r2.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
            console.log('[R2Provider] Delete successful:', key);
        } catch (error) {
            console.error('[R2Provider] Error deleting file:', error);
        }
    }

    /**
     * Generates the public URL for a stored file.
     * 
     * @param {string} key - Storage key/path of the file
     * @param {string} [bucket] - Optional bucket name (unused, kept for interface compatibility)
     * @returns {Promise<string>} Public CDN URL for the file
     * 
     * @example
     * const url = await provider.path('products/image_123.webp');
     * // Returns: 'https://cdn.example.com/products/image_123.webp'
     */
    async path(key, bucket) {
        return `${process.env.CDN_URL}/${key}`;
    }
}
