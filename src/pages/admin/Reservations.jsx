import React, { useState, useEffect } from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import { Card, Space, Button, Descriptions } from 'antd';
import api from '../../api';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const formatDateTime = (fullDateTime) => {
        const [date, timeWithMs] = fullDateTime.split("T");
        const time = timeWithMs.split(".")[0];
        return { date, time };
    };

    // Obtener reservas del backend
    const fetchReservations = async (page) => {
        try {
            const response = await api.get(`reservations/all?page=${page - 1}&size=${itemsPerPage}`);
            const { content, totalElements } = response.data;
            setReservations(content);
            setTotalItems(totalElements);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    return (
        <>
            <HeaderAdmin />
            <main
                style={{
                    marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center'
                }}
            >
                <Card
                    bordered={true}
                    style={{
                        width: '100%', maxWidth: '700px', marginTop: '100px', margin: '3px auto', justifyContent: 'center'
                    }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Reservas realizadas</h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>

                    <div
                        style={{
                            width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'
                        }}
                    >
                        <SearchInput />
                    </div>

                    {/* Información de la persona con Descriptions (esto es opcional) */}

                    {/* Componente de Tabla con Paginación */}
                    <TablePagination
                        rows={reservations.map(reservation => {
                            const { date, time } = formatDateTime(reservation.data); // Extraer fecha y hora

                            return [
                                reservation.id,
                                reservation.username,
                                reservation.lunch ? 'Almuerzo' : 'Refrigerio',
                                `${date} ${time}` // Mostrar fecha y hora en una sola celda, o separarlas si prefieres
                            ];
                        })}
                        columns={['Código', 'Nombre', 'Tipo de Beca', 'Hora de Reserva']}
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
