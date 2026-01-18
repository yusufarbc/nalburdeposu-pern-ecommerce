import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormGroup, Icon, Text, Label } from '@adminjs/design-system';
import ImageCrop from './ImageCrop/ImageCrop';

const SubCategoryInput = (props) => {
    const { onChange, record } = props;
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Determine if we are in Edit/New mode (onChange exists) or Show mode (read-only)
    const isEdit = typeof onChange === 'function';

    useEffect(() => {
        // Only load once from record params
        if (loaded || !record || !record.params) return;

        const loadedItems = [];
        const params = record.params;

        // Find existing items by scanning keys
        Object.keys(params).forEach(key => {
            const match = key.match(/altKategorilerInput\.(\d+)\.name/);
            if (match) {
                const i = parseInt(match[1]);
                loadedItems[i] = {
                    name: params[`altKategorilerInput.${i}.name`],
                    id: params[`altKategorilerInput.${i}.id`], // ID for sync
                    // Image URL populated by edit hook
                    imagePreview: params[`altKategoriResim_${i}`] || null,
                    image: null
                };
            }
        });

        // Filter empty slots and set state
        const valid = loadedItems.filter(i => i && i.name); // basic validation
        if (valid.length > 0) {
            setItems(valid);
        }
        setLoaded(true);
    }, [record, loaded]);

    const handleAdd = () => {
        const newItem = { name: '', image: null, imagePreview: null };
        setItems([...items, newItem]);
    };

    const handleRemove = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        updateFormData(newItems);
    };

    const handleNameChange = (index, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], name: value };
        setItems(newItems);
        updateFormData(newItems);
    };

    const handleImageChange = (index, file) => {
        const newItems = [...items];
        const previewUrl = file ? URL.createObjectURL(file) : null;

        newItems[index] = {
            ...newItems[index],
            image: file,
            imagePreview: previewUrl
        };
        setItems(newItems);
        updateFormData(newItems);
    };

    const updateFormData = (items) => {
        items.forEach((item, i) => {
            onChange(`altKategorilerInput.${i}.name`, item.name);
            if (item.id) {
                onChange(`altKategorilerInput.${i}.id`, item.id);
            }
            if (item.image) {
                // New file upload
                onChange(`altKategoriResim_${i}`, item.image);
            }
        });
    };

    // --- READ ONLY VIEW (SHOW) ---
    if (!isEdit) {
        return (
            <Box mb="xl">
                <Label>Alt Kategoriler</Label>
                {items.length === 0 ? (
                    <Text color="grey60">Bu kategoride alt kategori bulunmamaktadır.</Text>
                ) : (
                    <Box style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                        {items.map((item, i) => (
                            <Box
                                key={i}
                                flex
                                flexDirection="row"
                                alignItems="center"
                                p="default"
                                style={{ borderBottom: i < items.length - 1 ? '1px solid #eee' : 'none' }}
                            >
                                {item.imagePreview && (
                                    <img
                                        src={`https://cdn.nalburdeposu.com.tr/${item.imagePreview}`}
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                                        alt={item.name}
                                    />
                                )}
                                <Text>{item.name}</Text>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        );
    }

    // --- EDIT VIEW (FORM) ---
    return (
        <FormGroup>
            <Box mb="lg">
                {items.length === 0 && (
                    <Box p="lg" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <Text color="grey60">Henüz alt kategori eklenmedi. Yeni eklemek için butona tıklayın.</Text>
                    </Box>
                )}

                {items.map((item, index) => (
                    <Box
                        key={index}
                        p="default"
                        mb="default"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Box flex flexDirection="row" alignItems="center" mb="default" pb="sm" style={{ borderBottom: '1px solid #eee' }}>
                            <Text fontWeight="bold">Alt Kategori #{index + 1}</Text>
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemove(index)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Icon icon="Trash2" /> Sil
                            </Button>
                        </Box>

                        <Box mb="lg">
                            <Text fontSize="sm" mb="xs" color="grey80">Kategori Adı</Text>
                            <Input
                                value={item.name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                placeholder="Örn: İç Cephe Boyaları"
                                required
                                width={1}
                            />
                        </Box>

                        <Box>
                            <ImageCrop
                                property={{
                                    label: 'Kategori Görseli',
                                    name: `altKategoriResim_${index}`
                                }}
                                record={{
                                    params: {
                                        [`altKategoriResim_${index}`]: item.imagePreview
                                    }
                                }}
                                onChange={(name, file) => handleImageChange(index, file)}
                            />
                        </Box>
                    </Box>
                ))}

                <Button
                    type="button"
                    variant="primary"
                    onClick={handleAdd}
                    mt="default"
                >
                    <Icon icon="Plus" /> Alt Kategori Ekle
                </Button>
            </Box>

            <Text variant="xs" color="grey60" mt="sm">
                * Eklenen görseller otomatik olarak boyutlandırılıp yüklenecektir.
            </Text>
        </FormGroup>
    );
};

export default SubCategoryInput;
