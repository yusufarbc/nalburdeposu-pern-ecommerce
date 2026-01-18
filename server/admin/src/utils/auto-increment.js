/**
 * @module auto-increment
 * @description Utility module for auto-incrementing sequence fields (e.g., sira/order).
 * Follows Single Responsibility Principle - only handles sequence generation.
 */

/**
 * Gets the next value in a sequence for a given model and field.
 * Uses Prisma's aggregate function to find the maximum value and increment it.
 * 
 * @param {Object} prisma - Prisma client instance
 * @param {string} modelName - Name of the Prisma model (e.g., 'marka', 'kategori')
 * @param {string} [fieldName='sira'] - Name of the sequence field
 * @returns {Promise<number>} The next value in the sequence
 * 
 * @example
 * const nextSira = await getNextSequenceValue(prisma, 'marka');
 * // Returns: 1 if no records exist, or max(sira) + 1
 */
export const getNextSequenceValue = async (prisma, modelName, fieldName = 'sira') => {
    try {
        const model = prisma[modelName];
        if (!model) {
            console.error(`[AutoIncrement] Model '${modelName}' not found in Prisma client`);
            return 1;
        }

        const result = await model.aggregate({
            _max: { [fieldName]: true }
        });

        const currentMax = result._max[fieldName] || 0;
        return currentMax + 1;
    } catch (error) {
        console.error(`[AutoIncrement] Error getting next value for ${modelName}.${fieldName}:`, error);
        return 1;
    }
};

/**
 * Creates an AdminJS before hook that automatically sets the next sequence value
 * for a specified field when creating new records.
 * 
 * @param {Object} prisma - Prisma client instance
 * @param {string} modelName - Name of the Prisma model
 * @param {string} [fieldName='sira'] - Name of the sequence field
 * @returns {Function} AdminJS before hook function
 * 
 * @example
 * // In resource options:
 * const prisma = new PrismaClient();
 * actions: {
 *   new: { before: [createAutoIncrementHook(prisma, 'marka', 'sira')] }
 * }
 */
export const createAutoIncrementHook = (prisma, modelName, fieldName = 'sira') => {
    return async (request) => {
        // Only apply on new record creation (POST without recordId)
        if (request.method === 'post' && !request.params.recordId) {
            if (!request.payload[fieldName]) {
                request.payload[fieldName] = await getNextSequenceValue(prisma, modelName, fieldName);
            }
        }
        return request;
    };
};
