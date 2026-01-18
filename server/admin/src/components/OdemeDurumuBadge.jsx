import React from 'react';
import { Badge, Box } from '@adminjs/design-system';

const OdemeDurumuBadge = (props) => {
    const { record } = props;
    const status = record.params.odemeDurumu;

    let variant = 'default';
    let label = status;

    switch (status) {
        case 'SUCCESS':
            variant = 'success';
            label = 'Başarılı ✅';
            break;
        case 'FAILURE':
            variant = 'danger';
            label = 'Başarısız ❌';
            break;
        case 'INIT':
            variant = 'primary';
            label = 'Başlatıldı ⏳';
            break;
        default:
            variant = 'light';
            break;
    }

    return (
        <Box>
            <Badge variant={variant}>{label}</Badge>
        </Box>
    );
};

export default OdemeDurumuBadge;
