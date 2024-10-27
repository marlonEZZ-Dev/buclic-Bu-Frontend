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
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD")); // Estado inicial formateado
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [phone, setPhone] = useState("");
  const [eps, setEps] = useState("");
  const [semester, setSemester] = useState("");
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [isSemesterError, setIsSemesterError] = useState(false);

  const username = localStorage.getItem("username");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    const storedSemester = localStorage.getItem("userSemester");

    setPhone(storedPhone !== "null" && storedPhone ? storedPhone : "");
    setSemester(
      storedSemester !== "null" && storedSemester ? storedSemester : ""
    );
  }, []);

  useEffect(() => {
    fetchPendingAppointment();
  }, [userId]);

  const fetchPendingAppointment = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get(`/appointment-reservation/student/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        const psychologyAppointment = response.data.appointments.find(
          (appt) =>
            appt.availableDate.typeAppointment === "PSICOLOGIA" &&
            appt.pending === true
        );
        setPendingAppointment(psychologyAppointment || null);
      })
      .catch((error) => {
        console.error("Error al obtener las citas del estudiante:", error);
      });
  };

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
          moment().format("YYYY-MM-DD"), // Asegura que use el formato correcto en la fecha inicial
          response.data.availableDates
        );
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  }, []);

    const handleCancelAppointment = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    if (pendingAppointment) {
      api
        .delete(
          `/appointment-reservation/cancel/${pendingAppointment.reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        )
        .then(() => {
          message.success("Cita cancelada con éxito");
          setPendingAppointment(null);

          // Restablecer al estado inicial (fecha actual y citas de esa fecha)
          const today = moment().format("YYYY-MM-DD");
          setSelectedDate(today);
          filterDatesBySelectedDay(today, availableDates);

          fetchPendingAppointment();
        })
        .catch((error) => {
          console.error("Error al cancelar la cita:", error);
          message.error("Hubo un error al cancelar la cita.");
        });
    }
  };

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

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Solo permite números
    setPhone(value);
  
    if (value.length === 10) {
      setIsPhoneError(false); // Si son 10 dígitos, no hay error
    } else {
      setIsPhoneError(true); // Si no son 10 dígitos, muestra el error
    }
  };

  const handleReserveAppointment = (availableDateId) => {
    let hasError = false;

    // Verificar que el teléfono tenga 10 dígitos
    if (phone.length !== 10) {
      setIsPhoneError(true);
      hasError = true;
    } else {
      setIsPhoneError(false);
    }

    // Verificar que el campo semestre no esté vacío
    if (!semester) {
      setIsSemesterError(true);
      hasError = true;
    } else {
      setIsSemesterError(false);
    }

    if (hasError) {
      message.error("Digita los campos teléfono y semestre.");
      return; // Detener la función si hay errores
    }

    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .post(
        "/appointment-reservation",
        {
          pacientId: userId,
          availableDateId,
          eps,
          semester,
          phone,
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
        fetchPendingAppointment();
        setFilteredDates((prevDates) =>
          prevDates.filter((date) => date.id !== availableDateId)
        );
      })
      .catch((error) => {
        console.error("Error al reservar la cita:", error);
        message.error("Debes agendar tu cita al menos una hora antes.");
      });
  };

  const filterDatesBySelectedDay = (
    formattedSelectedDate,
    dates = availableDates
  ) => {
    const filtered = dates.filter((item) => {
      const itemDate = moment(item.dateTime).format("YYYY-MM-DD");
      return itemDate === formattedSelectedDate && item.available === true;
    });
    setFilteredDates(filtered);
  };

  const onDateSelect = (date) => {
    if (date && date.isValid()) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      filterDatesBySelectedDay(formattedDate);
    }
  };

  const disabledDate = (currentDate) => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    return !availableDates.some(
      (item) =>
        moment(item.dateTime).format("YYYY-MM-DD") === formattedDate &&
        item.available === true
    );
  };

  const handleSemesterChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Solo permite letras y espacios
    setSemester(value);
  
    // Eliminar el error en el campo semestre al escribir algo
    if (value.trim() !== "") {
      setIsSemesterError(false);
    }
  };
  
  return (
    <>
      <TopNavbar />
      <main
        className="psicologia-section"
        style={{ marginTop: "100px", padding: "0 20px" }}
      >
        <h1 className="text-xl font-bold" style={{ textAlign: "center" }}>
          Cita psicología
        </h1>

        {userName && (
          <Form layout="vertical" style={{ marginBottom: "20px" }}>
            <Row gutter={[16, 16]}>
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
              <Form.Item
                label="Teléfono"
                validateStatus={isPhoneError ? "error" : ""}
                help={isPhoneError ? "El campo teléfono debe tener 10 dígitos." : ""}
              >
                <Input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10} // Limita la entrada a 10 caracteres
                  style={{ borderColor: isPhoneError ? "red" : "" }}
                />
              </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Semestre"
                  validateStatus={isSemesterError ? "error" : ""}
                  help={isSemesterError ? "El campo semestre es obligatorio." : ""}
                >
                  <Input
                    type="text"
                    value={semester}
                    onChange={handleSemesterChange}
                    style={{ borderColor: isSemesterError ? "red" : "" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col xs={24} md={12}>
            <ConfigProvider locale={esES}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <Calendar
                  fullscreen={false}
                  onSelect={onDateSelect}
                  disabledDate={disabledDate} // Deshabilita los días sin citas
                />
              </div>
            </ConfigProvider>
          </Col>
          <Col xs={24} md={12}>
            {filteredDates.length > 0 ? (
              <SchedulingTable
                headers={[
                  "Hora",
                  "Lugar de atención",
                  `Fecha: ${moment(selectedDate).format("YYYY-MM-DD")}`,
                ]}
                appointments={filteredDates}
                onReserve={handleReserveAppointment}
                disableReserveButton={!!pendingAppointment}
              />
            ) : (
              <p style={{ fontSize: "16px", textAlign: "center" }}>
                Selecciona una fecha para ver los horarios disponibles.
              </p>
            )}

            {pendingAppointment && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: "100%",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#d4edda", // Fondo verde suave
                    color: "#155724", // Texto verde oscuro
                    padding: "5px 10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  Agendaste una cita con psicología para el día{" "}
                  {moment(pendingAppointment.availableDate.dateTime).format(
                    "DD/MM/YYYY [a las] hh:mm A"
                  )}
                </span>
                <Button
                  className="button-cancel"
                  style={{
                    marginTop: "10px",
                    maxWidth: "150px",
                    width: "100%",
                  }}
                  onClick={handleCancelAppointment}
                >
                  Cancelar cita
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </main>
    </>
  );
};

export default Psychologist;
