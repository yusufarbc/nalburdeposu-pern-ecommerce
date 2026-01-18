import React, { useState, useEffect } from 'react';
import { Box, Header, Text, Button, Input, Select, CheckBox, Label, FormGroup, Loader } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Settings = () => {
    const [data, setData] = useState({
        siteTitle: '',
        companyName: '',
        currency: 'TRY',
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getPage({ pageName: 'SistemAyarlari' });
            setData(response.data);
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setData({
            ...data,
            [field]: value
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Get API URL by transforming current page URL
            // Browser URL: /admin/pages/SistemAyarlari
            // API URL: /admin/api/pages/SistemAyarlari
            const apiUrl = window.location.pathname.replace('/pages/', '/api/pages/');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include' // Send session cookies
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Network response was not ok');
            }

            const result = await response.json();

            alert('Ayarlar başarıyla güncellendi.');
        } catch (error) {
            console.error('Kaydetme hatası:', error);
            alert('Hata oluştu: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <Box variant="grey">
            <Box variant="white" padding="xl" borderRadius="8px" boxShadow="card">
                <Header.H2>Genel Ayarlar</Header.H2>
                <Text marginBottom="xl">Uygulama genel yapılandırma ayarları.</Text>

                <Box maxWidth="600px">
                    <FormGroup>
                        <Label>Site Başlığı</Label>
                        <Input
                            value={data.siteTitle}
                            onChange={(e) => handleChange('siteTitle', e.target.value)}
                            width="100%"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Şirket Adı</Label>
                        <Input
                            value={data.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            width="100%"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Para Birimi</Label>
                        <Select
                            value={{ value: data.currency, label: data.currency }}
                            onChange={(selected) => handleChange('currency', selected.value)}
                            options={[
                                { value: 'TRY', label: 'TRY - Türk Lirası' },
                                { value: 'USD', label: 'USD - Amerikan Doları' },
                                { value: 'EUR', label: 'EUR - Euro' }
                            ]}
                        />
                    </FormGroup>


                    <FormGroup>
                        <Label>Bakım Modu</Label>
                        <Box display="flex" alignItems="center">
                            <CheckBox
                                checked={data.maintenanceMode}
                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                id="maintenanceMode"
                            />
                            <Text marginLeft="default" htmlFor="maintenanceMode">
                                Siteyi bakıma al (Sadece adminler erişebilir)
                            </Text>
                        </Box>
                    </FormGroup>

                    <Box marginY="xl">
                        <Header.H3>Kargo & Teslimat Ayarları</Header.H3>
                        <Text marginBottom="lg">Kargo ücretleri ve limitlerini buradan yönetebilirsiniz.</Text>

                        <FormGroup>
                            <Label>Ücretsiz Kargo Alt Limiti (₺)</Label>
                            <Text variant="xs" color="grey60">Sepet toplamı bu tutarı geçerse kargo ücretsiz olur.</Text>
                            <Input
                                value={data.ucretsizKargoAltLimit}
                                onChange={(e) => handleChange('ucretsizKargoAltLimit', e.target.value)}
                                width="100%"
                                type="number"
                                step="0.01"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Kargo Fiyat Listesi (Ağırlığa Göre)</Label>
                            <Text variant="xs" color="grey60" marginBottom="default">
                                Ağırlık aralıklarına göre kargo ücretlerini tanımlayın. Google Merchant ile uyumludur.
                            </Text>

                            {/* Cargo Price Table */}
                            <Box
                                border="1px solid #e0e0e0"
                                borderRadius="4px"
                                overflow="hidden"
                                marginBottom="default"
                            >
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                                                Maksimum Ağırlık (kg)
                                            </th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                                                Fiyat (₺)
                                            </th>
                                            <th style={{ padding: '12px', width: '80px', borderBottom: '2px solid #e0e0e0' }}>
                                                İşlem
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.kargoFiyatListesi || []).map((tier, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '8px' }}>
                                                    <Input
                                                        type="number"
                                                        value={tier.maxWeight}
                                                        onChange={(e) => {
                                                            const newList = [...data.kargoFiyatListesi];
                                                            newList[index].maxWeight = parseFloat(e.target.value);
                                                            handleChange('kargoFiyatListesi', newList);
                                                        }}
                                                        step="0.1"
                                                        width="120px"
                                                    />
                                                </td>
                                                <td style={{ padding: '8px' }}>
                                                    <Input
                                                        type="number"
                                                        value={tier.price}
                                                        onChange={(e) => {
                                                            const newList = [...data.kargoFiyatListesi];
                                                            newList[index].price = parseFloat(e.target.value);
                                                            handleChange('kargoFiyatListesi', newList);
                                                        }}
                                                        step="0.01"
                                                        width="120px"
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newList = data.kargoFiyatListesi.filter((_, i) => i !== index);
                                                            handleChange('kargoFiyatListesi', newList);
                                                        }}
                                                    >
                                                        Sil
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>

                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => {
                                    const newList = [...(data.kargoFiyatListesi || []), { maxWeight: 0, price: 0 }];
                                    handleChange('kargoFiyatListesi', newList);
                                }}
                            >
                                + Yeni Aralık Ekle
                            </Button>
                        </FormGroup>
                    </Box>

                    <Box marginTop="xl">
                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Settings;
