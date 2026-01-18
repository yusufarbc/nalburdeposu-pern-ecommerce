import React, { useState } from 'react';
import { Box, Label, TextArea, Button, Text, MessageBox } from '@adminjs/design-system';
import { ApiClient, useNotice } from 'adminjs';
import { useNavigate } from 'react-router-dom';

const IptalEtAction = (props) => {
    const { record, resource, action } = props;
    const [iptalNotu, setIptalNotu] = useState('');
    const [loading, setLoading] = useState(false);

    const recordId = record?.id || record?.params?.id;
    const siparisNo = record?.params?.siparisNumarasi || recordId;

    const api = new ApiClient();
    const sendNotice = useNotice();
    const navigate = useNavigate();

    if (!recordId) {
        return (
            <Box p="xl" bg="white">
                <Text variant="lg" color="error">Hata: Sipariş kaydı bulunamadı.</Text>
            </Box>
        );
    }

    const handleSubmit = async () => {
        if (!iptalNotu.trim()) {
            sendNotice({ message: 'Lütfen iptal nedenini giriniz.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await api.recordAction({
                resourceId: resource.id,
                actionName: action.name,
                recordId: recordId,
                method: 'post',
                data: { iptalNotu }
            });

            if (response.data.notice) {
                sendNotice(response.data.notice);
            }

            // Redirect to Show view
            navigate(`/admin/resources/Siparis/records/${recordId}/show`);
        } catch (error) {
            console.error('IptalEt Error:', error);
            sendNotice({ message: 'İşlem sırasında bir hata oluştu: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p="xl" bg="white">
            <Text variant="lg" mb="lg" fontWeight="bold">Sipariş İptali - #{siparisNo}</Text>

            <MessageBox
                message="Bu işlem siparişi iptal edecek, Iyzico üzerinden ödeme iadesi yapacak ve müşteriye bilgilendirme e-postası gönderecektir."
                variant="danger"
                mb="xl"
            />

            <Box mb="xl">
                <Label htmlFor="iptalNotu" required>İptal Nedeni</Label>
                <TextArea
                    id="iptalNotu"
                    width={1}
                    rows={4}
                    value={iptalNotu}
                    onChange={(e) => setIptalNotu(e.target.value)}
                    placeholder="Örn: Stok yetersizliği nedeniyle siparişiniz iptal edilmiştir."
                />
                <Text mt="sm" color="grey60" fontSize="sm">
                    Bu not müşteriye gönderilecek e-postada görünecektir.
                </Text>
            </Box>

            <Button
                variant="danger"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'İşleniyor...' : 'İptal Et ve İade Yap 💸'}
            </Button>
        </Box>
    );
};

export default IptalEtAction;
