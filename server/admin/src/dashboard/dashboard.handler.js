/**
 * Dashboard için backend veri işleyicisi.
 * İstatistiksel verileri hesaplar ve frontend'e döner.
 * 
 * @param {import('adminjs').ActionRequest} request
 * @param {import('adminjs').ActionResponse} response
 * @param {import('adminjs').ActionContext} context
 */
export const dashboardHandler = async (request, response, context) => {
    const prisma = context.prisma || context._admin.options.databases[0];

    // 1. Total Stocks (Value & Count)
    // 1. Total Stocks (Value & Count) - Disabled (Stock field removed)
    const totalStockValue = 0;
    const totalStockCount = 0;

    // 2. Turnover & Order Counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Turnover (Today) - Only count orders with successful payment
    const todaySales = await prisma.siparis.aggregate({
        _sum: { toplamTutar: true },
        _count: { id: true },
        where: {
            olusturulmaTarihi: { gte: today },
            odemeDurumu: 'SUCCESS',
            durum: { notIn: ['IPTAL_EDILDI', 'IADE_EDILDI'] }
        }
    });

    // Total Revenue (All Time) - Only count orders with successful payment
    const totalRevenue = await prisma.siparis.aggregate({
        _sum: { toplamTutar: true },
        where: {
            odemeDurumu: 'SUCCESS',
            durum: { notIn: ['IPTAL_EDILDI', 'IADE_EDILDI'] }
        }
    });

    // Active Orders (Pending process)
    const activeOrdersCount = await prisma.siparis.count({
        where: { durum: { in: ['BEKLEMEDE', 'HAZIRLANIYOR', 'KARGOLANDI'] } }
    });

    // Pending Invoices (Not cancelled, Invoice not issued, Payment success)
    const pendingInvoicesCount = await prisma.siparis.count({
        where: { faturaDurumu: 'DUZENLENMEDI', durum: { notIn: ['IPTAL_EDILDI', 'IADE_EDILDI'] }, odemeDurumu: 'SUCCESS' }
    });

    // Pending Cargo (Preparing)
    const pendingCargoCount = await prisma.siparis.count({
        where: { durum: 'HAZIRLANIYOR', odemeDurumu: 'SUCCESS' }
    });

    // Total Customers (Unique Emails from Orders)
    const uniqueCustomers = await prisma.siparis.groupBy({
        by: ['eposta'],
        _count: { eposta: true }
    });
    const totalCustomers = uniqueCustomers.length;

    // 3. Sales Chart Data (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const last7DaysOrders = await prisma.siparis.findMany({
        where: {
            olusturulmaTarihi: { gte: sevenDaysAgo },
            odemeDurumu: 'SUCCESS',
            durum: { notIn: ['IPTAL_EDILDI', 'IADE_EDILDI'] }
        },
        select: { olusturulmaTarihi: true, toplamTutar: true }
    });

    // Bucket by day
    const chartMap = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        chartMap[dayStr] = 0;
    }

    last7DaysOrders.forEach(o => {
        const dayStr = new Date(o.olusturulmaTarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        if (chartMap[dayStr] !== undefined) {
            chartMap[dayStr] += Number(o.toplamTutar);
        }
    });

    // Convert to array and reverse to show oldest to newest
    const salesChartData = Object.keys(chartMap).map(key => ({
        date: key,
        amount: chartMap[key]
    })).reverse();


    // 4. Recent Orders
    const recentOrders = await prisma.siparis.findMany({
        take: 5,
        orderBy: { olusturulmaTarihi: 'desc' },
        select: { id: true, siparisNumarasi: true, ad: true, toplamTutar: true, durum: true, olusturulmaTarihi: true }
    });

    return {
        stock: { totalValue: totalStockValue, totalCount: totalStockCount },
        sales: { todayTurnover: Number(todaySales._sum.toplamTutar) || 0, todayCount: todaySales._count.id || 0 },
        kpi: {
            totalRevenue: Number(totalRevenue._sum.toplamTutar) || 0,
            activeOrders: activeOrdersCount,
            totalCustomers: totalCustomers,
            pendingInvoices: pendingInvoicesCount,
            pendingCargo: pendingCargoCount,
        },
        chart: salesChartData,
        recentOrders: recentOrders
    };
};
