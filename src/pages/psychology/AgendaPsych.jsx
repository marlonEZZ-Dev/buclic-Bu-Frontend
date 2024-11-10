import Attendance from "../../components/global/Attendance.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx";
import Modal from "../../components/global/Modal.jsx";
import SearchInput from "../../components/global/SearchInput.jsx";
import StateUser from "../../components/global/StateUser.jsx";
import TablePagination from "../../components/global/TablePagination.jsx";
import Tables from "../../components/global/Tables.jsx";
import axios from "axios";
import AssistanceButtons from "../../components/global/AssistanceButtons.jsx";
import api from "../../api.js";
import { appointmentsProfessionals } from "../../services/professionals/agenda.js";

import { Card, Flex, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";

import styles from "../../styles/psychology/agendaPsych.module.css";
import cssButtonsModal from "../../styles/admin/managementUsers.module.css";

import { useEffect, useState } from "react";

function AssistanceCell(key) {
  const [selectedAssistance, setSelectedAssistance] = useState("nothing");
  const [isModalActive, setIsModalActive] = useState(false);
  const [yes, setYes] = useState(false);
  let initShow = true;
  return (
    <>
      <Modal open={isModalActive} onClose={() => setIsModalActive(false)}>
        <Flex vertical align="center" justify="center">
          <div style={{ fontSize: "2rem" }}>
            <ExclamationCircleOutlined />{" "}
            <h3 style={{ display: "inline" }}>Confirmar</h3>
          </div>
          <p style={{ fontSize: "1.5rem" }}>{`¿Desea confirmar la ${
            selectedAssistance === "active"
              ? "asistencia?"
              : selectedAssistance
              ? "inasistencia"
              : ""
          }`}</p>
        </Flex>
        <Flex align="center" gap="small" justify="space-around">
          <button
            style={{ fontSize: "1.5rem" }}
            className={cssButtonsModal.buttonCancel}
            onClick={() => {
              setYes(false);
              setIsModalActive(false);
            }}
          >
            Cancelar
          </button>
          <button
            style={{ fontSize: "1.5rem" }}
            className={cssButtonsModal.buttonSave}
            onClick={() => {
              setYes(true);
              setIsModalActive(false);
            }}
          >
            Guardar
          </button>
        </Flex>
      </Modal>
      <Flex key={key} justify="space-around" align="center">
        {initShow && (
          <>
            <button
              name="active"
              onClick={(e) => {
                setSelectedAssistance(e.currentTarget.name);
                setIsModalActive(true);
              }}
              className={styles.assistance}
            >
              <Attendance non={false} />
            </button>
            <button
              name="inactive"
              onClick={(e) => {
                setSelectedAssistance(e.currentTarget.name);
                setIsModalActive(true);
              }}
              className={styles.assistance}
            >
              <Attendance />
            </button>
          </>
        )}
        {selectedAssistance === "active" && yes && (
          <StateUser key={`stateUser-${selectedAssistance}`} active={true} />
        )}
        {selectedAssistance === "inactive" && yes && (
          <StateUser key={`stateUser-${selectedAssistance}`} active={false} />
        )}
      </Flex>
    </>
  );
}

export default function AgendaPsych() {
  dayjs.locale("es");

  let date = dayjs();

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
  const [itemsPerPage] = useState(5);

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
        />,
      ]);

      console.log("Formatted Rows: ", formattedRows); // Ahora se ejecutará
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
  const fetchAttendedAppointmentsByDate = async (date) => {
    try {
		const response = await api.get(
			`/appointment-reservation/professional/attended/search/${id}?fecha=${date}`,
			{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 0,
            size: 1000,
          },
        }
      );
      const data = response.data.appointments;
      console.log(data);
      const formattedAttendedRows = data.map((appointment) => [
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
      setTotalItems(data.length);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido";
      message.error(errorMessage);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchAttendedAppointments(newPage);
  };

  return (
    <>
      <HeaderPsych />
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
              onClick={() => fetchAttendedAppointmentsByDate(searchDate)} // Realiza la búsqueda
              onRefresh={() => {
                setCurrentPage(1); // Resetea la página al refrescar
                fetchAttendedAppointments(1);
              }} // Refresca la tabla
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
