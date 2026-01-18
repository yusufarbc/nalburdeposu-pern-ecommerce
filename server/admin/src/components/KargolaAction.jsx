import React, { useState, useEffect } from 'react';
import { Box, Label, Input, Button, Icon, Text } from '@adminjs/design-system';
import { ApiClient, useNotice } from 'adminjs';
import { useNavigate } from 'react-router-dom';

const KargolaAction = (props) => {
    const { record, resource, action } = props;
    const [kargoFirmasi, setKargoFirmasi] = useState('Yurtiçi Kargo');
    const [kargoTakipNo, setKargoTakipNo] = useState('');
    const [loading, setLoading] = useState(false);

    // Safely extract Record ID
    const recordId = record?.id || record?.params?.id;

    const api = new ApiClient();
    const sendNotice = useNotice();
    const navigate = useNavigate();

    // If record is missing, try to parse from URL (last resort)
    // But since this component renders, props SHOULD be there.
    // If AdminJS fails to pass record, we show an error.

    if (!recordId) {
        return (
            <Box p="xl" bg="white">
                <Text variant="lg" color="error">Hata: Sipariş kaydı bulunamadı (Record ID missing).</Text>
                <Text>Lütfen sayfayı yenileyip tekrar deneyin.</Text>
            </Box>
        );
    }

    const handleSubmit = async () => {
        if (!kargoTakipNo) {
            sendNotice({ message: 'Lütfen kargo takip numarasını giriniz.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            // Explicitly pass recordId to ensure URL is correct and Payload contains ID
            const response = await api.resourceAction({
                resourceId: resource.id,
                actionName: action.name,
                recordId: recordId, // This generates correct URL: /records/{id}/actions/kargola
                method: 'post',
                data: {
                    recordId: recordId, // Backup for backend
                    kargoFirmasi,
                    kargoTakipNo
                }
            });

            if (response.data.notice) {
                sendNotice(response.data.notice);
            }

            // Redirect to Show view
            navigate(`/admin/resources/Siparis/records/${recordId}/show`);
        } catch (error) {
            console.error(error);
            sendNotice({ message: 'İşlem sırasında bir hata oluştu: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p="xl" bg="white">
            <Text variant="lg" mb="lg">Kargo Bilgileri</Text>

            <Box mb="xl">
                <Label htmlFor="kargoFirmasi" required>Kargo Firması</Label>
                <Input
                    id="kargoFirmasi"
                    width={1}
                    value={kargoFirmasi}
                    onChange={(e) => setKargoFirmasi(e.target.value)}
                    placeholder="Örn: Yurtiçi Kargo, Aras Kargo"
                />
            </Box>

            <Box mb="xl">
                <Label htmlFor="kargoTakipNo" required>Takip Numarası</Label>
                <Input
                    id="kargoTakipNo"
                    width={1}
                    value={kargoTakipNo}
                    onChange={(e) => setKargoTakipNo(e.target.value)}
                    placeholder="Kargo takip numarasını giriniz"
                />
            </Box>

            <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'İşleniyor...' : 'Kargola ve Mail Gönder 🚀'}
            </Button>
        </Box>
    );
};

export default KargolaAction;
