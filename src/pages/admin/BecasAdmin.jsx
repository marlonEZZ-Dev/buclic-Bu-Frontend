import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import Tables from '../../components/global/Tables';
import MenuBecas from '../../components/global/MenuBecas';
import { Button, message } from 'antd';
import api from '../../api';

const BecasAdmin = () => {
  const [menuData, setMenuData] = useState({ Almuerzo: {}, Refrigerio: {} });  // Estado para almacenar el menú
  const [selectedType, setSelectedType] = useState('almuerzo');  // Estado para el tipo de menú seleccionado
  const [almuerzoReservation, setAlmuerzoReservation] = useState({ hasReservation: false, reservationId: null, date: null, time: null });
  const [refrigerioReservation, setRefrigerioReservation] = useState({ hasReservation: false, reservationId: null, date: null, time: null });
  const [loading, setLoading] = useState(false);  // Manejar el estado de carga
  const [settings, setSettings] = useState(null);  // Estado para almacenar las configuraciones de becas
  const [benefitType, setBenefitType] = useState(''); // Estado para el tipo de beneficio

  const username = localStorage.getItem('username');
  const [availability, setAvailability] = useState({ remainingSlotsLunch: 0, remainingSlotsSnack: 0 });


  // Solicitar el menú desde el backend cuando el componente se monta
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

  // Verificar si el usuario ya tiene una reserva para hoy (almuerzo y refrigerio por separado)
  useEffect(() => {
    const checkReservation = async () => {
      try {
        const response = await api.get(`/reservations/per-day/${username}`);
        const reservations = response.data;

        reservations.forEach(reservation => {
          if (reservation.lunch) {
            setAlmuerzoReservation({
              hasReservation: true,
              reservationId: reservation.reservationId,
              date: reservation.date,
              time: reservation.time
            });
          }
          if (reservation.snack) {
            setRefrigerioReservation({
              hasReservation: true,
              reservationId: reservation.reservationId,
              date: reservation.date,
              time: reservation.time
            });
          }
        });
      } catch (error) {
        console.error('Error al verificar la reserva', error);
      }
    };

    checkReservation();
  }, [username]);



  // Obtener el tipo de beneficio del usuario
  useEffect(() => {
    const fetchUserBenefits = async () => {
      try {
        const response = await api.get(`/users/${username}`); // Ajusta la ruta según tu backend
        const userBenefits = response.data; // Asegúrate de que esto contenga el tipo de beneficio

        // Asignar el tipo de beneficio, cambiando 'Sin beneficios' a 'venta libre'
        setBenefitType(userBenefits.benefitType === 'Sin beneficios' ? 'venta libre' : userBenefits.benefitType);
      } catch (error) {
        console.error('Error al obtener beneficios del usuario:', error);
      }
    };

    fetchUserBenefits();
  }, [username]);


  // Obtiene las configuraciones para reservar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/setting');
        setSettings(response.data[0]?.settingRequest);  // Almacena solo el objeto de configuración
      } catch (error) {
        console.error('Error al obtener las configuraciones', error);
      }
    };

    fetchSettings();
  }, []);


  // Función para manejar la reserva (almuerzo o refrigerio)
  const handleReserve = async () => {
    try {
      if (!username) {
        throw new Error("Username no encontrado en localStorage");
      }

      // Verificar disponibilidad de reservas
      if (selectedType === 'almuerzo' && availability.remainingSlotsLunch === 0) {
        message.error('No hay reservas disponibles para almuerzo');
        return; // Salir de la función si no hay disponibilidad
      }

      if (selectedType === 'refrigerio' && availability.remainingSlotsSnack === 0) {
        message.error('No hay reservas disponibles para refrigerio');
        return; // Salir de la función si no hay disponibilidad
      }

      const reservationData = {
        userName: username,
        lunch: selectedType === 'almuerzo',
        snack: selectedType === 'refrigerio',
      };

      const response = await api.post('/reservations/create', reservationData);

      // Actualizar la reserva inmediatamente con los datos del backend
      if (selectedType === 'almuerzo') {
        setAlmuerzoReservation({
          hasReservation: true,
          reservationId: response.data.reservationId,
          date: response.data.date,  // Asigna la fecha de la respuesta
          time: response.data.time,  // Asigna la hora de la respuesta
        });
      } else {
        setRefrigerioReservation({
          hasReservation: true,
          reservationId: response.data.reservationId,
          date: response.data.date,  // Asigna la fecha de la respuesta
          time: response.data.time,  // Asigna la hora de la respuesta
        });
      }

      message.success('Reserva creada con éxito');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      message.error('Aun no es tu hora de reserva');
    }
  };


  // Obtener la disponibilidad de reservas con polling cada 1 segundos
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get('/reservations/availability');

        setAvailability({
          remainingSlotsLunch: response.data.remainingSlotsLunch || 0,
          remainingSlotsSnack: response.data.remainingSlotsSnack || 0,
        });
      } catch (error) {
        console.error('Error al obtener la disponibilidad de reservas:', error.response?.data || error.message);

        setAvailability({ remainingSlotsLunch: 0, remainingSlotsSnack: 0 }); // Establecer 0 si hay un error
      }
    };

    // Llamada inicial
    fetchAvailability();

    // Configurar polling cada 1 segundos
    const intervalId = setInterval(fetchAvailability, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);


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

  // Mostrar el mensaje de la reserva dependiendo del tipo de menú
  const getReservationMessage = (type) => {
    if (type === 'almuerzo' && almuerzoReservation.hasReservation) {
      const reservationDateTime = almuerzoReservation.date;

      const [datePart, timePart] = reservationDateTime.split('T');
      const timeWithoutMilliseconds = timePart.split('.')[0];

      return (
        <p style={{ color: '#3E9215', fontWeight: 'bold' }}>
          Tu reserva de <strong>almuerzo</strong> ha sido realizada con éxito el <strong>{datePart}</strong> a las <strong>{timeWithoutMilliseconds}</strong>.
        </p>
      );
    } else if (type === 'refrigerio' && refrigerioReservation.hasReservation) {
      const reservationDateTime = refrigerioReservation.date;

      const [datePart, timePart] = reservationDateTime.split('T');
      const timeWithoutMilliseconds = timePart.split('.')[0];

      return (
        <p style={{ color: '#3E9215', fontWeight: 'bold' }}>
          Tu reserva de <strong>refrigerio</strong> ha sido realizada con éxito el <strong>{datePart}</strong> a las <strong>{timeWithoutMilliseconds}</strong>.
        </p>
      );
    } else {
      return (
        <p style={{ fontWeight: 'bold' }}>
          No has reservado {type === 'almuerzo' ? <strong>almuerzo</strong> : <strong>refrigerio</strong>} el día de hoy.
        </p>
      );
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

        <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>
          {settings && (
            <p style={{ fontWeight: 'bold' }}>
              {selectedType === 'almuerzo' // Si está en la sección de almuerzo
                ? (benefitType === 'venta libre' // Si el usuario tiene 'venta libre'
                  ? (
                    <>
                      Puede reservar <strong>almuerzo</strong> entre <strong>{settings.starLunch}</strong> y <strong>{settings.endLunch}</strong>
                    </>
                  )
                  : benefitType === 'Almuerzo' // Beneficiario de almuerzo
                    ? (
                      <>
                        Puede reservar <strong>almuerzo</strong> entre <strong>{settings.starBeneficiaryLunch}</strong> y <strong>{settings.endLunch}</strong>
                      </>
                    )
                    : benefitType === 'Refrigerio' // Beneficiario de refrigerio
                      ? (
                        <>
                          Puede reservar <strong>almuerzo</strong> entre <strong>{settings.starLunch}</strong> y <strong>{settings.endLunch}</strong>
                        </>
                      )
                      : 'Tipo de beneficio no reconocido')
                : (benefitType === 'venta libre' // Si está en la sección de refrigerio
                  ? (
                    <>
                      Puede reservar <strong>refrigerio</strong> entre <strong>{settings.starSnack}</strong> y <strong>{settings.endSnack}</strong>
                    </>
                  )
                  : benefitType === 'Almuerzo' // Beneficiario de almuerzo
                    ? (
                      <>
                        Puede reservar <strong>refrigerio</strong> entre <strong>{settings.starSnack}</strong> y <strong>{settings.endSnack}</strong>
                      </>
                    )
                    : benefitType === 'Refrigerio' // Beneficiario de refrigerio
                      ? (
                        <>
                          Puede reservar <strong>refrigerio</strong> entre <strong>{settings.starBeneficiarySnack}</strong> y <strong>{settings.endSnack}</strong>
                        </>
                      )
                      : 'Tipo de beneficio no reconocido')}
            </p>
          )}

          {/* Mensaje de reserva dentro de la tarjeta del menú seleccionado */}
          <div style={{ marginBottom: '16px' }}>
            {getReservationMessage(selectedType)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <p>Reservas disponibles: {selectedType === 'almuerzo' ? availability.remainingSlotsLunch : availability.remainingSlotsSnack}</p>
            <p>Costo: {selectedType === 'almuerzo' ? menuData.Almuerzo.price : menuData.Refrigerio.price}</p>
          </div>




          <Tables
            rows={selectedType === 'refrigerio' ? refrigerioRows : almuerzoRows}
            columns={selectedType === 'refrigerio' ? columnsRefrigerio : columnsAlmuerzo}
          />

          <p style={{ textAlign: 'left', marginTop: '8px' }}>
            Eres beneficiario/a de la beca tipo {benefitType}
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