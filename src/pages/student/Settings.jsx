import React, { useState } from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Card, Button, Form, Input, Flex  } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';

const Settings = () => {

    return (
        <>

            <TopNavbar />
            <Card
                bordered={true}
                style={{
                    width: '600px',
                    marginTop: '98px',
                    margin: '3px auto',
                    justifyContent: 'center',
                }}
            >
                <Space style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                    <Avatar size={64} shape="circle" style={{ backgroundColor: 'transparent' }}>
                        <SolutionOutlined style={{ fontSize: '30px', color: 'black' }} />
                    </Avatar>
                    <h1 style={{  margin: 0, fontSize: 19 }}>Perfil</h1>
                </Space>

                <Form layout="vertical" style={{ marginTop: '2px' }} >
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

                    <Flex gap="small" wrap>
                        <Button type="text">Cambiar contraseña</Button>
                    </Flex>

                    <Form.Item>
                        <Button type="primary">x</Button>
                    </Form.Item>

                </Form>
            </Card >
        </>
    );
};

export default Settings;
