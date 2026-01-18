import React from 'react';
import { Badge, Box } from '@adminjs/design-system';

const InvoiceStatusBadge = (props) => {
    const { record } = props;
    const status = record.params.faturaDurumu;

    let variant = 'default';
    let label = status;

    switch (status) {
        case 'DUZENLENDI':
            variant = 'info';
            label = 'Düzenlendi 📝';
            break;
        case 'ODENDI':
            variant = 'success';
            label = 'Ödendi 💵';
            break;
        case 'DUZENLENMEDI':
        default:
            variant = 'light';
            label = 'Düzenlenmedi';
            break;
    }

    return (
        <Box>
            <Badge variant={variant}>{label}</Badge>
        </Box>
    );
};

export default InvoiceStatusBadge;
