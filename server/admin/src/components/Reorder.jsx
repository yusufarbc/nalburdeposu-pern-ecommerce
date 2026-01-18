import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Loader, H3, Icon } from '@adminjs/design-system';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ApiClient } from 'adminjs';
import { useNavigate } from 'react-router-dom';

const api = new ApiClient();

const Reorder = (props) => {
    const { resource, record } = props;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            // Fetch records via the custom action handler (GET)
            const response = await api.resourceAction({
                resourceId: resource.id,
                actionName: 'reorder',
            });

            console.log('Reorder fetch response:', response);

            // Access correct data path (AdminJS API often wraps response in data)
            const data = response.data && response.data.data ? response.data.data : response.data;

            if (data && Array.isArray(data)) {
                // Ensure they are sorted by sira
                const sorted = data.sort((a, b) => (a.sira || 0) - (b.sira || 0));
                setItems(sorted);
            } else {
                console.warn('Reorder: Response data is not an array', data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        // Optimistically update state
        setItems(newItems);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare payload: array of { id, sira }
            // The index in the array represents the new order (1-based or 0-based)
            const payload = items.map((item, index) => ({
                id: item.id,
                sira: index + 1 // 1-based index for 'sira'
            }));

            await api.resourceAction({
                resourceId: resource.id,
                actionName: 'reorder',
                method: 'post',
                data: { items: payload }
            });

            // Navigate back to list
            navigate(`/admin/resources/${resource.id}`);
        } catch (error) {
            console.error('Error saving order:', error);
            // Optionally show error toast
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Box p="xl">
            <Box flex justifyContent="space-between" alignItems="center" mb="xl">
                <H3>Sıralamayı Düzenle: {resource.id}</H3>
                <Box>
                    <Button variant="text" mr="lg" onClick={() => navigate(`/admin/resources/${resource.id}`)}>
                        İptal
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </Box>
            </Box>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            bg="white"
                            p="lg"
                            boxShadow="card"
                            map={1} // AdminJS Box prop weirdness, avoiding invalid HTML attr
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            p="lg"
                                            mb="sm"
                                            bg={snapshot.isDragging ? 'primary20' : 'grey20'}
                                            borderRadius="default"
                                            border="1px solid"
                                            borderColor="grey40"
                                            flex
                                            alignItems="center"
                                            style={{ ...provided.draggableProps.style }}
                                        >
                                            <Icon icon="Menu" mr="lg" color="grey60" />
                                            <Box>
                                                <Text fontWeight="bold">{item.ad} (ID: {item.id})</Text>
                                                <Text variant="sm" color="grey60">Eski Sıra: {item.sira}</Text>
                                            </Box>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            {items.length === 0 && (
                <Box p="xl" textAlign="center">
                    <Text>Sıralanacak öğe bulunamadı.</Text>
                </Box>
            )}
        </Box>
    );
};

export default Reorder;
