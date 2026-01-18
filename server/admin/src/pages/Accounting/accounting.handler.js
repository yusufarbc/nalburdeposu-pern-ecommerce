/**
 * Handler for Accounting & Statistics Page
 */
export const accountingHandler = async (request, response, context) => {
    const { prisma } = context;
    const method = request.method.toLowerCase();

    if (method === 'get') {
        try {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            const yearStart = new Date(now.getFullYear(), 0, 1);
            const yearEnd = new Date(now.getFullYear() + 1, 0, 0);

            // Helper to calculate revenue
            const calculateRevenue = async (startDate, endDate) => {
                const result = await prisma.siparis.aggregate({
                    _sum: {
                        toplamTutar: true,
                        kargoUcreti: true
                    },
                    _count: {
                        id: true
                    },
                    where: {
                        olusturulmaTarihi: {
                            gte: startDate,
                            lte: endDate
                        },
                        // STRICT REVENUE CALCULATION
                        // Only count orders where payment was actually successful
                        odemeDurumu: 'SUCCESS',
                        // And exclude fully refunded/cancelled orders
                        NOT: [
                            { durum: 'IPTAL_EDILDI' },
                            { durum: 'IADE_EDILDI' }
                        ]
                    }
                });
                return {
                    revenue: Number(result._sum.toplamTutar) || 0,
                    count: result._count.id || 0
                };
            };

            const currentMonth = await calculateRevenue(currentMonthStart, currentMonthEnd);
            const lastMonth = await calculateRevenue(lastMonthStart, lastMonthEnd);
            const yearly = await calculateRevenue(yearStart, yearEnd);

            return {
                currentMonth: {
                    revenue: currentMonth.revenue,
                    orders: currentMonth.count,
                    label: now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })
                },
                lastMonth: {
                    revenue: lastMonth.revenue,
                    orders: lastMonth.count,
                    label: lastMonthStart.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })
                },
                yearly: {
                    revenue: yearly.revenue,
                    orders: yearly.count,
                    label: now.getFullYear().toString()
                }
            };
        } catch (error) {
            console.error('Accounting Fetch Error:', error);
            return {
                error: error.message
            };
        }
    }

    return {};
};
