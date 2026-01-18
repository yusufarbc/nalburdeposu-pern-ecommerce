import { componentLoader, Components } from '../component-loader.js';
import { CreateUrunResource } from '../resources/urun.resource.js';
import { CreateKategoriResource } from '../resources/kategori.resource.js';
import { CreateSiparisResource } from '../resources/siparis.resource.js';
import { CreateSiparisGecmisiResource } from '../resources/siparis_gecmisi.resource.js';
import { CreateSiparisKalemiResource } from '../resources/siparis_kalemi.resource.js';
import { CreateUrunResimResource } from '../resources/urun_resim.resource.js';
import { CreateMarkaResource } from '../resources/marka.resource.js';
import { CreateSistemAyarlariResource } from '../resources/sistem_ayarlari.resource.js';
import { CreateIadeTalebiResource } from '../resources/iade.resource.js';
import { tr } from '../translations/tr.js';
import { dashboardHandler } from '../dashboard/dashboard.handler.js';
import { systemStatusHandler } from '../pages/SystemStatus/system.handler.js';
import { settingsHandler } from '../pages/Settings/settings.handler.js';
import { accountingHandler } from '../pages/Accounting/accounting.handler.js';
import fs from 'fs';

// Simple logo configuration using Caddy serving
const logoSrc = '/logo.png';

export const getAdminOptions = (prisma) => {
    return {
        componentLoader,
        dashboard: {
            component: Components.Dashboard,
            handler: async (request, response, context) => {
                return dashboardHandler(request, response, { ...context, prisma });
            },
        },
        pages: {
            'Sistem Durumu': {
                component: Components.SystemStatus,
                handler: systemStatusHandler,
            },
            'SistemAyarlari': {
                component: Components.Settings,
                handler: async (request, response, context) => {
                    return settingsHandler(request, response, { ...context, prisma });
                },
            },
            'Muhasebe': {
                component: Components.Accounting,
                handler: async (request, response, context) => {
                    return accountingHandler(request, response, { ...context, prisma });
                }
            }
        },
        resources: [
            CreateUrunResource(prisma, componentLoader),
            CreateKategoriResource(prisma, componentLoader),
            CreateSiparisResource(prisma),
            CreateSiparisKalemiResource(prisma),
            CreateSiparisGecmisiResource(prisma),
            CreateUrunResimResource(prisma, componentLoader),
            CreateMarkaResource(prisma, componentLoader),
            CreateIadeTalebiResource(prisma),
        ],
        rootPath: process.env.ADMIN_PATH || '/admin',
        loginPath: process.env.ADMIN_LOGIN_PATH || '/admin/login',
        branding: {
            companyName: process.env.COMPANY_NAME || 'NalburDeposu Yönetim',
            softwareBrothers: false,
            withMadeWithLove: false,
            logo: logoSrc,
            favicon: '/favicon.ico',
            theme: {
                colors: {
                    primary100: '#1A1A1A',
                    love: '#E60000',
                    warning: '#DFFF00',
                    grey100: '#8E8E8E',
                    grey80: '#A0A0A0',
                    grey60: '#C0C0C0',
                    grey40: '#E0E0E0',
                    grey20: '#F5F5F5',
                    white: '#FFFFFF',
                    bg: '#FFFFFF',
                }
            }
        },
        locale: tr
    };
};
