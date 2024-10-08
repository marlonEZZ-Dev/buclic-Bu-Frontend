import React, { useState, useEffect } from 'react';
import { useSettings } from '../../utils/SettingsContext';  // Importar el contexto
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import MenuBecas from '../../components/global/MenuBecas';
import { Button, Form, Input, Space, DatePicker, TimePicker, message } from 'antd';
import axios from '../../api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SettingsAdmin = () => {
    const { settingId, setSettingId, settingData, setSettingData } = useSettings();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState('perfil');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSetting = async () => {
            if (settingId) {
                try {
                    const response = await axios.get(`/setting/${settingId}`);
                    setSettingData(response.data.settingRequest);
                } catch (error) {
                    message.error('Error al cargar los ajustes.');
                }
            }
        };
        fetchSetting();
    }, [settingId, setSettingData]);

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
                await axios.put('/setting', { ...settingData, id: settingId });
                message.success('Ajustes guardados exitosamente.');
            } else {
                const response = await axios.post('/setting', settingData);
                setSettingId(response.data.id);
                setSettingData(response.data.settingRequest);
                message.success('Ajustes creados exitosamente.');
            }
            setIsEditing(false);
        } catch (error) {
            message.error('Error al guardar los ajustes.');
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };
    const handleChangePasswordClick = () => {
        navigate('/contrasenaAdmin');
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ width: '48%' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}>No. Becas almuerzo</label>
                                        <Input
                                            type="number"
                                            placeholder="Ingrese el número de becas para almuerzo"
                                            disabled={!isEditing}
                                            value={settingData?.numLunch || ''}
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
                                            value={settingData?.numSnack || ''}
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
                                        value={settingData?.starBeneficiaryLunch ? dayjs(settingData.starBeneficiaryLunch, 'HH:mm') : null}
                                        onChange={(time) => setSettingData((prev) => ({
                                            ...prev,
                                            starBeneficiaryLunch: time ? time.format('HH:mm') : null,
                                        }))}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '48%' }}
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
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para venta libre almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
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
                                        style={{ width: '48%' }}
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
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para beneficiarios refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
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
                                        style={{ width: '48%' }}
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
                                <p style={{ marginTop: '20px', textAlign: 'left' }}>Acceso para venta libre refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '58%' }}
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
                                        style={{ width: '48%' }}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                {isEditing ? (
                                    <>
                                        {/* Mostrar "Cancelar" cuando esté en modo de edición */}
                                        <Button onClick={handleCancelClick}>
                                            Cancelar
                                        </Button>
                                        {/* Mostrar "Guardar" cuando esté en modo de edición */}
                                        <Button type="primary" onClick={handleSaveClick} disabled={!isEditing}>
                                            Guardar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {/* Mostrar "Crear" si no hay un settingId y no se está editando */}
                                        {!settingId && (
                                            <Button onClick={handleCreateClick}>
                                                Crear
                                            </Button>
                                        )}
                                        {/* Mostrar "Editar" si ya hay un setting creado */}
                                        {settingId && (
                                            <Button type="primary" onClick={handleEditClick}>
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