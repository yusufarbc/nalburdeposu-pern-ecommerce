import React, { useState, useEffect } from 'react';
import { Box, H2, H4, Text, Table, TableHead, TableBody, TableRow, TableCell, Badge } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getDashboard()
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Dashboard error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);

    if (loading) {
        return (
            <Box p="xl" bg="grey20" minHeight="100vh">
                <Text>Yükleniyor...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p="xl" bg="grey20" minHeight="100vh">
                <Text color="red">Hata: {error}</Text>
            </Box>
        );
    }

    return (
        <Box p="40px" bg="#f8f9fa" minHeight="100vh">
            <Box mb="xl">
                <H2>Yönetim Paneli</H2>
                <Text variant="sm" color="grey60">NalburDeposu İşletme Özeti</Text>
            </Box>

            {/* KPI Kartları - Tek Satır */}
            <Box
                display="grid"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}
                mb="40px"
            >
                {/* Bugün Ciro */}
                <Box bg="white" p="24px" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '4px solid #DFFF00' }}>
                    <Text variant="sm" color="grey100">BUGÜNÜN CİROSU</Text>
                    <H4>{formatCurrency(data?.sales?.todayTurnover)}</H4>
                </Box>

                {/* Aktif Siparis */}
                <Box bg="white" p="24px" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '4px solid #E60000' }}>
                    <Text variant="sm" color="grey100">AKTİF SİPARİŞ</Text>
                    <H4>{data?.kpi?.activeOrders || 0}</H4>
                </Box>

                {/* Toplam Müşteri - Stok Yerine Buraya Alındı */}
                <Box bg="white" p="24px" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '4px solid #8E8E8E' }}>
                    <Text variant="sm" color="grey100">TOPLAM MÜŞTERİ</Text>
                    <H4>{data?.kpi?.totalCustomers || 0}</H4>
                </Box>

                {/* Kargo Bekleyen - Alt Satırdan Yukarı Alındı */}
                <Box bg="white" p="24px" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '4px solid #0000FF' }}>
                    <Text variant="sm" color="grey100">KARGO BEKLEYEN</Text>
                    <H4>{data?.kpi?.pendingCargo || 0}</H4>
                </Box>
            </Box>

            {/* Aksiyon Kartları Bölümü Kaldırıldı, Kargo Yukarı Taşındı */}

            {/* Son Siparişler */}
            <Box bg="white" p="24px" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <H4 mb="lg">Son Gelen Siparişler</H4>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sipariş No</TableCell>
                            <TableCell>Müşteri</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Tutar</TableCell>
                            <TableCell>Durum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.recentOrders?.map(order => (
                            <TableRow key={order.id}>
                                <TableCell><Text color="primary100" fontWeight="bold">#{order.siparisNumarasi}</Text></TableCell>
                                <TableCell>{order.ad}</TableCell>
                                <TableCell>{new Date(order.olusturulmaTarihi).toLocaleDateString('tr-TR')}</TableCell>
                                <TableCell>{formatCurrency(order.toplamTutar)}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.durum === 'TESLIM_EDILDI' || order.durum === 'TAMAMLANDI' ? 'success' :
                                            order.durum === 'IPTAL_EDILDI' || order.durum === 'IADE_EDILDI' ? 'danger' :
                                                'info'
                                    }>{order.durum}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!data?.recentOrders || data.recentOrders.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5}><Text textAlign="center">Henüz sipariş yok.</Text></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default Dashboard;
