import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import SearchInput from "../../components/global/SearchInput.jsx";
import StateUser from "../../components/global/StateUser.jsx";
import TablePagination from "../../components/global/TablePagination.jsx";
import Tables from "../../components/global/Tables.jsx";
import AssistanceButtons from "../../components/global/AssistanceButtons.jsx";
import api from "../../api.js";
import { Card, Flex, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import styles from "../../styles/psychology/agendaPsych.module.css";

import { useEffect, useState } from "react";
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";

export default function AgendaNurse() {
  dayjs.locale("es");
  const [messageApi, showMessage] = message.useMessage()

  const appointmentPendingColums = [
    "Horario",
    "Paciente",
    "Teléfono",
    "Asistencia",
  ];

  const appointmentDoneColums = [
    "Horario cita",
    "Paciente",
    "Teléfono",
    "Asistencia",
  ];

  const [appointmentDone, setAppointmentDone] = useState([]);

  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [id, setId] = useState(null);
  const [searchDate, setSearchDate] = useState(""); // Estado para almacenar la fecha de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalItems, setTotalItems] = useState(0); // Total de elementos
  const [itemsPerPage] = useState(10);

  const removePendingAppointment = (reservationId) => {
    setPendingAppointments((prev) => {
      const updatedAppointments = prev.filter((row) => {
        const buttonComponent = row[3]; // El componente AssistanceButtons está en la 4ª columna
        return buttonComponent.key !== reservationId;
      });

      // Si la tabla se queda vacía, forzar un nuevo array para desencadenar renderizado
      return updatedAppointments.length === 0 ? [] : updatedAppointments;
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setId(userId); // Establece el id sólo si existe
    } else {
      console.error("ID de usuario no encontrado en localStorage");
    }
  }, []);
  const token = localStorage.getItem("access"); // Este efecto se ejecuta al montar

  const fetchPendingAppointments = async () => {
    try {
      const response = await api.get(
        `/appointment-reservation/professional/pending/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pasa el token en el encabezado
          },
        }
      );
      const data = response.data.appointments; // Ajusta esto según los datos correctos

      // Transforma los datos para tu tabla
      const formattedRows = data.map((appointment) => [
        dayjs(appointment.availableDate?.dateTime).format(
          "DD/MM/YYYY h:mm A"
        ) || "Sin Fecha",
        appointment.patient || "Anónimo",
        appointment.phone || "Sin Teléfono",
        <AssistanceButtons
          key={appointment.reservationId}
          appointmentId={appointment.reservationId}
          onReload={() => {
            fetchPendingAppointments();
            fetchAttendedAppointments();
            removePendingAppointment(appointment.reservationId);
          }} // Recargar datos después de una acción
          notifySuccess={messageApi.success}
        />,
      ]);

      setPendingAppointments(formattedRows);
    } catch (error) {
      console.error("Error al obtener citas pendientes:", error);
    }
  };

  useEffect(() => {
    if (id) {
      // Espera a que id esté definido

      fetchPendingAppointments();
      fetchAttendedAppointments();
    }
  }, [id]);

  const fetchAttendedAppointments = async (page = 1) => {
    try {
      const response = await api.get(
        `/appointment-reservation/professional/attended/${id}`,
        {
          params: {
            page: page - 1, // El backend espera que las páginas comiencen en 0
            size: itemsPerPage, // Tamaño de página enviado correctamente
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { appointments, totalElements } = response.data;

      const formattedAttendedRows = appointments.map((appointment) => [
        dayjs(appointment.availableDate?.dateTime).format(
          "DD/MM/YYYY h:mm A"
        ) || "Sin Fecha",
        appointment.patient || "Anónimo",
        appointment.phone || "Sin Teléfono",
        <StateUser
          key={appointment.reservationId}
          active={appointment.assitant}
        />,
      ]);

      setAppointmentDone(formattedAttendedRows);
      setTotalItems(totalElements); // Actualiza el total de elementos
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido";
      message.error(errorMessage);
    }
  };
  const fetchAttendedAppointmentsByDate = async (date, page = 1) => {
    try {
      const response = await api.get(
        `/appointment-reservation/professional/attended/search/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            fecha: date,
            page: page - 1, // Backend espera la página comenzando en 0
            size: itemsPerPage,
          },
        }
      );

      const { appointments, totalElements } = response.data; // Asegúrate de que el backend devuelva estos campos

      const formattedAttendedRows = appointments.map((appointment) => [
        dayjs(appointment.availableDate?.dateTime).format(
          "DD/MM/YYYY h:mm A"
        ) || "Sin Fecha",
        appointment.patient || "Anónimo",
        appointment.phone || "Sin Teléfono",
        <StateUser
          key={appointment.reservationId}
          active={appointment.assitant}
        />,
      ]);

      setAppointmentDone(formattedAttendedRows);
      setTotalItems(totalElements); // Actualiza el total de elementos
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido";
      message.error(errorMessage);
    }
  };

  const handlePageChange = (newPage) => {
    // Si no hay datos en `appointmentDone`, no cambiar la página
    if (appointmentDone.length === 0) {
      return;
    }
    setCurrentPage(newPage);
    if (searchDate) {
      fetchAttendedAppointmentsByDate(searchDate, newPage);
    } else {
      fetchAttendedAppointments(newPage);
    }
  };

  return (
    <>
    {showMessage}
      <HeaderNurse />
      <div className={styles.contentTitle}>
        <h1 className="text-red">Agenda</h1>
        <p>Aquí se visualizan las citas pendientes para ser atendidas</p>
      </div>
      <Flex align="center" justify="center">
        <Card className={styles.card} bordered>
          <Flex vertical align="center" justify="center">
            <Tables
              columns={appointmentPendingColums}
              rows={pendingAppointments}
            />
            <SearchInput
              className={styles.searchInput}
              placeholder="Fecha de consulta (dd/MM/yyyy)"
              onChange={(e) => setSearchDate(e.target.value)}
              onClick={() => {
                if (!searchDate.trim()) {
                  message.warning("Ingrese una fecha de consulta para buscar.");
                  return;
                }
                setCurrentPage(1); // Resetea la paginación
                fetchAttendedAppointmentsByDate(searchDate, 1);
              }}
              onRefresh={() => {
                setSearchDate(""); // Limpia la búsqueda
                setCurrentPage(1); // Resetea la página al refrescar
                fetchAttendedAppointments(1);
              }}
            />
          </Flex>
          <Flex vertical>
            <p className="text-left">Tabla historial de citas realizadas</p>
            <TablePagination
              columns={appointmentDoneColums}
              rows={appointmentDone}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </Flex>
        </Card>
      </Flex>
      <FooterProfessionals />
    </>
  );
}
