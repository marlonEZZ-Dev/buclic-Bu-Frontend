import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import Modal from "../../components/global/Modal.jsx";
import DateSpanish from "../../components/global/DateSpanish.jsx";
import TimeSpanish from "../../components/global/TimeSpanish.jsx";
import api from '../../api';
import { Flex, Button, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const styles = {
  container: {
    marginTop: '3rem',
    minHeight: 'calc(80vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentTitle: {
    textAlign: 'center',
    margin: '1.5rem 0',
  },
  tableWrapper: {
    margin: '1.5rem 0',
    padding: '0 1rem',
  },
  cssTable: {
    width: '400px', // Ancho más amplio
    maxWidth: '800px', // Ancho máximo aumentado
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  tableCell: {
    padding: '0.8rem', // Espaciado ajustado para mayor claridad
    border: 'none',
    verticalAlign: 'middle',
  },
  tableHeader: {
    padding: '0.8rem',
    backgroundColor: 'var(--red)',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    color: 'var(--red)',
    fontWeight: 'bold',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
};


dayjs.locale('es');

export default function SchedulesPsych() {
  const [scheduleData, setScheduleData] = useState([{ date: "", times: [""] }]);
  const [saveChanges, setSaveChanges] = useState({ status: false, title: "", content: "", save: false });
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const showNotification = (type, content) => {
    messageApi[type]({
      content,
      duration: 5,
    });
  };

  const handlerEdit = () => setIsEditing(!isEditing);

  const handlerSaveChangesFill = ({ title, content, save }) => {
    setSaveChanges({
      status: true,
      title: title,
      content: content,
      save: save
    });
  };

  const handlerSaveChangesClose = () => {
    setSaveChanges((obj) => ({ ...obj, status: false }));
  };

  const handlerDontEdit = () => {
    setIsEditing(false);
    setScheduleData([{ date: "", times: [""] }]);
  };

  const handlerCreateDate = () => {
    setScheduleData([...scheduleData, { date: "", times: [""] }]);
  };

  const handlerCreateTime = (index) => {
    const newSchedule = [...scheduleData];
    newSchedule[index].times.push("");
    setScheduleData(newSchedule);
  };

  const handlerDateChange = (date, index) => {
    const now = dayjs();
    const selectedDate = dayjs(date);

    if (selectedDate.isBefore(now, 'day')) {
      showNotification('warning', 'No se puede seleccionar una fecha anterior a la actual.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[index].date = date;
    setScheduleData(newSchedule);
  };

  const handlerTimeChange = (time, dateIndex, timeIndex) => {
    const now = dayjs();
    const selectedDate = dayjs(scheduleData[dateIndex].date);
    const selectedTime = dayjs(`${scheduleData[dateIndex].date}T${time}`);

    if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
      showNotification('warning', 'No se puede seleccionar una hora pasada en la fecha actual.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[dateIndex].times[timeIndex] = time;
    setScheduleData(newSchedule);
  };

  const validateScheduleData = () => {
    return scheduleData.some(schedule =>
      schedule.date && schedule.times.some(time => time)
    );
  };

  const saveDataToBackend = async () => {
    try {
      if (!userId) {
        showNotification('error', 'No se encontró el ID del profesional. Por favor, inicie sesión nuevamente.');
        return false;
      }

      const availableDates = scheduleData.flatMap(schedule =>
        schedule.times
          .filter(time => time && schedule.date)
          .map(time => ({
            dateTime: `${schedule.date}T${time}`,
            professionalId: Number(userId),
            typeAppointment: "PSICOLOGIA"
          }))
      ).filter(item => item.dateTime && dayjs(item.dateTime).isValid());

      if (availableDates.length === 0) {
        showNotification('warning', 'No hay horarios válidos para guardar. Por favor, ingrese al menos una fecha y hora.');
        return false;
      }

      setIsLoading(true);

      const requestData = {
        availableDates,
        professionalId: Number(userId)
      };

      console.log('Enviando datos:', requestData);

      // Realiza la petición al backend
      const response = await api.post("/appointment/create-date", requestData);

      // Verificar el estado de la respuesta
      if (response?.status === 200 || response?.status === 201) {
        return true; // Guardado exitoso
      } else {
        throw new Error('Error al guardar los horarios.'); // Lanza un error si la respuesta no es 200 o 201
      }
    } catch (error) {
      console.error('Error al guardar horarios:', error);

      let errorMessage = 'Hubo un error al guardar los horarios.';

      if (error.response) {
        errorMessage = error.response.data?.message || 'Error desconocido del servidor.';
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      }

      showNotification('error', errorMessage);
      return false;
    } finally {
      setIsLoading(false); // Detener el estado de carga
    }
  };


  const handlerBtnSave = () => {
    if (!validateScheduleData()) {
      showNotification('warning', 'Debe ingresar al menos una fecha y hora antes de guardar.');
      return;
    }

    handlerSaveChangesFill({
      title: "Guardar Cambios",
      content: "¿Desea guardar estos cambios?",
      save: true
    });
  };

  const confirmSave = async () => {
    setIsLoading(true); // Iniciar la carga al comenzar el proceso de guardado

    try {
      const saved = await saveDataToBackend();
      if (saved) {
        showNotification('success', 'El horario fue asignado con éxito.'); // Notificación de éxito
        setScheduleData([{ date: "", times: [""] }]); // Limpiar los inputs
        handlerSaveChangesClose(); // Cerrar el modal
        handlerDontEdit(); // Salir del modo de edición
      } else {
        showNotification('error', 'No se pudo guardar el horario. Intente de nuevo.'); // Notificación de error
      }
    } catch (error) {
      console.error('Error en la confirmación de guardado:', error);
      showNotification('error', 'Hubo un error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false); // Detener el estado de carga después del proceso
    }
  };



  return (
    <>
      {contextHolder}
      <HeaderPsych />

      <div style={styles.container}>
        <Modal
          open={saveChanges.status}
          footer={null}
          onClose={handlerSaveChangesClose}
          centered
        >
          <div style={styles.modalCentered}>
            <span style={styles.modalFontSizeTitle}>
              <InfoCircleOutlined /> {saveChanges.title}
            </span>
            <p style={styles.modalFontSizeContent}>{saveChanges.content}</p>
          </div>
          <div style={styles.buttonContainer}>
            <button
              className="button-cancel"
              onClick={handlerSaveChangesClose}
              disabled={isLoading}
            >
              No
            </button>
            <button
              className="button-save"
              onClick={confirmSave}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Sí'}
            </button>
          </div>
        </Modal>

        <div style={styles.contentTitle}>
          <h1>Definir Horarios</h1>
          <p>Aquí se puede definir el horario para citas disponibles</p>
        </div>

        <Flex justify="center" align="center" style={styles.tableWrapper}>
          {isEditing ? (
            <table style={styles.cssTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Fecha</th>
                  <th style={styles.tableHeader}>Hora</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((schedule, dateIndex) => (
                  <React.Fragment key={`fragment-${dateIndex}`}>
                    <tr key={`dateRow-${dateIndex}`}>
                      <td style={styles.tableCell}>
                        <DateSpanish
                          value={schedule.date}
                          onChange={(date) => handlerDateChange(date, dateIndex)}
                          disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                          disabled={!isEditing || isLoading}
                          style={{ width: '100%' }} // Ajuste para ocupar el espacio disponible
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <TimeSpanish
                          value={schedule.times[0]}
                          onChange={(time) => handlerTimeChange(time, dateIndex, 0)}
                          disabledHours={() => {
                            const selectedDate = dayjs(schedule.date);
                            if (selectedDate.isSame(dayjs(), 'day')) {
                              return [...Array(dayjs().hour()).keys()];
                            }
                            return [];
                          }}
                          disabled={!isEditing || isLoading}
                          style={{ width: '100%' }} // Ajuste para ocupar el espacio disponible
                        />
                      </td>
                    </tr>

                    {schedule.times.slice(1).map((timeValue, timeIndex) => (
                      <tr key={`time-${dateIndex}-${timeIndex + 1}`}>
                        <td style={styles.tableCell}></td>
                        <td style={styles.tableCell}>
                          <TimeSpanish
                            value={timeValue}
                            onChange={(time) => handlerTimeChange(time, dateIndex, timeIndex + 1)}
                            disabled={!isEditing || isLoading}
                            style={{ width: '100%' }} // Ajuste para ocupar el espacio disponible
                          />
                        </td>
                      </tr>
                    ))}

                    <tr key={`RowLink-${dateIndex}`}>
                      <td style={styles.tableCell}></td>
                      <td style={styles.tableCell}>
                        <Button
                          type="link"
                          style={styles.linkButton}
                          onClick={() => handlerCreateTime(dateIndex)}
                          disabled={!isEditing || isLoading}
                        >
                          +<span style={styles.decorateText}> Agregar Hora</span>
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <Button
                      type="link"
                      style={styles.linkButton}
                      onClick={handlerCreateDate}
                      disabled={!isEditing || isLoading}
                    >
                      +<span style={styles.decorateText}> Agregar Fecha</span>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table style={styles.cssTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Fecha</th>
                  <th style={styles.tableHeader}>Hora</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tableCell}>
                    <DateSpanish placeholder="Fecha" disabled style={{ width: '100%' }} />
                  </td>
                  <td style={styles.tableCell}>
                    <TimeSpanish placeholder="Hora" disabled style={{ width: '100%' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Flex>



        <Flex justify="center" align="center" style={styles.marginTopEdit} gap={30}>
          {!isEditing && (
            <button
              className="button-save"
              onClick={handlerEdit}
              disabled={isLoading}
            >
              Editar
            </button>
          )}
          {isEditing && (
            <>
              <button
                className="button-save"
                onClick={handlerBtnSave}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                className="button-cancel"
                onClick={handlerDontEdit}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </>
          )}
        </Flex>
      </div>

      <FooterProfessionals />
    </>
  );
}
