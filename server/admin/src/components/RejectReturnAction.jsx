import React, { useState } from 'react';
import { Box, Button, Input, Label, H3, TextArea, MessageBox } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { useNavigate } from 'react-router-dom';

const RejectReturnAction = (props) => {
    const { record, resource } = props;
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const api = new ApiClient();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!reason) {
            alert('Lütfen bir red nedeni giriniz.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.recordAction({
                resourceId: resource.id,
                recordId: record.id,
                actionName: 'rejectReturn',
                data: {
                    adminNotu: reason
                },
                method: 'post'
            });

            const { record: newRecord, notice, redirectUrl } = response.data;

            if (redirectUrl) {
                navigate(redirectUrl);
            } else {
                // Fallback redirect if none provided
                navigate(`/admin/resources/${resource.id}/records/${record.id}/show`);
            }
        } catch (error) {
            console.error(error);
            // Handle error (maybe show a toast notification if global context allows, or alert)
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p="xl" bg="white">
            <H3>İade Talebini Reddet</H3>
            <MessageBox variant="danger" mb="xl">
                Bu işlem iade talebini kalıcı olarak reddedecek ve müşteriye bilgilendirme e-postası gönderecektir.
            </MessageBox>

            <Box mb="xl">
                <Label>Red Nedeni (Müşteriye Gönderilecek)</Label>
                <TextArea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Örneğin: Ürün kullanılmış, iade süresi dolmuş vb."
                />
            </Box>

            <Button variant="danger" onClick={handleSubmit} disabled={loading}>
                {loading ? 'İşleniyor...' : 'Talebi Reddet ve Mail Gönder'}
            </Button>
        </Box>
    );
};

export default RejectReturnAction;
