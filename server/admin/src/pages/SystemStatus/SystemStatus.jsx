import React, { useState, useEffect } from 'react';
import { Box, Header, Text, Badge, Section, Loader, Button } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

// Helper for pure SVG pie charts (No Recharts dependency)
const SimplePie = ({ percent, color, label }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <Box height="150px" width="100%" position="relative" display="flex" justifyContent="center" alignItems="center">
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Circle */}
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#eee"
                    strokeWidth="12"
                    fill="none"
                />
                {/* Progress Circle */}
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={color}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="lg" fontWeight="bold">{percent}%</Text>
                <Text fontSize="xs" color="grey60">{label}</Text>
            </Box>
        </Box>
    )
}

const SystemStatus = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.getPage({ pageName: 'Sistem Durumu' });
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) return <Loader />;

    return (
        <Box variant="grey">
            <Box padding="xl">
                <Header.H2>Sistem ve Sunucu Durumu</Header.H2>
                <Text marginBottom="xl">Uygulama ve sunucu kaynaklarının gerçek zamanlı izlenmesi.</Text>

                {/* 1. Resource Grid */}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                    gridGap="24px"
                    marginBottom="24px"
                >
                    {/* APP STATS */}
                    <Box bg="white" p="24px" borderRadius="8px" boxShadow="0 1px 3px rgba(0,0,0,0.1)">
                        <Header.H4>Uygulama (Container)</Header.H4>
                        <Box display="flex" justifyContent="space-between" marginTop="lg">
                            <Box textAlign="center" flex={1}>
                                <SimplePie percent={data.app.cpu} color="#E60000" label="CPU" />
                            </Box>
                            <Box textAlign="center" flex={1}>
                                <Text fontSize="xl" fontWeight="bold" marginTop="lg">{data.app.memory}</Text>
                                <Text fontSize="sm" color="grey60">Bellek Kullanımı</Text>
                            </Box>
                        </Box>
                    </Box>

                    {/* SERVER MEMORY */}
                    <Box bg="white" p="24px" borderRadius="8px" boxShadow="0 1px 3px rgba(0,0,0,0.1)">
                        <Header.H4>Sunucu Belleği (RAM)</Header.H4>
                        <Box display="flex" justifyContent="center" marginTop="lg">
                            <SimplePie percent={data.server.memory.percent} color="#1A1A1A" label="RAM" />
                        </Box>
                        <Box display="flex" justifyContent="space-around" marginTop="md">
                            <Box><Text variant="xs">Toplam: {data.server.memory.total}</Text></Box>
                            <Box><Text variant="xs">Boş: {data.server.memory.free}</Text></Box>
                        </Box>
                    </Box>

                    {/* SERVER DISK */}
                    <Box bg="white" p="24px" borderRadius="8px" boxShadow="0 1px 3px rgba(0,0,0,0.1)">
                        <Header.H4>Sunucu Diski</Header.H4>
                        <Box display="flex" justifyContent="center" marginTop="lg">
                            <SimplePie percent={data.server.disk.percent} color="#FFA500" label="Disk" />
                        </Box>
                        <Box display="flex" justifyContent="space-around" marginTop="md">
                            <Box><Text variant="xs">Toplam: {data.server.disk.total}</Text></Box>
                            <Box><Text variant="xs">Boş: {data.server.disk.free}</Text></Box>
                        </Box>
                    </Box>
                </Box>

                {/* 2. Docker Containers Table */}
                <Box bg="white" p="24px" borderRadius="8px" boxShadow="0 1px 3px rgba(0,0,0,0.1)" marginBottom="24px">
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="lg">
                        <Header.H4>Docker Konteynerleri</Header.H4>
                        <Badge variant="info">Aktif</Badge>
                    </Box>

                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', fontFamily: 'sans-serif' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#898989' }}>
                                    <th style={{ padding: '8px' }}>İsim</th>
                                    <th style={{ padding: '8px' }}>Görüntü (Image)</th>
                                    <th style={{ padding: '8px' }}>Durum</th>
                                    <th style={{ padding: '8px' }}>Portlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.docker && data.docker.length > 0 ? (
                                    data.docker.map((container, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{container.name}</td>
                                            <td style={{ padding: '8px', color: '#666' }}>{container.image}</td>
                                            <td style={{ padding: '8px' }}>
                                                <Badge variant={container.state === 'running' ? 'success' : 'danger'}>
                                                    {container.state ? container.state.toUpperCase() : 'UNKNOWN'}
                                                </Badge>
                                                <Text as="span" fontSize="xs" marginLeft="sm" color="grey60">{container.status}</Text>
                                            </td>
                                            <td style={{ padding: '8px', fontFamily: 'monospace' }}>{container.ports}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                                            Konteyner bilgisi alınamadı veya Docker erişimi yok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Box>
                </Box>

                {/* 3. Login Logs Section (Table) */}
                <Box bg="white" p="24px" borderRadius="8px" boxShadow="0 1px 3px rgba(0,0,0,0.1)">
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="lg">
                        <Header.H4>Giriş Denemeleri (Admin Panel)</Header.H4>
                        <Badge variant="info">Oto-yenileme: 5s</Badge>
                    </Box>

                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', fontFamily: 'sans-serif' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#898989' }}>
                                    <th style={{ padding: '8px' }}>Durum</th>
                                    <th style={{ padding: '8px' }}>Zaman</th>
                                    <th style={{ padding: '8px' }}>IP Adresi</th>
                                    <th style={{ padding: '8px' }}>Cihaz / Tarayıcı</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.logs && data.logs.length > 0 ? (
                                    data.logs.map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '8px' }}>
                                                {log.status === 200 || log.status === 302 || log.status < 400 ? (
                                                    <Badge variant="success">BAŞARILI ({log.status})</Badge>
                                                ) : (
                                                    <Badge variant="danger">BAŞARISIZ ({log.status})</Badge>
                                                )}
                                            </td>
                                            <td style={{ padding: '8px' }}>
                                                {new Date(log.ts * 1000).toLocaleString('tr-TR')}
                                            </td>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{log.ip}</td>
                                            <td style={{ padding: '8px', color: '#888', maxWidth: '300px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                {log.userAgent}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                                            Henüz kaydedilmiş bir giriş denemesi yok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SystemStatus;
