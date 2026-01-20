import React, { useState, useEffect } from 'react';
import { Box, Label, Button, Text } from '@adminjs/design-system';
import ReactQuill from 'react-quill';

// Load Quill CSS dynamically to avoid Rollup bundling issues
const QUILL_CSS_URL = 'https://cdn.jsdelivr.net/npm/react-quill@2.0.0/dist/quill.snow.css';

/**
 * Custom Product Description Editor with WYSIWYG (ReactQuill)
 * Includes quick templates for standardized content.
 */
const ProductDescription = (props) => {
    const { property, record, onChange } = props;
    const value = record.params[property.name] || '';
    const error = record.errors && record.errors[property.name];

    // Load Quill CSS on mount
    useEffect(() => {
        const existingLink = document.querySelector(`link[href="${QUILL_CSS_URL}"]`);
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = QUILL_CSS_URL;
            document.head.appendChild(link);
        }
    }, []);

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
    </tbody>
</table>`,
        features: `
<ul style="margin-bottom: 20px;">
    <li><strong>Yüksek Dayanıklılık:</strong> Zorlu koşullara karşı dirençli.</li>
    <li><strong>Kolay Montaj:</strong> Ekstra ekipman gerektirmez.</li>
    <li><strong>Garanti:</strong> 2 Yıl üretici garantili.</li>
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
            // Append template to current value
            onChange(property.name, value + template);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <Box mb="xl">
            <Label>{property.label}</Label>

            {/* Template Buttons */}
            <Box flex gap="sm" mb="sm" flexWrap="wrap">
                <Button size="sm" variant="outlined" onClick={() => handleInsert('features')} type="button">
                    ✅ Özellik Listesi Ekle
                </Button>
                <Button size="sm" variant="outlined" onClick={() => handleInsert('infoBox')} type="button">
                    ℹ️ Bilgi Kutusu Ekle
                </Button>
            </Box>

            {/* Editor */}
            <Box bg="white" style={{ minHeight: '300px' }}>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={(content) => onChange(property.name, content)}
                    modules={modules}
                    formats={formats}
                    style={{ height: '300px', marginBottom: '50px' }}
                />
            </Box>

            {error && (
                <Text color="danger" variant="sm" mt="xs">{error.message}</Text>
            )}
            <Text variant="sm" color="grey60" mt="lg">
                * Görsel düzenleyici kullanarak içeriği zenginleştirebilirsiniz.
            </Text>
        </Box>
    );
};

export default ProductDescription;
