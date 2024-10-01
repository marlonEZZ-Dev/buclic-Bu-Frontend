import React, { useState } from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Card, Button, Form, Input, Flex } from 'antd';
import { Space } from 'antd';

const Settings = () => {

    return (
        <>

            <TopNavbar />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={true}
                    style={{
                        width: '500px',
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

                        <Flex gap="small" wrap >
                            <Button type="text">Cambiar contraseña</Button>
                        </Flex>


                    </Form>
                </Card >
            </main>
        </>
    );
};

export default Settings;
