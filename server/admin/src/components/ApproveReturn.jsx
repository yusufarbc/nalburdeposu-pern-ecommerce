import React, { useState } from 'react';
import { Box, Label, Input, Button, Text } from '@adminjs/design-system';
import { ApiClient, useNotice } from 'adminjs';
import { useNavigate } from 'react-router-dom';

const ApproveReturnAction = (props) => {
    const { record, resource, action } = props;
    const [manuelIadeKodu, setManuelIadeKodu] = useState('');
    const [kargoFirmasi, setKargoFirmasi] = useState('');
    const [loading, setLoading] = useState(false);

    // Safely extract Record ID
    const recordId = record?.id || record?.params?.id;

    const api = new ApiClient();
    const sendNotice = useNotice();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!manuelIadeKodu || !kargoFirmasi) {
            sendNotice({ message: 'Lütfen iade kodu ve kargo firması giriniz.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await api.recordAction({
                resourceId: resource.id,
                actionName: action.name,
                recordId: recordId,
                method: 'post',
                data: {
                    manuelIadeKodu,
                    kargoFirmasi
                }
            });

            if (response.data.notice) {
                sendNotice(response.data.notice);
            }

            if (response.data.redirectUrl) {
                navigate(response.data.redirectUrl);
            } else {
                navigate(`/admin/resources/IadeTalebi/records/${recordId}/show`);
            }
        } catch (error) {
            console.error(error);
            sendNotice({ message: 'Hata: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p="xl" bg="white">
            <Text variant="lg" mb="lg">İade Onayı & Kod Gönderimi</Text>

            <Box mb="xl">
                <Label htmlFor="kargoFirmasi" required>Kargo Firması</Label>
                <Input
                    id="kargoFirmasi"
                    width={1}
                    value={kargoFirmasi}
                    onChange={(e) => setKargoFirmasi(e.target.value)}
                    placeholder="Örn: Yurtiçi Kargo"
                />
            </Box>

            <Box mb="xl">
                <Label htmlFor="manuelIadeKodu" required>İade Kodu</Label>
                <Input
                    id="manuelIadeKodu"
                    width={1}
                    value={manuelIadeKodu}
                    onChange={(e) => setManuelIadeKodu(e.target.value)}
                    placeholder="Kargo firmasından alınan iade kodu"
                />
            </Box>

            <Button onClick={handleSubmit} disabled={loading} variant="primary">
                {loading ? 'İşleniyor...' : 'Onayla ve Gönder'}
            </Button>
        </Box>
    );
};

export default ApproveReturnAction;
