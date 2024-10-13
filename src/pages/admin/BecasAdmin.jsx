import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import Tables from '../../components/global/Tables';
import MenuBecas from '../../components/global/MenuBecas';
import { Button, message } from 'antd';
import api from '../../api';  // Asegúrate de tener configurada la API

const BecasAdmin = () => {
  const [menuData, setMenuData] = useState({ Almuerzo: {}, Refrigerio: {} });  // Estado para almacenar el menú
  const [selectedType, setSelectedType] = useState('almuerzo');  // Estado para el tipo de menú seleccionado
  const [almuerzoReservation, setAlmuerzoReservation] = useState({ hasReservation: false, reservationId: null });  // Estado para la reserva de almuerzo
  const [refrigerioReservation, setRefrigerioReservation] = useState({ hasReservation: false, reservationId: null });  // Estado para la reserva de refrigerio
  const [loading, setLoading] = useState(false);  // Manejar el estado de carga
  const username = localStorage.getItem('username');

  // 1. Solicitar el menú desde el backend cuando el componente se monta
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');  // Ajusta la ruta al endpoint adecuado
        const menuItems = response.data;  // Aquí obtienes el arreglo de menús desde el backend

        // Dividir los menús en almuerzo y refrigerio
        const almuerzo = menuItems.find(item => item.id === 1);
        const refrigerio = menuItems.find(item => item.id === 2);

        setMenuData({ Almuerzo: almuerzo || {}, Refrigerio: refrigerio || {} });
      } catch (error) {
        console.error('Error al obtener el menú', error);
        message.error('Error al cargar el menú');
      }
    };

    fetchMenu();
  }, []);

  // 2. Verificar si el usuario ya tiene una reserva para hoy (almuerzo y refrigerio por separado)
  useEffect(() => {
    const checkReservation = async () => {
      try {
        const response = await api.get(`/reservations/per-day/${username}`);
        const reservation = response.data[0];  // Si hay alguna reserva
        if (reservation) {
          if (reservation.lunch) {
            setAlmuerzoReservation({ hasReservation: true, reservationId: reservation.reservationId });
          }
          if (reservation.snack) {
            setRefrigerioReservation({ hasReservation: true, reservationId: reservation.reservationId });
          }
        }
      } catch (error) {
        console.error('Error al verificar la reserva', error);
      }
    };

    checkReservation();
  }, [username]);

  // Función para manejar la reserva (almuerzo o refrigerio)
  const handleReserve = async () => {
    try {
      if (!username) {
        throw new Error("Username no encontrado en localStorage");
      }

      const reservationData = {
        userName: username,
        lunch: selectedType === 'almuerzo',
        snack: selectedType === 'refrigerio',
      };

      const response = await api.post('/reservations/create', reservationData);

      if (selectedType === 'almuerzo') {
        setAlmuerzoReservation({ hasReservation: true, reservationId: response.data.reservationId });
      } else {
        setRefrigerioReservation({ hasReservation: true, reservationId: response.data.reservationId });
      }

      message.success('Reserva creada con éxito');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      message.error('Error al crear la reserva');
    }
  };

  // Función para manejar la cancelación de la reserva (almuerzo o refrigerio)
  const handleCancelReservation = async () => {
    try {
      const reservationId = selectedType === 'almuerzo' ? almuerzoReservation.reservationId : refrigerioReservation.reservationId;

      if (!reservationId) {
        throw new Error("No hay una reserva activa para cancelar");
      }

      setLoading(true);

      const response = await api.delete(`/reservations/cancel/${reservationId}`);

      if (response.status === 200) {
        message.success('Reserva cancelada con éxito');
        if (selectedType === 'almuerzo') {
          setAlmuerzoReservation({ hasReservation: false, reservationId: null });
        } else {
          setRefrigerioReservation({ hasReservation: false, reservationId: null });
        }
      }
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      message.error('Error al cancelar la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Definir las columnas para cada tipo de menú
  const columnsAlmuerzo = ['Plato Principal', 'Bebida', 'Postre', 'Precio', 'Nota'];
  const columnsRefrigerio = ['Aperitivo', 'Bebida', 'Precio', 'Nota'];

  // Convertir los datos del menú en filas para la tabla
  const almuerzoRows = [
    [
      menuData?.Almuerzo?.mainDish || '',
      menuData?.Almuerzo?.drink || '',
      menuData?.Almuerzo?.dessert || '',
      menuData?.Almuerzo?.price || 0,
      menuData?.Almuerzo?.note || '',
    ],
  ];

  const refrigerioRows = [
    [
      menuData?.Refrigerio?.mainDish || '',
      menuData?.Refrigerio?.drink || '',
      menuData?.Refrigerio?.price || 0,
      menuData?.Refrigerio?.note || '',
    ],
  ];

  // Botones para seleccionar el tipo de menú
  const buttons = [
    { type: 'almuerzo', label: 'Almuerzo' },
    { type: 'refrigerio', label: 'Refrigerio' },
  ];

  return (
    <>
      <HeaderAdmin />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold">Becas de Alimentación</h1>
        <p>Nota: La beca de alimentación finaliza el 09 de diciembre.</p>

        <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>
          <Tables
            rows={selectedType === 'refrigerio' ? refrigerioRows : almuerzoRows}
            columns={selectedType === 'refrigerio' ? columnsRefrigerio : columnsAlmuerzo}
          />

          <p style={{ textAlign: 'left', marginTop: '8px' }}>
            Eres beneficiario/a de la beca tipo {selectedType}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <Button
              type="default"
              htmlType="submit"
              className="button-save"
              onClick={handleReserve}
              disabled={(selectedType === 'almuerzo' ? almuerzoReservation.hasReservation : refrigerioReservation.hasReservation) || loading}
            >
              {loading ? 'Reservando...' : 'Reservar'}
            </Button>

            <Button
              type="default"
              htmlType="reset"
              className="button-cancel"
              onClick={handleCancelReservation}
              disabled={!(selectedType === 'almuerzo' ? almuerzoReservation.hasReservation : refrigerioReservation.hasReservation) || loading}
            >
              {loading ? 'Cancelando...' : 'Cancelar reserva'}
            </Button>
          </div>
        </MenuBecas>
      </main>
    </>
  );
};

export default BecasAdmin;
