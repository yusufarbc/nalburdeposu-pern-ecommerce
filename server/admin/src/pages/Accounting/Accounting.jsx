import React, { useState, useEffect } from 'react';
import { Box, Header, Text, Loader, Badge } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const api = new ApiClient();

const StatCard = ({ title, value, subtext, color = 'primary' }) => (
    <Box variant="white" padding="xl" borderRadius="8px" boxShadow="card" flexGrow={1} marginRight="lg" marginBottom="lg">
        <Text variant="sm" color="grey60">{title}</Text>
        <Header.H3 marginTop="sm" color={color}>{value}</Header.H3>
        {subtext && <Text variant="xs" marginTop="xs">{subtext}</Text>}
    </Box>
);

const Accounting = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getPage({ pageName: 'Muhasebe' });
            setStats(response.data);
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    if (stats?.error) return <Box variant="danger">Hata: {stats.error}</Box>;

    const chartData = [
        {
            name: stats.lastMonth.label,
            Ciro: stats.lastMonth.revenue,
            Satis: stats.lastMonth.orders
        },
        {
            name: stats.currentMonth.label,
            Ciro: stats.currentMonth.revenue,
            Satis: stats.currentMonth.orders
        }
    ];

    const formatCurrency = (val) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

    return (
        <Box variant="grey" padding="lg">
            <Header.H2 marginBottom="xl">Muhasebe & İstatistikler</Header.H2>

            {/* Stat Cards Row */}
            <Box display="flex" flexWrap="wrap">
                <StatCard
                    title="Bu Ay Ciro"
                    value={formatCurrency(stats.currentMonth.revenue)}
                    subtext={`${stats.currentMonth.orders} Satış`}
                    color="primary"
                />
                <StatCard
                    title="Geçen Ay Ciro"
                    value={formatCurrency(stats.lastMonth.revenue)}
                    subtext={`${stats.lastMonth.orders} Satış`}
                    color="grey100" // visually distinct
                />
                <StatCard
                    title="Yıllık Toplam Ciro"
                    value={formatCurrency(stats.yearly.revenue)}
                    subtext={`${stats.yearly.orders} Satış`}
                    color="success"
                />
            </Box>

            {/* Chart Section */}
            <Box variant="white" padding="xl" borderRadius="8px" boxShadow="card" marginTop="lg">
                <Header.H3 marginBottom="lg">Aylık Karşılaştırma</Header.H3>
                <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="Ciro" fill="#8884d8" name="Ciro (₺)" />
                            <Bar yAxisId="right" dataKey="Satis" fill="#82ca9d" name="Satış Adedi" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default Accounting;
