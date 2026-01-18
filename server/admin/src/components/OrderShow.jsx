import React from 'react';
import { Box, H3, H4, Text, Badge, Table, TableHead, TableBody, TableRow, TableCell, Label, Button } from '@adminjs/design-system';
import { ComponentLoader } from 'adminjs';

const OrderShow = (props) => {
    const { record } = props;
    const { params } = record;

    // Items are passed from the backend in 'ui_items' param as a JSON string
    let items = [];
    try {
        items = params.ui_items ? JSON.parse(params.ui_items) : [];
    } catch (e) {
        console.error('Error parsing items:', e);
    }

    const formatCurrency = (val) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);
    const formatDate = (date) => new Date(date).toLocaleString('tr-TR');

    const statusColors = {
        'TESLIM_EDILDI': 'success',
        'TAMAMLANDI': 'success',
        'IPTAL_EDILDI': 'danger',
        'IADE_EDILDI': 'danger',
        'HAZIRLANIYOR': 'warning',
        'IADE_TALEP_EDILDI': 'warning',
        'KARGOLANDI': 'info',
        'BEKLEMEDE': 'light',
    };

    const invoiceColors = {
        'DUZENLENDI': 'info',
        'ODENDI': 'success',
        'DUZENLENMEDI': 'light',
    };

    return (
        <Box>
            <Box flex flexDirection={['column', 'row']} mb="xl">
                {/* Sol Kolon: Sipariş Bilgileri, Müşteri, Kargo */}
                <Box width={[1, 1, 1 / 3]} mr={[0, 0, 'xl']}>

                    {/* Özet Kart */}
                    <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H3 mb="lg">Sipariş #{params.siparisNumarasi}</H3>
                        <Box mb="lg">
                            <Label>Oluşturulma Tarihi</Label>
                            <Text>{formatDate(params.olusturulmaTarihi)}</Text>
                        </Box>
                        <Box mb="lg">
                            <Label>Durum</Label>
                            <Badge variant={statusColors[params.durum] || 'default'}>{params.durum}</Badge>
                        </Box>
                        <Box mb="lg">
                            <Label>Fatura Durumu</Label>
                            <Badge variant={invoiceColors[params.faturaDurumu] || 'default'}>{params.faturaDurumu}</Badge>
                        </Box>
                        <Box mb="lg">
                            <Label>Ödeme Durumu</Label>
                            <Badge variant={params.odemeDurumu === 'SUCCESS' ? 'success' : 'danger'}>{params.odemeDurumu}</Badge>
                        </Box>
                    </Box>

                    {/* Müşteri Bilgileri */}
                    <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H4 mb="md">👤 Müşteri Bilgileri</H4>
                        <Box mb="md">
                            <Text fontWeight="bold">{params.ad} {params.soyad}</Text>
                            <Text variant="sm" color="grey60">{params.eposta}</Text>
                            <Text variant="sm" color="grey60">{params.telefon}</Text>
                        </Box>
                        <Label>Teslimat Adresi</Label>
                        <Text>{params.adres}</Text>
                        <Text>{params.ilce} / {params.sehir}</Text>
                        <Text>{params.postaKodu}</Text>
                    </Box>

                    {/* Kargo Bilgileri */}
                    <Box bg="white" p="xl" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H4 mb="md">🚚 Kargo Bilgileri</H4>
                        {params.kargoFirmasi ? (
                            <Box>
                                <Box mb="sm">
                                    <Label>Firma</Label>
                                    <Text>{params.kargoFirmasi}</Text>
                                </Box>
                                <Box>
                                    <Label>Takip No</Label>
                                    <Text fontFamily="monospace" bg="grey20" p="xs">{params.kargoTakipNo}</Text>
                                </Box>
                            </Box>
                        ) : (
                            <Text color="grey60" fontStyle="italic">Kargo bilgisi girilmemiş.</Text>
                        )}
                    </Box>

                </Box>

                {/* Sağ Kolon: Ürünler ve Özet */}
                <Box width={[1, 1, 2 / 3]}>
                    <Box bg="white" p="xl" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H4 mb="lg">📦 Sipariş İçeriği</H4>

                        {items.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ürün</TableCell>
                                        <TableCell>Birim Fiyat</TableCell>
                                        <TableCell>Adet</TableCell>
                                        <TableCell>Toplam</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Text fontWeight="bold">{item.urunAdSnapshot}</Text>
                                                <Text variant="caption" color="grey60">ID: {item.urunId}</Text>
                                            </TableCell>
                                            <TableCell>{formatCurrency(item.urunFiyatSnapshot)}</TableCell>
                                            <TableCell><Badge>{item.adet}</Badge></TableCell>
                                            <TableCell>{formatCurrency(item.toplamFiyat)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Text color="grey60" textAlign="center" py="xl">Ürün bilgisi bulunamadı.</Text>
                        )}


                        {/* Finansal Özet */}
                        <Box mt="xl" pt="lg" borderTop="1px solid" borderColor="grey20">
                            {/* Desi ve Kargo Bilgisi */}
                            <Box display="flex" justifyContent="space-between" mb="sm">
                                <Text color="grey60">Toplam Desi:</Text>
                                <Text>{params.ui_totalDesi ? Number(params.ui_totalDesi).toFixed(2) : '0.00'}</Text>
                            </Box>

                            <Box display="flex" justifyContent="space-between" mb="sm">
                                <Text>Kargo Ücreti:</Text>
                                <Text>{formatCurrency(params.kargoUcreti)}</Text>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <H4>Toplam Tutar:</H4>
                                <H4>{formatCurrency(params.toplamTutar)}</H4>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderShow;
