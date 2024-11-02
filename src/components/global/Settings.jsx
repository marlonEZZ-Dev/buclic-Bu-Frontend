import React, { useState, useEffect } from 'react';
import { useSettings } from '../../utils/SettingsContext'; 
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import api from '../../api';

const Settings = () => {
    const { settingId, setSettingId } = useSettings();
    const [profileData, setProfileData] = useState(null);  // Estado para el perfil
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Supongamos que el username está almacenado en localStorage
                const username = localStorage.getItem('username');
                if (username) {
                    const response = await api.get(`/users/${username}`); // Llamada al backend
                    setProfileData(response.data);  // Guardar los datos del perfil
                }
            } catch (error) {
                message.error('Error al cargar el perfil del usuario.');
            }
        };

        fetchProfileData();  // Llamada para obtener el perfil
    }, []);

    const handleChangePasswordClick = () => {
        navigate('/admin/contrasenaAdmin');
    };

    return (
        <>
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                {profileData ? (
                    <Form layout="vertical" style={{ marginTop: '8px' }}>
                        <Form.Item label="Nombres">
                            <Input value={profileData.name} disabled /> {/* Muestra el nombre */}
                        </Form.Item>
                        <Form.Item label="Apellidos">
                            <Input value={profileData.lastName} disabled /> {/* Muestra el apellido */}
                        </Form.Item>
                        <Form.Item label="Correo">
                            <Input value={profileData.email} disabled /> {/* Muestra el correo */}
                        </Form.Item>
                        <Form.Item label="Tipo de beneficio">
                            <Input value={profileData.benefitType} disabled /> {/* Muestra el tipo de beneficio */}
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                            <Button className="button-save" type="primary" onClick={handleChangePasswordClick}>
                                Cambiar contraseña
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}
            </main>
        </>
    );
};

export default Settings;
