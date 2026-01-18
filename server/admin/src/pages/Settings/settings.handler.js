/**
 * Handler for Settings Page
 */
export const settingsHandler = async (request, response, context) => {
    const prisma = context.prisma || context._admin.options.databases[0];
    const method = request.method.toLowerCase();

    console.log(`SettingsHandler: ${method} request received.`);

    if (method === 'get') {
        try {
            const settings = await prisma.sistemAyarlari.upsert({
                where: { id: 'global-settings' },
                update: {},
                create: {
                    id: 'global-settings',
                    ucretsizKargoAltLimit: 5000.00,
                    kargoFiyatListesi: [],
                    maintenanceMode: false
                }
            });

            return {
                siteTitle: 'Nalbur Deposu',
                companyName: process.env.COMPANY_NAME || 'Nalbur Deposu Inc.',
                currency: 'TRY',
                maintenanceMode: settings.maintenanceMode || false,
                // DB Params
                ucretsizKargoAltLimit: Number(settings.ucretsizKargoAltLimit),
                kargoFiyatListesi: settings.kargoFiyatListesi || []
            };
        } catch (error) {
            console.error('Settings Fetch Error:', error);
            return {
                siteTitle: 'Nalbur Deposu',
                companyName: 'Nalbur Deposu.',
                currency: 'TRY',
                maintenanceMode: false,
                ucretsizKargoAltLimit: 5000,
                kargoFiyatListesi: []
            };
        }
    }

    if (method === 'post') {
        const payload = request.payload || {};
        console.log('SettingsHandler: Saving payload:', payload);

        try {
            const updateData = {
                ucretsizKargoAltLimit: payload.ucretsizKargoAltLimit ? parseFloat(payload.ucretsizKargoAltLimit) : 5000.00,
                kargoFiyatListesi: payload.kargoFiyatListesi || [],
                maintenanceMode: payload.maintenanceMode === true || payload.maintenanceMode === 'true'
            };

            await prisma.sistemAyarlari.update({
                where: { id: 'global-settings' },
                data: updateData
            });

            return {
                status: 'success',
                message: 'Ayarlar başarıyla güncellendi',
                data: updateData
            };
        } catch (error) {
            console.error('Settings Update Error:', error);
            throw new Error('Ayarlar güncellenirken hata oluştu: ' + error.message);
        }
    }

    return {};
};
