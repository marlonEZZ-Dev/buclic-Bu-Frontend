import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import MenuBecas from '../../components/global/MenuBecas';
import { Button, Form, Input, Space, DatePicker, TimePicker, message } from 'antd';
import axios from '../../api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SettingsAdmin = () => {
    const [selectedType, setSelectedType] = useState('perfil');
    const [isEditing, setIsEditing] = useState(false);
    const [settingData, setSettingData] = useState({
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
        endSnack: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedType === 'ajustesBecas') {
            fetchSetting(); // Solo llama a fetchSetting cuando se selecciona la pestaña de Becas
        }
    }, [selectedType]);

    const fetchSetting = async () => {
        try {
            const response = await axios.get('/setting/1');
            const data = response.data.settingRequest;

            setSettingData({
                id: data.id,
                startSemester: dayjs(data.startSemester),
                endSemester: dayjs(data.endSemester),
                numLunch: data.numLunch,
                numSnack: data.numSnack,
                starBeneficiaryLunch: dayjs(data.starBeneficiaryLunch, 'HH:mm:ss'),
                endBeneficiaryLunch: dayjs(data.endBeneficiaryLunch, 'HH:mm:ss'),
                starLunch: dayjs(data.starLunch, 'HH:mm:ss'),
                endLunch: dayjs(data.endLunch, 'HH:mm:ss'),
                starBeneficiarySnack: dayjs(data.starBeneficiarySnack, 'HH:mm:ss'),
                endBeneficiarySnack: dayjs(data.endBeneficiarySnack, 'HH:mm:ss'),
                starSnack: dayjs(data.starSnack, 'HH:mm:ss'),
                endSnack: dayjs(data.endSnack, 'HH:mm:ss'),
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si el recurso no se encuentra (404), no se hace nada. El estado ya se resetea.
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
            } else {
                // Si es otro tipo de error, lo mostramos en consola y al usuario.
                console.error('Error al obtener la configuración:', error);
                message.error('Error al obtener la configuración');
            }
        }
    };




    const handleChangePasswordClick = () => {
        navigate('/contrasenaAdmin');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCreateClick = async () => {
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
            const payload = {
                ...settingData,
                startSemester: settingData.startSemester ? settingData.startSemester.format('YYYY-MM-DD') : null,
                endSemester: settingData.endSemester ? settingData.endSemester.format('YYYY-MM-DD') : null,
                starBeneficiaryLunch: settingData.starBeneficiaryLunch ? settingData.starBeneficiaryLunch.format('HH:mm:ss') : null,
                endBeneficiaryLunch: settingData.endBeneficiaryLunch ? settingData.endBeneficiaryLunch.format('HH:mm:ss') : null,
                starLunch: settingData.starLunch ? settingData.starLunch.format('HH:mm:ss') : null,
                endLunch: settingData.endLunch ? settingData.endLunch.format('HH:mm:ss') : null,
                starBeneficiarySnack: settingData.starBeneficiarySnack ? settingData.starBeneficiarySnack.format('HH:mm:ss') : null,
                endBeneficiarySnack: settingData.endBeneficiarySnack ? settingData.endBeneficiarySnack.format('HH:mm:ss') : null,
                starSnack: settingData.starSnack ? settingData.starSnack.format('HH:mm:ss') : null,
                endSnack: settingData.endSnack ? settingData.endSnack.format('HH:mm:ss') : null,
            };

            let response;
            if (settingData.id) {
                // Si ya tiene ID, es una actualización
                response = await axios.put('/setting', payload);
                message.success('Configuración actualizada exitosamente');
            } else {
                // Si no tiene ID, es una creación
                response = await axios.post('/setting', payload);
                message.success('Configuración creada exitosamente');
            }

            // Aquí llamamos a fetchSetting después de crear o actualizar
            await fetchSetting();

            setIsEditing(false); // Cambiar a modo no-edición
        } catch (error) {
            message.error('Error al guardar la configuración');
            console.error(error);
        }
    };


    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const buttons = [
        { type: 'perfil', label: 'Perfil' },
        { type: 'ajustesBecas', label: 'Becas' },
    ];

    return (
        <>
            <HeaderAdmin />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>
                    {selectedType === 'perfil' ? (
                        <Form layout="vertical" style={{ marginTop: '8px' }}>
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
                                <Button className="button-actionsGeneral" type="primary" onClick={handleChangePasswordClick}>
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
                                        settingData.startSemester ? settingData.startSemester : null,
                                        settingData.endSemester ? settingData.endSemester : null,
                                    ]}
                                    onChange={(dates) => {
                                        setSettingData((prev) => ({
                                            ...prev,
                                            startSemester: dates ? dates[0] : null,
                                            endSemester: dates ? dates[1] : null,
                                        }));
                                    }}
                                    allowEmpty={[true, true]}  // Agrega allowEmpty para permitir campos vacíos
                                />
                            </Space>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ width: '48%' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}>No. Becas almuerzo</label>
                                        <Input
                                            type="number"
                                            placeholder="Ingrese el número de becas para almuerzo"
                                            disabled={!isEditing}
                                            value={settingData.numLunch}
                                            onChange={(e) => setSettingData((prev) => ({
                                                ...prev,
                                                numLunch: e.target.value,
                                            }))}
                                        />
                                    </div>
                                    <div style={{ width: '48%' }}>
                                        <label style={{ display: 'block' }}>No. Becas refrigerio</label>
                                        <Input
                                            type="number"
                                            placeholder="Ingrese el número de becas para refrigerio"
                                            disabled={!isEditing}
                                            value={settingData.numSnack}
                                            onChange={(e) => setSettingData((prev) => ({
                                                ...prev,
                                                numSnack: e.target.value,
                                            }))}
                                        />
                                    </div>
                                </div>
                                {/* Accesos y horarios */}
                                {/* Acceso para beneficiarios almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para beneficiarios almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.starBeneficiaryLunch}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starBeneficiaryLunch: time,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '48%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.endBeneficiaryLunch}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endBeneficiaryLunch: time,
                                        }))}
                                    />
                                </Space>
                                {/* Acceso para venta libre almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para venta libre almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.starLunch}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starLunch: time,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '48%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.endLunch}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endLunch: time,
                                        }))}
                                    />
                                </Space>
                                {/* Acceso para beneficiarios refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para beneficiarios refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.starBeneficiarySnack}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starBeneficiarySnack: time,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '48%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.endBeneficiarySnack}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endBeneficiarySnack: time,
                                        }))}
                                    />
                                </Space>
                                {/* Acceso para venta libre refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para venta libre refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.starSnack}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starSnack: time,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '48%' }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData.endSnack}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            endSnack: time,
                                        }))}
                                    />
                                </Space>
                                {/* Botones para guardar/cancelar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {isEditing ? (
                                        <>
                                            <Button className="button-actionsGeneral" onClick={handleSaveClick}>
                                                Guardar
                                            </Button>
                                            <Button className="button-actionsGeneral" onClick={handleCancelClick}>
                                                Cancelar
                                            </Button>
                                        </>
                                    ) : (
                                        // Si no hay datos en settingData, muestra "Crear"
                                        <>
                                            {!settingData.id ? (
                                                <Button className="button-actionsGeneral" onClick={handleCreateClick}>
                                                    Crear
                                                </Button>
                                            ) : (
                                                <Button className="button-actionsGeneral" onClick={handleEditClick}>
                                                    Editar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </MenuBecas>
            </main>
        </>
    );
};

export default SettingsAdmin;