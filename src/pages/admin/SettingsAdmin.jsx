import React, { useState, useEffect } from 'react';
import { useSettings } from '../../utils/SettingsContext';  // Importar el contexto
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import MenuBecas from '../../components/global/MenuBecas';
import { Button, Form, Input, Space, DatePicker, TimePicker, message } from 'antd';
import api from '../../api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SettingsAdmin = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState('Perfil');
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);  // Nuevo estado para el perfil

    const [settingId, setSettingId] = useState(null);
    const [settingData, setSettingData] = useState({});
    const [initialSettingData, setInitialSettingData] = useState({}); // Estado para los datos originales

    useEffect(() => {
        fetchSetting();
    }, []);

    const fetchSetting = async () => {
        try {
            const response = await api.get('/setting');
            const settingsList = response.data;

            console.log('Response from /setting:', settingsList);

            if (settingsList.length === 0) {
                // No hay ajustes
                setSettingId(null);
                const defaultData = {
                    id: null,
                    startSemester: null,
                    endSemester: null,
                    numLunch: null,
                    numSnack: null,
                    starBeneficiaryLunch: null,
                    endBeneficiaryLunch: null,
                    starLunch: null,
                    endLunch: null,
                    starBeneficiarySnack: null,
                    endBeneficiarySnack: null,
                    starSnack: null,
                    endSnack: null,
                };
                setSettingData(defaultData);
                setInitialSettingData(defaultData); // También actualiza el estado inicial
            } else if (settingsList.length === 1) {
                const setting = settingsList[0];
                setSettingId(setting.id);
                const fetchedData = setting.settingRequest;
                setSettingData(fetchedData);
                setInitialSettingData(fetchedData); // Guardar los datos originales
            } else {
                console.log('Unexpected number of settings:', settingsList.length);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Manejo de error
        }
    };


    const fetchProfileData = async () => {
        try {
            const username = localStorage.getItem('username');
            if (username) {
                const response = await api.get(`/users/${username}`); // Asegúrate de que las comillas sean correctas
                setProfileData(response.data); // Guardar los datos del perfil
            }
        } catch (error) {
            message.error('Error al cargar el perfil del usuario.');
        }
    };

    useEffect(() => {
        if (selectedType === 'Perfil') {
            fetchProfileData(); // Llamar a la función cuando el tipo seleccionado es 'Perfil'
        }
    }, [selectedType]); // Solo vuelve a ejecutar si selectedType cambia


    const handleCancelClick = () => {
        setSettingData(initialSettingData); // Restablece los datos al original
        setIsEditing(false); // Cambia a modo no edición
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCreateClick = () => {
        setIsEditing(true);
        setSettingData({
            id: null,
            startSemester: null,
            endSemester: null,
            numLunch: null,
            numSnack: null,
            starBeneficiaryLunch: null,
            endBeneficiaryLunch: null,
            starLunch: null,
            endLunch: null,
            starBeneficiarySnack: null,
            endBeneficiarySnack: null,
            starSnack: null,
            endSnack: null,
        });
    };

    const handleSaveClick = async () => {
        try {
            if (settingId) {
                // Actualiza un ajuste existente
                await api.put('/setting', { ...settingData, id: settingId });
                message.success('Ajustes guardados exitosamente.');
            } else {
                // Crea un nuevo ajuste
                const response = await api.post('/setting', settingData);
                setSettingId(response.data.id);
                setSettingData(response.data.settingRequest);
                message.success('Ajustes creados exitosamente.');
            }
            // Actualiza initialSettingData para reflejar los datos guardados
            setInitialSettingData(settingData);
            setIsEditing(false); // Cambia a modo no edición
        } catch (error) {
            message.error('Error al guardar los ajustes.');
        }
    };



    const handleChangePasswordClick = () => {
        navigate('/admin/contrasenaAdmin');
    };


    const buttons = [
        { type: 'Perfil', label: 'Perfil' },
        { type: 'Ajustes Becas', label: 'Becas' },
    ];

    return (
        <>
            <HeaderAdmin />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>

                    {selectedType === 'Perfil' && profileData ? (
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
                        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                            <p>Aquí hay ajustes adicionales relacionados a las becas de alimentación.</p>
                            <Space direction="vertical" size={12}>
                                <label style={{ display: 'block' }}>Duración del semestre</label>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabled={!isEditing}
                                    value={[
                                        settingData?.startSemester ? dayjs(settingData.startSemester) : null,
                                        settingData?.endSemester ? dayjs(settingData.endSemester) : null,
                                    ]}
                                    onChange={(dates) => {
                                        if (dates) {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                startSemester: dates[0] ? dates[0].format('YYYY-MM-DD') : null,
                                                endSemester: dates[1] ? dates[1].format('YYYY-MM-DD') : null,
                                            }));
                                        } else {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                startSemester: null,
                                                endSemester: null,
                                            }));
                                        }
                                    }}
                                    allowEmpty={[true, true]}
                                />
                            </Space>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', marginBottom: '12px' }}>
                                    <div style={{ width: '38%', marginRight: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}>No. Becas almuerzo</label>
                                        <Input
                                            type="number"
                                            placeholder="Número de almuerzos"
                                            disabled={!isEditing}
                                            value={settingData?.numLunch || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value >= 0 || value === '') {
                                                    setSettingData((prev) => ({
                                                        ...prev,
                                                        numLunch: value,
                                                    }));
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '38%' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}>No. Becas refrigerio</label>
                                        <Input
                                            type="number"
                                            placeholder="Número de refrigerios"
                                            disabled={!isEditing}
                                            value={settingData?.numSnack || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value >= 0 || value === '') {
                                                    setSettingData((prev) => ({
                                                        ...prev,
                                                        numSnack: value,
                                                    }));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Accesos y horarios */}
                                {/* Acceso para beneficiarios almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}>Acceso para beneficiarios almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starBeneficiaryLunch ? dayjs(settingData.starBeneficiaryLunch, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starBeneficiaryLunch: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endBeneficiaryLunch ? dayjs(settingData.endBeneficiaryLunch, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endBeneficiaryLunch: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                </Space>

                                {/* Acceso para venta libre almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}>Acceso para venta libre almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starLunch ? dayjs(settingData.starLunch, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starLunch: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endLunch ? dayjs(settingData.endLunch, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endLunch: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                </Space>

                                {/* Acceso para beneficiarios refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}>Acceso para beneficiarios refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starBeneficiarySnack ? dayjs(settingData.starBeneficiarySnack, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starBeneficiarySnack: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endBeneficiarySnack ? dayjs(settingData.endBeneficiarySnack, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endBeneficiarySnack: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                </Space>

                                {/* Acceso para venta libre refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}>Acceso para venta libre refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starSnack ? dayjs(settingData.starSnack, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starSnack: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endSnack ? dayjs(settingData.endSnack, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endSnack: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                </Space>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
                                {isEditing ? (
                                    <>

                                        {/* Mostrar "Guardar" cuando esté en modo de edición */}
                                        <Button className="button-save" type="primary" onClick={handleSaveClick} disabled={!isEditing}>
                                            Guardar
                                        </Button>

                                        {/* Mostrar "Cancelar" cuando esté en modo de edición */}
                                        <Button className="button-cancel" onClick={handleCancelClick}>
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {/* Mostrar "Crear" si no hay un settingId y no se está editando */}
                                        {!settingId && (
                                            <Button className="button-save" onClick={handleCreateClick}>
                                                Crear
                                            </Button>
                                        )}
                                        {/* Mostrar "Editar" si ya hay un setting creado */}
                                        {settingId && (
                                            <Button className="button-save" type="primary" onClick={handleEditClick}>
                                                Editar
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </MenuBecas>
            </main>
        </>
    );
};

export default SettingsAdmin;