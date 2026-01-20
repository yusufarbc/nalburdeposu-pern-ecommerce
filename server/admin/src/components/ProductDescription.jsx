import React, { useState, useEffect } from 'react';
import { Box, Label, Button, Text, TextArea, Badge, Icon } from '@adminjs/design-system';

/**
 * Custom Product Description Editor
 * Provides quick templates and HTML preview to enhance the description editing experience.
 */
const ProductDescription = (props) => {
    const { property, record, onChange } = props;
    const value = record.params[property.name] || '';
    const error = record.errors && record.errors[property.name];

    const [isPreview, setIsPreview] = useState(false);

    // Templates to insert
    const templates = {
        specs: `
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tbody>
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold; width: 30%;">Özellik</td>
            <td style="padding: 10px;">Değer</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">Malzeme</td>
            <td style="padding: 10px;">Çelik</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">Boyut</td>
            <td style="padding: 10px;">100x100 cm</td>
        </tr>
    </tbody>
</table>`,
        features: `
<ul style="list-style-type: none; padding: 0; margin-bottom: 20px;">
    <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        ✅ <strong>Yüksek Dayanıklılık:</strong> Zorlu koşullara karşı dirençli.
    </li>
    <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        ✅ <strong>Kolay Montaj:</strong> Ekstra ekipman gerektirmez.
    </li>
    <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        ✅ <strong>Garanti:</strong> 2 Yıl üretici garantili.
    </li>
</ul>`,
        infoBox: `
<div style="background-color: #f0f9ff; border-left: 4px solid #007bff; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
    <strong style="color: #007bff; display: block; margin-bottom: 5px;">ℹ️ Bilgilendirme</strong>
    Bu ürün profesyonel kullanım için uygundur.
</div>`
    };

    const handleInsert = (templateKey) => {
        const template = templates[templateKey];
        if (template) {
            onChange(property.name, value + '\n' + template);
        }
    };

    return (
        <Box mb="xl">
            <Label>{property.label}</Label>

            {/* Toolbar */}
            <Box flex gap="sm" mb="sm" flexWrap="wrap">
                <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleInsert('specs')}
                    type="button"
                >
                    <span role="img" aria-label="table">📊</span> Teknik Tablo Ekle
                </Button>
                <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleInsert('features')}
                    type="button"
                >
                    <span role="img" aria-label="list">✅</span> Özellik Listesi Ekle
                </Button>
                <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleInsert('infoBox')}
                    type="button"
                >
                    <span role="img" aria-label="info">ℹ️</span> Bilgi Kutusu Ekle
                </Button>
                <Box flexGrow={1} />
                <Button
                    size="sm"
                    variant={isPreview ? 'primary' : 'light'}
                    onClick={() => setIsPreview(!isPreview)}
                    type="button"
                >
                    {isPreview ? '✏️ Düzenlemeye Dön' : '👁️ Önizleme'}
                </Button>
            </Box>

            {/* Editor Area */}
            {isPreview ? (
                <Box
                    bg="white"
                    p="xl"
                    border="1px solid"
                    borderColor="grey40"
                    borderRadius="sm"
                    minHeight="300px"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <TextArea
                    width="100%"
                    rows={15}
                    placeholder="HTML içeriğinizi buraya yazın veya üstteki butonları kullanarak şablon ekleyin..."
                    value={value}
                    onChange={(e) => onChange(property.name, e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
            )}

            {error && (
                <Text color="danger" variant="sm" mt="xs">{error.message}</Text>
            )}

            <Text variant="sm" color="grey60" mt="sm">
                * HTML etiketleri kullanabilir veya hazır şablonları ekleyip düzenleyebilirsiniz.
            </Text>
        </Box>
    );
};

export default ProductDescription;
