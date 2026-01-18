import React from 'react';
import { Box, H3, Text, Badge, Icon, Table, TableBody, TableRow, TableCell } from '@adminjs/design-system';

const HistoryTimeline = (props) => {
    const { record } = props;

    if (!record) return null;

    const { params } = record;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TESLIM_EDILDI':
            case 'TAMAMLANDI': return 'success';
            case 'KARGOLANDI': return 'info';
            case 'IPTAL_EDILDI':
            case 'IADE_EDILDI': return 'danger';
            case 'HAZIRLANIYOR': return 'warning';
            default: return 'primary';
        }
    };

    return (
        <Box>
            <Box mb="xl" display="flex" alignItems="center">
                <Box mr="lg" p="md" bg="primary20" borderRadius="full">
                    <Icon icon="Clock" color="primary100" />
                </Box>
                <Box>
                    <H3 mb="xs">İşlem Detayı</H3>
                    <Text color="grey60">Geçmiş Kayıt ID: {params.id}</Text>
                </Box>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="card" p="xl">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><Text fontWeight="bold">İlgili Sipariş ID</Text></TableCell>
                            <TableCell><Badge variant="light">{params.siparisId}</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Text fontWeight="bold">İşlem Yapan</Text></TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Icon icon="User" size={16} mr="sm" />
                                    <Text>{params.islemYapan || 'Sistem'}</Text>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Text fontWeight="bold">Tarih</Text></TableCell>
                            <TableCell>{formatDate(params.olusturulmaTarihi)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Text fontWeight="bold">Durum Değişimi</Text></TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Badge variant="light">{params.eskiDurum || 'Başlangıç'}</Badge>
                                    <Icon icon="ArrowRight" mx="md" color="grey40" />
                                    <Badge variant={getStatusColor(params.yeniDurum)}>{params.yeniDurum}</Badge>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Text fontWeight="bold">Notlar</Text></TableCell>
                            <TableCell>
                                <Text p="md" bg="grey20" borderRadius="md" fontStyle="italic">
                                    {params.not || 'Not girilmemiş.'}
                                </Text>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default HistoryTimeline;
