import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client Örneği.
 * Veritabanı bağlantılarını yöneten tekil (singleton) nesne.
 */
const prisma = new PrismaClient();

export default prisma;
