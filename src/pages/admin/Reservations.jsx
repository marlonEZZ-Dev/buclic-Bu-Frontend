import React, { useState } from 'react';
import api from '../../api';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import { Card, Space, Descriptions, Button, message } from 'antd';

const Reservations = () => {
    const [reservationData, setReservationData] = useState(null);

    const handleSearch = async (username) => {
        try {
            const response = await api.get(`/reservations/by-username/${username}`);
            setReservationData(response.data[0]); // Aquí traes la respuesta
        } catch (error) {
            message.error('No se pudo encontrar la reserva para el usuario.');
            setReservationData(null); // Limpiar si no hay resultados
        }
    };

    // Función para registrar el pago
    const handlePayment = async () => {
        if (!reservationData) {
            console.log("No hay datos de reserva disponibles.");
            return;
        }

        try {
            // Verifica el ID de la reserva y el username
            console.log("Datos de reserva:", reservationData);
            console.log("Intentando registrar pago para el usuario:", reservationData.userName);

            const paymentRequest = {
                username: reservationData.userName, // Enviar el nombre de usuario
                paid: true, // Indicar que se ha pagado
            };

            const response = await api.put('/reservations/register-payment', paymentRequest);

            // Verifica la respuesta del backend
            console.log("Respuesta del servidor:", response.data);

            // Mostrar mensaje de éxito
            message.success(response.data.message);

            // Limpiar los datos de la reserva después de registrar el pago
            setReservationData(null);
        } catch (error) {
            // Muestra el error si algo sale mal
            console.error("Error al intentar registrar el pago:", error);
            message.error('No se pudo registrar el pago.');
        }
    };

    const handleCancel = async () => {
        if (!reservationData) {
            console.log("No hay datos de reserva disponibles para cancelar.");
            return;
        }

        try {
            // Verifica el ID de la reserva
            console.log("Intentando cancelar la reserva con ID:", reservationData.reservationId);

            const response = await api.delete(`/reservations/cancel/${reservationData.reservationId}`);

            // Verifica la respuesta del backend
            console.log("Respuesta del servidor:", response.data);

            // Mostrar mensaje de éxito
            message.success(response.data.message);

            // Limpiar los datos de la reserva después de cancelar
            setReservationData(null);
        } catch (error) {
            // Muestra el error si algo sale mal
            console.error("Error al intentar cancelar la reserva:", error);
            message.error('No se pudo cancelar la reserva.');
        }
    };



    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD (ISO)
    };

    // Función para formatear la hora
    const formatTime = (timeString) => {
        return timeString.substring(0, 8); // Solo los primeros 8 caracteres "hh:mm:ss"
    };

    // Estilos personalizados para los botones
    const styles = {
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
        },
        payButton: {
            marginRight: '10px',
        },
    };

    return (
        <>
            <HeaderAdmin />
            <main
                style={{
                    marginTop: '100px',
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Card
                    bordered={true}
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        marginTop: '100px',
                        margin: '3px auto',
                        justifyContent: 'center'
                    }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Reservas realizadas</h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px'
                        }}
                    >
                        <SearchInputR onSearch={handleSearch} />
                    </div>

                    {/* Información de la persona con Descriptions */}
                    {reservationData && (
                        <>
                            <Descriptions
                                title="Información de la persona"
                                className="descriptions-title"
                                bordered
                                column={1}
                                style={{
                                    marginTop: '15px',
                                    width: '100%',
                                    margin: 'auto'
                                }}
                            >
                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>} className="descriptions-item">
                                    {`${reservationData.name} ${reservationData.lastname}`}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código</span>} className="descriptions-item">
                                    {reservationData.userName}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha y hora de la reserva</span>} className="descriptions-item">
                                    {`${formatDate(reservationData.date)} ${formatTime(reservationData.time)}`}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Tipo beca</span>} className="descriptions-item">
                                    {reservationData.lunch && reservationData.snack
                                        ? "Almuerzo y Refrigerio"
                                        : reservationData.lunch
                                            ? "Almuerzo"
                                            : reservationData.snack
                                                ? "Refrigerio"
                                                : "Sin beneficio"}
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Botones */}
                            <div style={styles.buttonContainer}>
                                <Button type="primary" style={styles.payButton} onClick={handlePayment}>
                                    Pagó
                                </Button>
                                <Button type="default" htmlType="reset" className="button-cancel" onClick={handleCancel}>
                                    Cancelar reserva
                                </Button>

                            </div>
                        </>
                    )}

                    {/* Componente de Tabla con Paginación */}
                    <TablePagination
                        rows={[]}  // Eliminar datos de ejemplo
                        columns={['Código', 'Nombre', 'Plan', 'Hora de Reserva']} // Columnas de ejemplo
                        currentPage={1}  // Página inicial
                        itemsPerPage={10}  // Elementos por página
                        onPageChange={() => { }}  // Eliminamos lógica de paginación
                    />
                </Card>
            </main>
        </>
    );
};

export default Reservations;
