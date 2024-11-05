import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPsych from "../../components/psychology/HeaderPsych";
import { Button, Form, Input, message, Card } from 'antd';
import api from '../../api';

const SettingPysch = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);

    const fetchProfileData = async () => {
        try {
            const username = localStorage.getItem('username');
            if (username) {
                const response = await api.get(`/users/${username}`);
                setProfileData(response.data); // Guardar los datos del perfil
            }
        } catch (error) {
            message.error('Error al cargar el perfil del usuario.');
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleChangePasswordClick = () => {
        navigate('/psicologo/contrasena');
    };

    return (
        <>
            <HeaderPsych />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    title="Perfil"
                    bordered={false}
                    style={{ width: '100%', maxWidth: '600px' }}
                >
                    {profileData ? (
                        <Form layout="vertical">
                            <Form.Item label={<span style={{ color: 'black', }}>Nombres</span>}>
                                <Input value={profileData.name} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Apellidos</span>}>
                                <Input value={profileData.lastName} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Correo</span>}>
                                <Input value={profileData.email} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Tipo de beneficio</span>}>
                                <Input value={profileData.benefitType} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                                <Button
                                    className="button-save"
                                    style={{ width: '180px' }}
                                    type="primary"
                                    onClick={handleChangePasswordClick}
                                >
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <p>Por favor selecciona una opción de perfil para ver los datos.</p>
                    )}
                </Card>
            </main>
        </>
    );
};

export default SettingPysch;