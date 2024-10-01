
import React, { useState } from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import { Card, Space, Button, Descriptions } from 'antd';

const Reservations = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Máximo de elementos por página

    const person = {
        name: 'John Doe',
        code: 2255675,
        dateTime: new Date().toLocaleString(),
        typeBeca: 'Almuerzo',
    };

    // Datos para la tabla
    const columns = ['Código', 'Nombre', 'Plan', 'Hora de Reserva'];
    const rows = Array.from({ length: 25 }, (_, index) => [person.code + index, person.name + ' ' + index, person.typeBeca, person.dateTime]); // Simulación de más datos

    return (
        <>
            <HeaderAdmin />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={true}
                    style={{ width: '700px', marginTop: '100px', margin: '3px auto', justifyContent: 'center' }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Reservas realizadas</h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <SearchInput />
                    </div>

                    {/* Información de la persona con Descriptions */}
                    <Descriptions
                        title="Información de la persona"
                        className="descriptions-title"
                        bordered
                        column={1}
                        style={{ marginTop: '15px', width: '70%', margin: 'auto' }}
                    >
                        <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>} className="descriptions-item">
                            {person.name}
                        </Descriptions.Item>

                        <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código</span>} className="descriptions-item">
                            {person.code}
                        </Descriptions.Item>

                        <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha y hora de la reserva</span>} className="descriptions-item">
                            {person.dateTime}
                        </Descriptions.Item>

                        <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Tipo beca</span>} className="descriptions-item">
                            {person.typeBeca}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Botón "Pagó" */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#52C41A', borderColor: '#52C41A', color: 'white' }}
                        >
                            Pagó
                        </Button>
                        <Button
                            type="default"
                            htmlType="reset"
                            className="button-cancel"
                        >
                            Cancelar reserva
                        </Button>
                    </div>


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

export default Reservations;
