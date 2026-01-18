import React from 'react';
import { Badge, Box } from '@adminjs/design-system';

const ReturnStatusBadge = (props) => {
    const { record } = props;
    const status = record.params.durum;

    let variant = 'default';
    let label = status;

    switch (status) {
        case 'ONAY_BEKLENIYOR':
            variant = 'danger'; // Kırmızı: Hemen aksiyon gerekiyor!
            label = 'Onay Bekliyor ⏳';
            break;

        case 'MUSTERI_GONDERIMI_BEKLENIYOR':
            variant = 'warning'; // Sarı: Bekleme aşaması
            label = 'Müşteri Gönderimi Bekleniyor 📦';
            break;



        case 'IADE_TAMAMLANDI':
            variant = 'light'; // Soluk/Beyaz: İşlem bitti, önemsiz
            label = 'İade Tamamlandı ✅';
            break;

        case 'REDDEDILDI':
            variant = 'default'; // Gri/Nötr: Reddedilmiş (veya koyu gri secondary)
            label = 'Reddedildi ❌';
            break;

        default:
            variant = 'default';
            break;
    }

    // Eğer tamamlandıysa biraz daha sönük (opacity) gösterebiliriz opsiyonel olarak
    const style = status === 'IADE_TAMAMLANDI' ? { opacity: 0.8 } : {};

    return (
        <Box style={style}>
            <Badge variant={variant}>{label}</Badge>
        </Box>
    );
};

export default ReturnStatusBadge;
