import React from 'react';
import { Box, H3, H4, Text, Badge, Label, Table, TableHead, TableBody, TableRow, TableCell } from '@adminjs/design-system';

const ReturnShow = (props) => {
    const { record } = props;
    const { params } = record;

    const formatDate = (date) => new Date(date).toLocaleString('tr-TR');

    // Durum Rengi
    const getStatusVariant = (status) => {
        switch (status) {
            case 'ONAY_BEKLENIYOR': return 'danger'; // Kırmızı
            case 'MUSTERI_GONDERIMI_BEKLENIYOR': return 'warning'; // Sarı
            case 'IADE_TAMAMLANDI': return 'light'; // Soluk
            case 'REDDEDILDI': return 'default'; // Gri
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ONAY_BEKLENIYOR': return 'Onay Bekliyor ⏳';
            case 'MUSTERI_GONDERIMI_BEKLENIYOR': return 'Müşteri Kargo Gönderimi Bekleniyor 📦';
            case 'IADE_TAMAMLANDI': return 'İade Tamamlandı (Ücret İadesi Yapıldı) ✅';
            case 'REDDEDILDI': return 'Reddedildi ❌';
            default: return status;
        }
    };

    // Fotoğrafları Parse Et
    let photos = [];
    try {
        if (params.fotografUrls) {
            photos = JSON.parse(params.fotografUrls);
        }
    } catch (e) {
        console.error('Fotoğraf parse hatası:', e);
    }

    return (
        <Box>
            <Box flex flexDirection={['column', 'row']} mb="xl">
                {/* Sol Kolon: İade Detayları */}
                <Box width={[1, 1, 1 / 2]} mr={[0, 0, 'xl']}>

                    {/* Özet Kart */}
                    <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H3 mb="lg">İade Talebi #{params.id.substring(0, 8)}</H3>

                        <Box mb="lg">
                            <Label>Oluşturulma Tarihi</Label>
                            <Text>{formatDate(params.olusturulmaTarihi)}</Text>
                        </Box>

                        <Box mb="lg">
                            <Label>Durum</Label>
                            <Badge variant={getStatusVariant(params.durum)}>{getStatusLabel(params.durum)}</Badge>
                        </Box>

                        <Box mb="lg">
                            <Label>İade Tipi</Label>
                            <Text>{params.talepTipi}</Text>
                        </Box>

                        <Box mb="lg">
                            <Label>Sipariş Numarası</Label>
                            <Text fontWeight="bold">{params['siparis.siparisNumarasi'] || params.siparisId}</Text>
                        </Box>
                    </Box>

                    {/* Kargo Bilgileri (Eğer Varsa) */}
                    {(params.manuelIadeKodu || params.kargoFirmasi) && (
                        <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #4268F6' }}>
                            <H4 mb="md">📦 İade Kargo Bilgileri</H4>
                            <Box mb="md">
                                <Label>Kargo Firması</Label>
                                <Text fontWeight="bold">{params.kargoFirmasi || '-'}</Text>
                            </Box>
                            <Box>
                                <Label>İade Kodu</Label>
                                <Text fontFamily="monospace" bg="grey20" p="xs" display="inline-block">{params.manuelIadeKodu || '-'}</Text>
                            </Box>
                        </Box>
                    )}

                    {/* Admin Notu (Eğer Varsa) */}
                    {params.adminNotu && (
                        <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <H4 mb="md">📝 Admin Notu</H4>
                            <Text fontStyle="italic">{params.adminNotu}</Text>
                        </Box>
                    )}

                </Box>

                {/* Sağ Kolon: Açıklama ve Fotoğraflar */}
                <Box width={[1, 1, 1 / 2]}>

                    {/* Müşteri Açıklaması */}
                    <Box bg="white" p="xl" mb="lg" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <H4 mb="md">💬 Müşteri Açıklaması</H4>
                        <Text p="lg" bg="grey20" style={{ borderRadius: '4px' }}>
                            {params.aciklama || 'Açıklama girilmemiş.'}
                        </Text>
                    </Box>

                    {/* Fotoğraflar */}
                    {photos.length > 0 && (
                        <Box bg="white" p="xl" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <H4 mb="md">📸 Eklenen Fotoğraflar</H4>
                            <Box flex flexWrap="wrap" style={{ gap: '10px' }}>
                                {photos.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={url}
                                            alt={`İade Foto ${idx + 1}`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                    </a>
                                ))}
                            </Box>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
};

export default ReturnShow;
