import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Form, Input, Calendar, theme, ConfigProvider, Row, Col } from 'antd';
import SchedulingTable from '../../components/global/SchedulingTable';
import esES from 'antd/es/locale/es_ES';  // Importar el locale para español

const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

const headers = ['Nombre', 'Fecha', 'Hora', 'Ubicación'];
const rows = [
    ['Juan Pérez', '2024-10-01', '10:00 AM', 'Oficina 1'],
    ['Ana Gómez', '2024-10-02', '11:00 AM', 'Oficina 2'],
    ['Carlos Ruiz', '2024-10-03', '12:00 PM', 'Oficina 3'],
];

const Psychologist = () => {

    const { token } = theme.useToken();

    const wrapperStyle = {
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: '16px',
        width: '100%',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    };

    const leftColumnStyle = {
        flex: '1',
        marginRight: '20px', // Espacio entre el calendario y la tabla
    };

    const rightColumnStyle = {
        flex: '1',
    };

    const formWrapperStyle = {
        marginBottom: '20px',
    };

    return (
        <>
            <TopNavbar />
            <main className="psicologia-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Cita psicología</h1>
                <p className="text-md">Nota: La beca de alimentación finaliza el 09 de diciembre.</p>

                {/* Formulario en la parte superior con distribución horizontal */}
                <Form layout="vertical" style={formWrapperStyle}>
                    <Row gutter={16}> {/* Configuración para colocar los campos de forma horizontal */}
                        <Col span={6}>
                            <Form.Item label="Nombre">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Teléfono">
                                <Input type="number" placeholder="input placeholder" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Programa académico">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Semestre">
                                <Input type="number" placeholder="input placeholder" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div style={containerStyle}>
                    {/* Columna izquierda - Calendario */}
                    <div style={leftColumnStyle}>
                        <ConfigProvider locale={esES}>  {/* Configuración del locale a español */}
                            <div style={wrapperStyle}>
                                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                            </div>
                        </ConfigProvider>
                    </div>

                    {/* Columna derecha - Tabla de programación */}
                    <div style={rightColumnStyle}>
                        <SchedulingTable headers={headers} rows={rows} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Psychologist;


