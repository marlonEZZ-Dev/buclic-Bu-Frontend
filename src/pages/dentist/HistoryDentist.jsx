import { useState } from 'react';
import { Card, Button, Modal, Descriptions, Table, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import HeaderDentist from "../../components/dentist/HeaderDentist"; // Importación del header específico

const HistoryDentistry = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Datos de ejemplo para mostrar en la tabla
    const visitsData = [
        { key: '1', date: '30/09/2024', name: 'Mario Sánchez', document: '123456789' },
        { key: '2', date: '05/10/2024', name: 'Carolina Perez', document: '202056211' },
    ];

    // Columnas para la tabla de visitas
    const columns = [
        { title: 'Fecha cita', dataIndex: 'date', key: 'date' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Código/Cédula', dataIndex: 'document', key: 'document' },
        {
            title: 'Detalles cita',
            key: 'action',
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
                    onClick={() => showVisitDetail(record)}
                />
            ),
        },
    ];

    // Función para mostrar el modal con detalles
    const showVisitDetail = (visit) => {
        setSelectedVisit(visit);
        setIsModalVisible(true);
    };

    // Cierra el modal y limpia el registro seleccionado
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedVisit(null);
    };

    return (
        <>
            <HeaderDentist /> {/* Header específico de odontología */}
            <main style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1 style={{ color: '#C20E1A', fontSize: '24px', fontWeight: 'bold' }}>Historial de visitas</h1>
                <p>Aquí se podrán buscar las visitas por paciente o fecha que se han realizado en el servicio.</p>
                <Card
                    bordered={true}
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        margin: '20px auto',
                        padding: '20px',
                        textAlign: 'left',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <Input
                            placeholder="Código/Cédula paciente"
                            style={{ width: '80%', marginRight: '8px' }}
                        />
                        <Button icon={<SearchOutlined />} />
                    </div>
                    <p style={{ fontWeight: 'bold' }}>Tabla de actividades realizadas</p>
                    <Table columns={columns} dataSource={visitsData} pagination={{ pageSize: 5 }} />
                </Card>
                {/* Modal para detalles de la visita */}
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la Visita
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedVisit ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Nombre">{selectedVisit.name}</Descriptions.Item>
                            <Descriptions.Item label="Código/Cédula">{selectedVisit.document}</Descriptions.Item>
                            <Descriptions.Item label="Plan/Área dependencia">7156</Descriptions.Item>
                            <Descriptions.Item label="Fecha de visita">{selectedVisit.date}</Descriptions.Item>
                            <Descriptions.Item label="Diagnóstico">Dolor de cabeza</Descriptions.Item>
                            <Descriptions.Item label="Conducta">
                                La paciente presentaba un dolor de cabeza leve por lo que se le suministró un acetaminofén
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la visita...</p>
                    )}
                </Modal>
            </main>
        </>
    );
};

export default HistoryDentistry;
