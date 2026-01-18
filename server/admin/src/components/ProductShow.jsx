import React from 'react';
import { Box, H3, H4, Text, Badge, Button, Icon, Table, TableHead, TableBody, TableRow, TableCell } from '@adminjs/design-system';
const ProductShow = (props) => {
    const { record, resource } = props;

    if (!record) return null;

    const { params } = record;

    // Helper to format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box>
            {/* Header / Actions */}
            <Box flex justifyContent="space-between" alignItems="center" mb="xl">
                <Box>
                    <H3>{params.ad || 'Ürün Detayı'}</H3>
                    <Text variant="sm" color="grey60">Ürün ID: <Badge variant="light">{params.id}</Badge></Text>
                </Box>
            </Box>

            {/* Main Content Grid */}
            <Box display="grid" gridTemplateColumns={['1fr', '1fr', '2fr 1fr']} gridGap="24px">

                {/* Left Column: MAIN INFO & IMAGE */}
                <Box>
                    {/* Basic Info Card */}
                    <Box bg="white" boxShadow="card" borderRadius="lg" p="xl" mb="xl">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb="lg">
                            <H4>Ürün Bilgileri</H4>
                            <Badge variant={params.aktif ? 'success' : 'danger'}>
                                {params.aktif ? 'AKTİF' : 'PASİF'}
                            </Badge>
                        </Box>

                        {/* Main Image Banner */}
                        {params.resimUrl && (
                            <Box mb="xl" borderRadius="md" overflow="hidden" border="1px solid #eee">
                                <img
                                    src={`https://cdn.nalburdeposu.com.tr/${params.resimUrl}`}
                                    alt={params.ad}
                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#f9f9f9' }}
                                />
                            </Box>
                        )}

                        <Box mb="lg">
                            <Text fontWeight="bold" color="grey80">Ürün Adı</Text>
                            <Text fontSize="lg">{params.ad}</Text>
                        </Box>

                        <Box mb="lg">
                            <Text fontWeight="bold" color="grey80">Slug (URL)</Text>
                            <Text fontFamily="monospace" bg="grey20" p="xs" display="inline-block" borderRadius="sm">
                                /{params.slug}
                            </Text>
                        </Box>

                        <Box mb="lg">
                            <Text fontWeight="bold" color="grey80">Açıklama</Text>
                            {params.aciklama ? (
                                <Box dangerouslySetInnerHTML={{ __html: params.aciklama }} p="md" bg="grey10" borderRadius="md" mt="sm" />
                            ) : (
                                <Text color="grey40" fontStyle="italic">Açıklama girilmemiş.</Text>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Right Column: PRICING, STOCK, META */}
                <Box>


                    {/* Pricing Card */}
                    <Box bg="white" boxShadow="card" borderRadius="lg" p="xl" mb="xl">
                        <H4 mb="lg">Fiyatlandırma</H4>

                        <Box mb="lg">
                            <Text fontWeight="bold" color="grey80">Satış Fiyatı</Text>
                            <H3 color="primary100">{formatCurrency(params.fiyat)}</H3>
                        </Box>

                        {params.indirimliFiyat && (
                            <Box mb="lg">
                                <Text fontWeight="bold" color="grey80">İndirimli Fiyat</Text>
                                <H3 color="success">{formatCurrency(params.indirimliFiyat)}</H3>
                                <Text variant="sm" color="grey60">
                                    {(100 - (Number(params.indirimliFiyat) / Number(params.fiyat) * 100)).toFixed(0)}% İndirim
                                </Text>
                            </Box>
                        )}
                    </Box>

                    {/* Meta / Details Card */}
                    <Box bg="white" boxShadow="card" borderRadius="lg" p="xl">
                        <H4 mb="lg">Diğer Detaylar</H4>

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Text fontWeight="bold">Desi (Kargo)</Text></TableCell>
                                    <TableCell>{params.desi || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Text fontWeight="bold">Oluşturulma</Text></TableCell>
                                    <TableCell>{formatDate(params.olusturulmaTarihi)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Text fontWeight="bold">Güncellenme</Text></TableCell>
                                    <TableCell>{formatDate(params.guncellenmeTarihi)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductShow;
