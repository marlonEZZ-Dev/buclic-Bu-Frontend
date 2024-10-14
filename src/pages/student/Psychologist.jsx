
import React, { useEffect, useState } from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Form, Input, Calendar, theme, ConfigProvider, Row, Col, message } from 'antd';
import SchedulingTable from '../../components/global/SchedulingTable';
import esES from 'antd/es/locale/es_ES';  
import moment from 'moment';
import api from '../../api.js';

const Psychologist = () => {
    const { token } = theme.useToken();
    const [userInfo, setUserInfo] = useState({});
    const [selectedDate, setSelectedDate] = useState(moment());  // Fecha actual por defecto
    const [availableDates, setAvailableDates] = useState([]);
    const [filteredDates, setFilteredDates] = useState([]);
    const [phone, setPhone] = useState('');
    const [eps, setEps] = useState('');

    // Recupera la información del usuario desde localStorage
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
            console.log('User info cargado desde localStorage:', JSON.parse(storedUserInfo));
        } else {
            console.error('No se encontró userInfo en localStorage');
        }
    }, []);

    // Realiza la solicitud GET para obtener los horarios disponibles
    useEffect(() => {
        const storedToken = localStorage.getItem('ACCESS_TOKEN');

        api.get('/appointment?type=PSICOLOGIA', {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        })
        .then((response) => {
            console.log('Horarios obtenidos:', response.data.availableDates);
            setAvailableDates(response.data.availableDates);
            // Filtrar los horarios del día actual por defecto
            filterDatesBySelectedDay(moment().format('YYYY-MM-DD'), response.data.availableDates);
        })
        .catch((error) => {
            console.error('Error al obtener los horarios:', error);
        });
    }, []);

    // Función para reservar una cita
    const handleReserveAppointment = (availableDateId) => {
        const pacientId = userInfo.id;

        if (!pacientId || !availableDateId) {
            message.error('Error: Información de usuario incompleta. Por favor, inicie sesión nuevamente.');
            return;
        }

        console.log('Datos de la reserva:', { pacientId, availableDateId });

        const storedToken = localStorage.getItem('ACCESS_TOKEN');

        api.post('/appointment-reservation', {
            pacientId: pacientId,
            availableDateId: availableDateId,
        }, {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            message.success(response.data.message);
            // Actualizar filteredDates eliminando el horario reservado
            setFilteredDates(prevDates =>
                prevDates.filter(date => date.id !== availableDateId)  // Eliminar el horario reservado
            );
        })
        .catch(error => {
            console.error('Error al reservar la cita:', error.response ? error.response.data : error.message);
            message.error('Hubo un error al reservar la cita. Inténtelo de nuevo.');
        });
    };

    // Filtrar los horarios por la fecha seleccionada
    const filterDatesBySelectedDay = (formattedSelectedDate, dates = availableDates) => {
        const filtered = dates.filter((item) => {
            const itemDate = moment(item.dateTime).format('YYYY-MM-DD');
            // Solo mostrar horarios disponibles
            return itemDate === formattedSelectedDate && item.available === true;
        });
        setFilteredDates(filtered);
    };

    // Maneja la selección de la fecha del calendario
    const onDateSelect = (date) => {
        if (date && date.isValid()) {
            const formattedDate = date.format('YYYY-MM-DD');
            setSelectedDate(formattedDate);
            filterDatesBySelectedDay(formattedDate);
        } else {
            console.error('Fecha inválida seleccionada');
        }
    };

    // Función para deshabilitar las fechas sin horarios disponibles, pero nunca deshabilitar el día actual
    const disabledDate = (currentDate) => {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD'); // Obtenemos la fecha actual
        // Si la fecha es la actual, no la deshabilites
        if (formattedDate === today) {
            return false;
        }
        // Deshabilitar solo si no hay horarios disponibles para esa fecha
        return !availableDates.some(item => moment(item.dateTime).format('YYYY-MM-DD') === formattedDate && item.available === true);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPhone(value);
    };

    const wrapperStyle = {
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: '16px',
        width: '70%',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: '20px',
    };

    const leftColumnStyle = {
        flex: '1',
        marginRight: '30px',
        minWidth: '300px',
    };

    const rightColumnStyle = {
        flex: '1',
        minWidth: '300px',
    };

    const formWrapperStyle = {
        marginBottom: '20px',
    };

    // Definimos las cabeceras que pide el usuario
    const headers = ['Hora', 'Lugar de atención', `Fecha: ${selectedDate}`];

    return (
        <>
            <TopNavbar />
            <main className="psicologia-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Cita psicología</h1>

                {userInfo.name && (
                    <Form layout="vertical" style={formWrapperStyle}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Nombre">
                                    <Input value={userInfo.name || ''} disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Programa académico">
                                    <Input value={userInfo.plan || ''} disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Correo">
                                    <Input value={userInfo.email || ''} disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Código">
                                    <Input value={userInfo.username || ''} disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Teléfono">
                                    <Input 
                                        type="text"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Ingrese su teléfono"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="EPS">
                                    <Input 
                                        type="text"
                                        value={eps}
                                        onChange={(e) => setEps(e.target.value)}
                                        placeholder="Ingrese su EPS"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}

                <div style={containerStyle}>
                    <div style={leftColumnStyle}>
                        <ConfigProvider locale={esES}>
                            <div style={wrapperStyle}>
                                <Calendar fullscreen={false} onSelect={onDateSelect} disabledDate={disabledDate} />
                            </div>
                        </ConfigProvider>
                    </div>

                    <div style={rightColumnStyle}>
                        {filteredDates.length > 0 ? (
                            <SchedulingTable 
                                headers={headers} 
                                appointments={filteredDates} 
                                onReserve={handleReserveAppointment} 
                            />
                        ) : (
                            <p>No hay horarios disponibles para la fecha seleccionada.</p>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Psychologist;
