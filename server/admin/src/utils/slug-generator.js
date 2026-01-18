import slugify from 'slugify';

/**
 * @module slug-generator
 * @description Utility module for generating URL-friendly slugs from Turkish text.
 * Follows Single Responsibility Principle - only handles slug generation.
 */

/**
 * Generates a URL-friendly slug from the given text.
 * Handles Turkish characters and ensures lowercase output.
 * 
 * @param {string} text - The input text to convert to a slug
 * @param {Object} [options] - Optional configuration
 * @param {boolean} [options.lower=true] - Convert to lowercase
 * @param {boolean} [options.strict=true] - Strip special characters
 * @param {string} [options.locale='tr'] - Locale for character handling
 * @returns {string} The generated slug
 * 
 * @example
 * generateSlug('Hırdavat Malzemeleri') // Returns: 'hirdavat-malzemeleri'
 * generateSlug('Vida & Somun') // Returns: 'vida-somun'
 */
export const generateSlug = (text, options = {}) => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const defaultOptions = {
        lower: true,
        strict: true,
        locale: 'tr'
    };

    return slugify(text, { ...defaultOptions, ...options });
};

/**
 * Creates an AdminJS before hook that automatically generates a slug
 * from a specified source field.
 * 
 * @param {string} sourceField - The field name to generate slug from (e.g., 'ad')
 * @param {string} [targetField='slug'] - The field name to store the slug
 * @returns {Function} AdminJS before hook function
 * 
 * @example
 * // In resource options:
 * actions: {
 *   new: { before: [createSlugHook('ad')] },
 *   edit: { before: [createSlugHook('ad')] }
 * }
 */
export const createSlugHook = (sourceField, targetField = 'slug') => {
    return async (request) => {
        if (request.payload && request.payload[sourceField]) {
            request.payload[targetField] = generateSlug(request.payload[sourceField]);
        }
        return request;
    };
};
