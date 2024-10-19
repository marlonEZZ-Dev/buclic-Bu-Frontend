import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import {
  Form,
  Input,
  Calendar,
  theme,
  ConfigProvider,
  Row,
  Col,
  message,
  Typography,
  Button,
} from "antd";
import SchedulingTable from "../../components/global/SchedulingTable";
import esES from "antd/es/locale/es_ES";
import moment from "moment";
import api from "../../api.js";

const { Text } = Typography;

const Psychologist = () => {
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState(moment()); // Fecha actual por defecto
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [phone, setPhone] = useState(""); // Estado para teléfono
  const [eps, setEps] = useState(""); // Estado para EPS
  const [semester, setSemester] = useState(""); // Estado para el semestre en formato string
  const [pendingAppointment, setPendingAppointment] = useState(null); // Para almacenar la cita pendiente

  // Recupera la información individual del usuario desde localStorage
  const username = localStorage.getItem("username");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  // Verificar y cargar los datos guardados en localStorage (si existen)
  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    const storedEPS = localStorage.getItem("userEPS");
    const storedSemester = localStorage.getItem("userSemester");

    setPhone(storedPhone !== "null" && storedPhone ? storedPhone : "");
    setEps(storedEPS !== "null" && storedEPS ? storedEPS : "");
    setSemester(storedSemester !== "null" && storedSemester ? storedSemester : "");
  }, []);

  useEffect(() => {
    if (!userId || !userName || !userEmail || !userPlan) {
      console.error("No se encontró información del usuario en localStorage");
    } else {
      console.log("Datos del usuario encontrados:", {
        userId,
        userName,
        userEmail,
        userPlan,
      });
    }
  }, []);

  // Realiza la solicitud GET para obtener las citas pendientes del estudiante
  const fetchPendingAppointment = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get(`/appointment-reservation/student/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        const appointments = response.data.appointments;
        const psychologyAppointment = appointments.find(
          (appt) =>
            appt.availableDate.typeAppointment === "PSICOLOGIA" &&
            appt.pending === true
        );
        if (psychologyAppointment) {
          setPendingAppointment(psychologyAppointment);
        } else {
          setPendingAppointment(null);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las citas del estudiante:", error);
      });
  };

  // Llamar a fetchPendingAppointment cuando el componente se monta
  useEffect(() => {
    fetchPendingAppointment();
  }, [userId]);

  // Realiza la solicitud GET para obtener los horarios disponibles
  useEffect(() => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get("/appointment?type=PSICOLOGIA", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        setAvailableDates(response.data.availableDates);
        filterDatesBySelectedDay(
          moment().format("YYYY-MM-DD"),
          response.data.availableDates
        );
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  }, []);

  // Función para cancelar la cita pendiente
  const handleCancelAppointment = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    if (pendingAppointment) {
      api
        .delete(`/appointment-reservation/cancel/${pendingAppointment.reservationId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          message.success("Cita cancelada con éxito");
          setPendingAppointment(null); // Eliminar la cita pendiente
          fetchPendingAppointment(); // Actualizar el estado
          fetchAvailableDates(); // Refrescar el calendario después de cancelar
        })
        .catch((error) => {
          console.error("Error al cancelar la cita:", error);
          message.error("Hubo un error al cancelar la cita.");
        });
    }
  };

  // Función para refrescar el calendario y actualizar las citas disponibles
  const fetchAvailableDates = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get("/appointment?type=PSICOLOGIA", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        setAvailableDates(response.data.availableDates);
        filterDatesBySelectedDay(
          moment().format("YYYY-MM-DD"),
          response.data.availableDates
        );
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  };

  // Función para reservar una cita
  const handleReserveAppointment = (availableDateId) => {
    if (!phone || !eps || !semester) {
      message.error(
        "Por favor, complete todos los campos requeridos (EPS, Teléfono, Semestre)."
      );
      return;
    }

    if (!userId || !availableDateId) {
      message.error(
        "Error: Información de usuario incompleta. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .post(
        "/appointment-reservation",
        {
          pacientId: userId,
          availableDateId: availableDateId,
          eps: eps,
          semester: semester,
          phone: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        message.success(response.data.message);
        localStorage.setItem("userPhone", phone);
        localStorage.setItem("userEPS", eps);
        localStorage.setItem("userSemester", semester);

        // Actualiza las citas pendientes inmediatamente después de reservar
        fetchPendingAppointment();

        setFilteredDates(
          (prevDates) => prevDates.filter((date) => date.id !== availableDateId)
        );
      })
      .catch((error) => {
        console.error(
          "Error al reservar la cita:",
          error.response ? error.response.data : error.message
        );
        message.error("Hubo un error al reservar la cita. Inténtelo de nuevo.");
      });
  };

  // Filtrar los horarios por la fecha seleccionada y que no estén reservados
  const filterDatesBySelectedDay = (
    formattedSelectedDate,
    dates = availableDates
  ) => {
    const filtered = dates.filter((item) => {
      const itemDate = moment(item.dateTime).format("YYYY-MM-DD");
      // Solo mostrar horarios disponibles y que no estén reservados
      return itemDate === formattedSelectedDate && item.available === true;
    });
    setFilteredDates(filtered);
  };

  const onDateSelect = (date) => {
    if (date && date.isValid()) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      filterDatesBySelectedDay(formattedDate);
    } else {
      console.error("Fecha inválida seleccionada");
    }
  };

  const disabledDate = (currentDate) => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    if (formattedDate === today) {
      return false;
    }
    return !availableDates.some(
      (item) =>
        moment(item.dateTime).format("YYYY-MM-DD") === formattedDate &&
        item.available === true
    );
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(value);
  };

  const wrapperStyle = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: "16px",
    width: "70%",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: "20px",
  };

  const leftColumnStyle = {
    flex: "1",
    marginRight: "30px",
    minWidth: "300px",
  };

  const rightColumnStyle = {
    flex: "1",
    minWidth: "300px",
  };

  const formWrapperStyle = {
    marginBottom: "20px",
  };

  const headers = ["Hora", "Lugar de atención", `Fecha: ${selectedDate}`];

  const textStyle = {
    fontSize: "16px", // Este tamaño es el mismo que el texto "No hay horarios disponibles"
  };

  return (
    <>
      <TopNavbar />
      <main className="psicologia-section" style={{ marginTop: "100px" }}>
        <h1 className="text-xl font-bold">Cita psicología</h1>

        {userName && (
          <Form layout="vertical" style={formWrapperStyle}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Nombre">
                  <Input value={userName || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Correo">
                  <Input value={userEmail || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Código">
                  <Input value={username || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Programa académico">
                  <Input value={userPlan || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Teléfono">
                  <Input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Ingrese su teléfono"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="EPS">
                  <Input
                    type="text"
                    value={eps}
                    onChange={(e) => setEps(e.target.value)}
                    placeholder="Ingrese su EPS"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Semestre">
                  <Input
                    type="text"
                    value={semester}
                    onChange={(e) => {
                      const value = e.target.value;
                      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, ""); // Permitir solo letras y espacios
                      setSemester(lettersOnly);
                    }}
                    placeholder="Ingrese su semestre"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        <div style={containerStyle}>
          <div style={leftColumnStyle}>
            <ConfigProvider locale={esES}>
              <div style={wrapperStyle}>
                <Calendar
                  fullscreen={false}
                  onSelect={onDateSelect}
                  disabledDate={disabledDate}
                />
              </div>
            </ConfigProvider>
          </div>

          <div style={rightColumnStyle}>
            {filteredDates.length > 0 ? (
              <>
                <SchedulingTable
                  headers={headers}
                  appointments={filteredDates}
                  onReserve={handleReserveAppointment}
                  disableReserveButton={!!pendingAppointment} // Deshabilitar si ya tiene una cita pendiente
                />
                {/* Mostrar la cita pendiente si existe */}
                {pendingAppointment && (
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <Text type="success" style={textStyle}>
                      Ya tienes agendada una cita con psicología para el día{" "}
                      {moment(pendingAppointment.availableDate.dateTime).format(
                        "DD/MM/YYYY [a las] HH:mm"
                      )}
                    </Text>
                    <Button
                      className="button-cancel"
                      style={{ marginLeft: "20px" }}
                      onClick={handleCancelAppointment}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p style={textStyle}>No hay horarios disponibles para la fecha seleccionada.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Psychologist;
