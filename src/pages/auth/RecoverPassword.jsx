import React from "react";
import { Fragment} from "react";
import { Card, Input, Button, Space } from "antd";
import Header from '../../components/auth/Header'

export default function RecoverPassword() {
    return (
        <Fragment>
            <Header />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <Card
                    style={{
                        width: 400,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <h2 style={{
                        textAlign: 'center',
                        color: '#C20E1A',
                        marginBottom: '24px',
                        fontSize: '24px',
                    }}>
                        Restaurar contraseña
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        marginBottom: '16px',
                    }}>
                        Ingresa tu correo electrónico
                    </p>
                    <Input
                        placeholder="Correo electrónico"
                        size="large"
                        style={{ marginBottom: '16px' }}
                    />
                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Button type="primary" href="confirmarcontrasena" size="large" style={{ backgroundColor: '#C20E1A', borderColor: '#c41d7f' }}>
                            Aceptar
                        </Button>
                        <Button size="large" href="login">
                            Cancelar
                        </Button>
                    </Space>
                </Card>
            </div>
        </Fragment>
    )
}
