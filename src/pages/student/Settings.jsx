import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../../components/TopNavbar';
import { Card, Button, Form, Input, Flex } from 'antd';
import { Space } from 'antd';

const Settings = () => {

    const navigate = useNavigate(); // Inicializa el hook useNavigate

    // Función para manejar el clic en "Cambiar contraseña"
    const handleChangePasswordClick = () => {
        navigate('/cambiarContrasena'); // Redirigir a la ruta de cambio de contraseña
    };

    return (
        <>
            <TopNavbar />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={true}
                    style={{
                        width: '100%',       // Ancho del 100% para ser flexible
                        maxWidth: '500px',   // Limitar el ancho máximo a 500px
                        marginTop: '100px',
                        margin: '3px auto',
                        justifyContent: 'center',
                    }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Perfil</h1>
                    </Space>

                    <p>¡Bienvenido a tu perfil! Aquí puedes ver y actualizar tu contraseña.</p>

                    <Form layout="vertical" style={{ marginTop: '8px' }} >
                        <Form.Item label="Nombres">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>
                        <Form.Item label="Apellidos">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>
                        <Form.Item label="Correo">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>
                        <Form.Item label="Tipo de beneficio">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                            <Button className="button-actionsGeneral"  type="primary" onClick={handleChangePasswordClick}>
                                Cambiar contraseña
                            </Button>
                        </div>

                    </Form>
                </Card>
            </main>

        </>
    );
};

export default Settings;