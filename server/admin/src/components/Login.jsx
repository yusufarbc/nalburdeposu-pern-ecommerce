import React from 'react'
import { Box, Button, Input, Label, Text, H2 } from '@adminjs/design-system'

const Login = (props) => {
    const { action, errorMessage } = props

    return (
        <Box flex flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bg="bg">
            <Box p="xl" bg="white" boxShadow="card" width="100%" maxWidth="400px" style={{ borderRadius: '8px', borderTop: '5px solid #DFFF00' }}>

                <Box textAlign="center" mb="xl">
                    <img src="/logo.png" alt="NalburDeposu" style={{ maxWidth: '200px' }} />
                </Box>

                <H2 textAlign="center" mb="lg">Yönetim Paneli</H2>
                <Text textAlign="center" mb="xl" color="grey60">
                    Lütfen yönetici kimlik bilgilerinizle oturum açın.
                </Text>

                {errorMessage && (
                    <Box mb="xl" p="default" bg="errorLight" style={{ borderRadius: '4px' }}>
                        <Text variant="danger">{errorMessage}</Text>
                    </Box>
                )}

                <form action={action} method="POST">
                    <Box mb="xl">
                        <Label>E-Posta</Label>
                        <Input name="email" placeholder="ornek@nalburdeposu.com" width={1} />
                    </Box>

                    <Box mb="xl">
                        <Label>Şifre</Label>
                        <Input name="password" type="password" placeholder="******" width={1} />
                    </Box>

                    <Button variant="primary" size="lg" width={1}>
                        Giriş Yap
                    </Button>
                </form>

                <Box mt="xl" textAlign="center">
                    <Text variant="xs" color="grey40">NalburDeposu © 2024</Text>
                </Box>
            </Box>
        </Box>
    )
}

export default Login
