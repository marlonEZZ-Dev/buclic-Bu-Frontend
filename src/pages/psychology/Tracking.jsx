import HeaderPsych from "../../components/psychology/HeaderPsych";
import React, { useState } from 'react';
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import StateUser from "../../components/global/StateUser.jsx"; // Importa el componente StateUser
import { Card, Space, Button, Descriptions, DatePicker, TimePicker, Row, Col } from 'antd';
import api from '../../api.js';

const AssistanceIcon = ({ attended, id }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <StateUser active={attended} /> {/* No pasa `key` aquí */}
    </div>
);

const Tracking = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const person = {
        name: 'John Doe',
        code: 2255675,
        dateTime: new Date().toLocaleString(),
        plan: '2724',
    };

    // Datos para la tabla
    const columns = ['Horario cita', 'Psicólogo(a)', 'Asistencia'];
    const rows = [
        [person.code, person.name, <AssistanceIcon attended={true} id={person.code} />],
        [person.code + 1, person.name + ' 1', <AssistanceIcon attended={false} id={person.code + 1} />],
        [person.code + 2, person.name + ' 2', <AssistanceIcon attended={true} id={person.code + 2} />],
    ];

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    const handleSave = () => {
        console.log("Fecha seleccionada:", selectedDate);
        console.log("Hora seleccionada:", selectedTime);
    };

    const handleCancel = () => {
        setSelectedDate(null);
        setSelectedTime(null);
    };

    return (
        <>
            <HeaderPsych/>
            
            <main className="becas-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Seguimientos</h1>
                <p>Aquí puedes buscar a los pacientes con las citas que han solicitado</p>
                <Card bordered={true} style={styles.card}>
                    
                    <div style={styles.searchContainer}>
                        <SearchInput />
                    </div>

                    {/* Información de la persona con Descriptions */}
                    <h3 style={styles.sectionTitle}>Información del paciente</h3>
                    <Descriptions bordered column={1} style={styles.descriptions}>
                        <Descriptions.Item label={<span style={styles.boldLabel}>Nombre</span>} className="descriptions-item">
                            {person.name}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={styles.boldLabel}>Código/Cédula</span>} className="descriptions-item">
                            {person.code}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={styles.boldLabel}>Programa</span>} className="descriptions-item">
                            {person.dateTime}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={styles.boldLabel}>Semestre</span>} className="descriptions-item">
                            {person.plan}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={styles.boldLabel}>Telefono</span>} className="descriptions-item">
                            {person.plan}
                        </Descriptions.Item>

                    </Descriptions>

                    {/* Agendar próxima cita */}
                    <h3 style={styles.sectionTitle}>Agendar próxima cita</h3>
                    <div style={styles.scheduleContainer}>
                        <div style={styles.dateTimeSection}>
                            <Row style={styles.headerRow}>
                                <Col span={12} style={styles.headerCell}>Fecha</Col>
                                <Col span={12} style={styles.headerCell}>Hora</Col>
                            </Row>
                            <Row gutter={16} style={styles.inputRow}>
                                <Col span={12}>
                                    <DatePicker 
                                        onChange={handleDateChange} 
                                        value={selectedDate} 
                                        style={{ width: '100%' }} 
                                        placeholder="Fecha" 
                                    />
                                </Col>
                                <Col span={12}>
                                    <TimePicker 
                                        onChange={handleTimeChange} 
                                        value={selectedTime} 
                                        style={{ width: '100%' }} 
                                        placeholder="Hora" 
                                        format="HH:mm"
                                    />
                                </Col>
                            </Row>
                            <Row justify="center" style={styles.buttonRow}>
                                <Space size={20}>
                                    <Button type="primary" onClick={handleSave} className="button-save">Guardar</Button>
                                    <Button onClick={handleCancel} className="button-cancel">Cancelar</Button>
                                </Space>
                            </Row>
                        </div>
                    </div>

                    {/* Título de la tabla */}
                    <h3 style={styles.tableTitle}>Tabla de citas solicitadas</h3>

                    {/* Componente de Tabla con Paginación */}
                    <TablePagination
                        rows={rows}
                        columns={columns}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </Card>
            </main>
        </>
    );
};

const styles = {
    main: {
        marginTop: '100px',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: '700px',
        marginTop: '100px',
        margin: '3px auto',
        justifyContent: 'center',
    },
    titleSpace: {
        marginTop: '5px',
        alignItems: 'center',
    },
    descriptions: {
        marginTop: '15px',
        width: '100%',
        margin: 'auto',
    },
    boldLabel: {
        fontWeight: 'bold',
    },
    searchContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '15px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    dateTimeSection: {
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '10px',
        paddingBottom: '10px',
    },
    headerRow: {
        backgroundColor: '#e0e0e0',
        padding: '10px',
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
    },
    headerCell: {
        textAlign: 'center',
    },
    inputRow: {
        padding: '10px',
    },
    buttonRow: {
        paddingTop: '10px',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#D32F2F',
        borderColor: '#D32F2F',
        color: 'white',
    },
    cancelButton: {
        color: '#D32F2F',
        borderColor: '#D32F2F',
    },
    scheduleContainer: {
        marginTop: '20px',
        marginBottom: '20px',
    },
    tableTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '20px',
        marginBottom: '10px',
        textAlign: 'left',
    },
};

export default Tracking;
