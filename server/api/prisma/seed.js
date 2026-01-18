import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.log('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
        return;
    }

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log(`Admin user created: ${adminEmail}`);
    } else {
        console.log('Admin user already exists.');
    }

    // Sistem Ayarlari Seed
    const settings = await prisma.sistemAyarlari.upsert({
        where: { id: 'global-settings' },
        update: {},
        create: {
            id: 'global-settings',
            kargoDesiCarpani: 15.00,
            ucretsizKargoAltLimit: 5000.00
        }
    });
    console.log('System settings seeded:', settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
