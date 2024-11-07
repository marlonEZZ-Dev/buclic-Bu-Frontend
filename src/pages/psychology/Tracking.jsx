import HeaderPsych from "../../components/psychology/HeaderPsych";
import React, { useState } from "react";
import SearchInput from "../../components/global/SearchInput.jsx";
import TablePagination from "../../components/global/TablePagination.jsx";
import StateUser from "../../components/global/StateUser.jsx";
import { Card, Space, Button, Descriptions, DatePicker, TimePicker, Row, Col } from "antd";
import api from "../../api.js";

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
      setUserInfo(null); // Limpiar la información del usuario si hay un error
    }
  };

  const handleSave = () => {
    console.log("Fecha seleccionada:", selectedDate);
    console.log("Hora seleccionada:", selectedTime);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Función para formatear fecha y hora en formato de 12 horas
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

// Datos para la tabla de citas solicitadas
const columns = ["Fecha y Hora", "Psicólogo(a)", "Asistencia"];
const rows = userInfo?.listReservation?.content.map((reservation) => [
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
                <Descriptions.Item label={<span style={styles.boldLabel}>Nombre</span>}>
                  {userInfo.name}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Código/Cédula</span>}>
                  {userInfo.username}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Programa</span>}>
                  {userInfo.plan}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Semestre</span>}>
                  {userInfo.semester}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Teléfono</span>}>
                  {userInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Correo</span>}>
                  {userInfo.email}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>EPS</span>}>
                  {userInfo.eps || "No registrado"}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Beneficiario de Almuerzo</span>}>
                  {userInfo.lunchBeneficiary ? "Sí" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Beneficiario de Merienda</span>}>
                  {userInfo.snackBeneficiary ? "Sí" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={styles.boldLabel}>Estado Activo</span>}>
                  {userInfo.isActive ? "Activo" : "Inactivo"}
                </Descriptions.Item>
              </Descriptions>

              {/* Sección para agendar próxima cita */}
              <h3 style={styles.sectionTitle}>Agendar próxima cita</h3>
              <div style={styles.scheduleContainer}>
                <div style={styles.dateTimeSection}>
                  <Row style={styles.headerRow}>
                    <Col span={12} style={styles.headerCell}>
                      Fecha
                    </Col>
                    <Col span={12} style={styles.headerCell}>
                      Hora
                    </Col>
                  </Row>
                  <Row gutter={16} style={styles.inputRow}>
                    <Col span={12}>
                      <DatePicker
                        onChange={handleDateChange}
                        value={selectedDate}
                        style={{ width: "100%" }}
                        placeholder="Fecha"
                      />
                    </Col>
                    <Col span={12}>
                      <TimePicker
                        onChange={handleTimeChange}
                        value={selectedTime}
                        style={{ width: "100%" }}
                        placeholder="Hora"
                        format="HH:mm"
                      />
                    </Col>
                  </Row>
                  <Row justify="center" style={styles.buttonRow}>
                    <Space size={20}>
                      <Button type="primary" onClick={handleSave} className="button-save">
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} className="button-cancel">
                        Cancelar
                      </Button>
                    </Space>
                  </Row>
                </div>
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
  main: {
    marginTop: "100px",
    padding: "0 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    marginTop: "100px",
    margin: "3px auto",
    justifyContent: "center",
  },
  titleSpace: {
    marginTop: "5px",
    alignItems: "center",
  },
  descriptions: {
    marginTop: "15px",
    width: "100%",
    margin: "auto",
  },
  boldLabel: {
    fontWeight: "bold",
  },
  searchContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "15px",
    marginBottom: "15px",
    textAlign: "center",
  },
  dateTimeSection: {
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px",
    paddingBottom: "10px",
  },
  headerRow: {
    backgroundColor: "#e0e0e0",
    padding: "10px",
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  headerCell: {
    textAlign: "center",
  },
  inputRow: {
    padding: "10px",
  },
  buttonRow: {
    paddingTop: "10px",
    textAlign: "center",
  },
  scheduleContainer: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    textAlign: "left",
  },
};

export default Tracking;
