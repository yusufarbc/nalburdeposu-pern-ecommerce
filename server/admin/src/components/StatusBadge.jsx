import React from 'react';
import { Badge, Box } from '@adminjs/design-system';

const StatusBadge = (props) => {
    const { record } = props;
    const status = record.params.durum;

    let variant = 'default';
    let label = status;

    switch (status) {
        case 'TESLIM_EDILDI':
        case 'TAMAMLANDI':
            variant = 'light'; // Faded for completed
            label = status === 'TESLIM_EDILDI' ? 'Teslim Edildi ✅' : 'Tamamlandı 🏁';
            break;
        case 'IPTAL_EDILDI':
        case 'IADE_EDILDI':
            variant = 'light'; // Faded for deleted/returned
            label = status === 'IPTAL_EDILDI' ? 'İptal Edildi 🚫' : 'İade Edildi 💸';
            break;
        case 'HAZIRLANIYOR':
            variant = 'info'; // Prominent Blue
            label = 'Hazırlanıyor 📦';
            break;
        case 'KARGOLANDI':
            variant = 'primary'; // Prominent Purple
            label = 'Kargolandı 🚚';
            break;
        case 'BEKLEMEDE':
            variant = 'danger'; // Prominent Red (Action needed)
            label = 'Beklemede ⏳';
            break;
        case 'IADE_TALEP_EDILDI':
            variant = 'warning'; // Prominent Orange
            label = 'İade Talebi ↩️';
            break;
        default:
            variant = 'default';
            break;
    }

    return (
        <Box>
            <Badge variant={variant}>{label}</Badge>
        </Box>
    );
};

export default StatusBadge;
