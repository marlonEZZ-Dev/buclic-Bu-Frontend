import HeaderPsych from "../../components/psychology/HeaderPsych";
import React, { useState, useEffect } from "react";
import SearchInput from "../../components/global/SearchInput.jsx";
import TablePagination from "../../components/global/TablePagination.jsx";
import StateUser from "../../components/global/StateUser.jsx";
import { Card, Space, Button, Descriptions, DatePicker, TimePicker, Row, Col, message } from "antd";
import api from "../../api.js";
import moment from "moment";

const AssistanceIcon = ({ attended }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <StateUser active={attended} />
  </div>
);

const Tracking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    fetchAvailableAppointments();
  }, []);

  const fetchAvailableAppointments = async () => {
    try {
      const response = await api.get("/appointment", { params: { type: "PSICOLOGIA" } });
      const appointments = response.data.availableDates || [];
      setAvailableAppointments(appointments);

      const dates = [
        ...new Set(
          appointments
            .map((appt) => moment(appt.dateTime).format("YYYY-MM-DD"))
            .filter((date) => moment(date).isSameOrAfter(moment(), "day"))
        ),
      ];
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available appointments:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);

    if (date) {
      const dateString = date.format("YYYY-MM-DD");
      const times = availableAppointments
        .filter((appt) => moment(appt.dateTime).format("YYYY-MM-DD") === dateString)
        .map((appt) => moment(appt.dateTime));
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/appointment-reservation/by-username/${searchUsername}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserInfo(null);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      message.error("Por favor, selecciona una fecha y hora.");
      return;
    }

    const dateTime = moment(
      selectedDate.format("YYYY-MM-DD") + " " + selectedTime.format("HH:mm")
    ).toISOString();

    try {
      await api.post("/appointment-reservation", {
        username: userInfo.username,
        dateTime,
        type: "PSICOLOGIA",
      });
      message.success("Cita agendada exitosamente.");
      handleSearch();
    } catch (error) {
      console.error("Error saving appointment:", error);
      message.error("Error al agendar la cita.");
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const disabledDate = (current) => {
    return (
      current && current < moment().startOf("day") ||
      !availableDates.includes(current.format("YYYY-MM-DD"))
    );
  };

  const disabledTime = () => {
    const availableHours = availableTimes.map((time) => time.hour());
    const availableMinutes = availableTimes.map((time) => time.minute());

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter((hour) => !availableHours.includes(hour)),
      disabledMinutes: (selectedHour) =>
        Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => !availableMinutes.includes(minute) || !availableHours.includes(selectedHour)
        ),
    };
  };

  const formatDateTime12Hour = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns = ["Fecha y Hora", "Psicólogo(a)", "Asistencia"];
  const rows =
    userInfo?.listReservation?.content.map((reservation) => [
      formatDateTime12Hour(reservation.dateTime),
      reservation.namePycho,
      <AssistanceIcon attended={reservation.assistant} />,
    ]) || [];

  return (
    <>
      <HeaderPsych />

      <main className="becas-section" style={{ marginTop: "100px" }}>
        <h1 className="text-xl font-bold">Seguimientos</h1>
        <p>Aquí puedes buscar a los pacientes con las citas que han solicitado</p>
        <Card bordered={true} style={styles.card}>
          <div style={styles.searchContainer}>
            <SearchInput
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onClick={handleSearch}
            />
          </div>

          <h3 style={styles.sectionTitle}>Información del paciente</h3>
          {userInfo ? (
            <>
              <Descriptions bordered column={1} style={styles.descriptions}>
                <Descriptions.Item label="Nombre">{userInfo.name}</Descriptions.Item>
                <Descriptions.Item label="Código/Cédula">{userInfo.username}</Descriptions.Item>
                <Descriptions.Item label="Programa">{userInfo.plan}</Descriptions.Item>
                <Descriptions.Item label="Semestre">{userInfo.semester}</Descriptions.Item>
                <Descriptions.Item label="Teléfono">{userInfo.phone}</Descriptions.Item>
                <Descriptions.Item label="Correo">{userInfo.email}</Descriptions.Item>
                <Descriptions.Item label="EPS">{userInfo.eps || "No registrado"}</Descriptions.Item>
                <Descriptions.Item label="Beneficiario de Almuerzo">
                  {userInfo.lunchBeneficiary ? "Sí" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Beneficiario de Merienda">
                  {userInfo.snackBeneficiary ? "Sí" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Estado Activo">
                  {userInfo.isActive ? "Activo" : "Inactivo"}
                </Descriptions.Item>
              </Descriptions>

              <h3 style={styles.sectionTitle}>Agendar próxima cita</h3>
              <div style={styles.scheduleContainer}>
                <Row gutter={16} style={styles.inputRow}>
                  <Col span={12}>
                    <DatePicker
                      onChange={handleDateChange}
                      value={selectedDate}
                      style={{ width: "100%" }}
                      placeholder="Fecha"
                      disabledDate={disabledDate}
                    />
                  </Col>
                  <Col span={12}>
                    <TimePicker
                      onChange={handleTimeChange}
                      value={selectedTime}
                      style={{ width: "100%" }}
                      placeholder="Hora"
                      format="HH:mm"
                      disabled={!selectedDate}
                      disabledTime={disabledTime}
                    />
                  </Col>
                </Row>
                <Row justify="center" style={styles.buttonRow}>
                  <Space size={20}>
                    <Button type="primary" onClick={handleSave} className="button-save" style={styles.saveButton}>
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} className="button-cancel" style={styles.cancelButton}>
                      Cancelar
                    </Button>
                  </Space>
                </Row>
              </div>
            </>
          ) : (
            <p>No se ha encontrado información del usuario.</p>
          )}

          <h3 style={styles.tableTitle}>Tabla de citas solicitadas</h3>
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
  card: { width: "100%", maxWidth: "700px", margin: "3px auto", justifyContent: "center" },
  searchContainer: { display: "flex", justifyContent: "center", marginTop: "20px" },
  sectionTitle: { fontSize: "16px", fontWeight: "bold", margin: "15px 0", textAlign: "center" },
  inputRow: { marginTop: "15px" },
  buttonRow: { paddingTop: "10px", textAlign: "center" },
  scheduleContainer: { marginTop: "20px" },
  tableTitle: { fontSize: "16px", fontWeight: "bold", margin: "20px 0", textAlign: "left" },
  saveButton: { backgroundColor: "#D32F2F", borderColor: "#D32F2F", color: "white" },
  cancelButton: { color: "#D32F2F", borderColor: "#D32F2F" },
};

export default Tracking;
