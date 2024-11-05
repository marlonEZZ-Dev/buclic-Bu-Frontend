import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
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
    width: '400px',
    maxWidth: '800px',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  tableCell: {
    padding: '0.8rem',
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

export default function SchedulesNurse() {
  const [scheduleData, setScheduleData] = useState([]);
  const [originalScheduleData, setOriginalScheduleData] = useState([]);
  const [modifiedScheduleData, setModifiedScheduleData] = useState([]);
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

  const fetchAvailableDates = async () => {
    try {
      const response = await api.get(`/appointment/${userId}`);
      const fetchedData = response.data.availableDates || [];

      const scheduleDataFormatted = fetchedData.reduce((acc, item) => {
        const [date, time] = item.dateTime.split('T');
        const existingDate = acc.find(entry => entry.date === date);

        if (existingDate) {
          existingDate.times.push({ time, isNew: false });
        } else {
          acc.push({ id: item.id, date, times: [{ time, isNew: false }] });
        }

        return acc;
      }, []);

      setScheduleData(scheduleDataFormatted);
      setOriginalScheduleData(scheduleDataFormatted);
    } catch (error) {
      console.error("Error al cargar los horarios disponibles:", error);
      showNotification('error', 'Error al cargar los horarios. Intente nuevamente.');
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const handleDeleteDate = async (dateIndex) => {
    const dateToDelete = scheduleData[dateIndex];
  
    if (!dateToDelete || !dateToDelete.times || dateToDelete.times.length === 0) {
      return;
    }
  
    try {
      // Crear una lista de promesas de eliminación para cada hora
      const deletePromises = dateToDelete.times.map(async ({ time }) => {
        const dateTimeToDelete = `${dateToDelete.date}T${time}`;
        const response = await api.delete(`/appointment/${dateTimeToDelete}`);
        return response;
      });
  
      // Esperar a que todas las promesas se resuelvan
      await Promise.all(deletePromises);
  
      // Si todas las peticiones fueron exitosas, eliminamos la fecha del estado
      setScheduleData(scheduleData.filter((_, index) => index !== dateIndex));
      setModifiedScheduleData(modifiedScheduleData.filter(mod => mod.id !== dateToDelete.id));
  
      showNotification('success', 'Fecha y todas sus horas eliminadas correctamente.');
    } catch (error) {
      console.error("Error al eliminar la fecha:", error);
      showNotification('error', 'Error al eliminar la fecha y sus horas. Intente nuevamente.');
    }
  };
  

  const handleDeleteTime = (dateIndex, timeIndex) => {
    const updatedSchedule = [...scheduleData];
    const updatedDate = updatedSchedule[dateIndex];

    updatedDate.times.splice(timeIndex, 1);

    if (updatedDate.times.length === 0) {
      updatedSchedule.splice(dateIndex, 1);
      setModifiedScheduleData(modifiedScheduleData.filter(mod => mod.id !== updatedDate.id));
    } else {
      if (!modifiedScheduleData.some(mod => mod.id === updatedDate.id)) {
        setModifiedScheduleData([...modifiedScheduleData, updatedDate]);
      }
    }

    setScheduleData(updatedSchedule);
  };

  const handlerEdit = () => setIsEditing(true);

  const handlerDontEdit = () => {
    setIsEditing(false);
    setScheduleData(originalScheduleData);
    setModifiedScheduleData([]);
  };
  const handlerCreateDate = () => {
    const lastDateEntry = scheduleData[scheduleData.length - 1];
    if (lastDateEntry && (!lastDateEntry.date || lastDateEntry.times.some(time => time.time === ""))) {
      showNotification('warning', 'Debe diligenciar la fecha y al menos una hora antes de agregar una nueva fecha.');
      return;
    }

    setScheduleData([...scheduleData, { date: "", times: [{ time: "", isNew: true }] }]);
  };

  const handlerCreateTime = (index) => {
    const timesArray = scheduleData[index].times;
    if (timesArray[timesArray.length - 1].time === "") {
      showNotification('warning', 'Debe diligenciar la hora anterior antes de agregar una nueva hora.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[index].times.push({ time: "", isNew: true });
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[index].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[index]]);
    }
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
    newSchedule[index].times.forEach(time => time.isNew = true);
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[index].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[index]]);
    }
  };

  const handlerTimeChange = (newTime, dateIndex, timeIndex) => {
    const now = dayjs();
    const selectedDate = dayjs(scheduleData[dateIndex].date);
    const selectedTime = dayjs(`${scheduleData[dateIndex].date}T${newTime}`);

    if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
      showNotification('warning', 'No se puede seleccionar una hora pasada en la fecha actual.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[dateIndex].times[timeIndex] = { time: newTime, isNew: true };
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[dateIndex].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[dateIndex]]);
    }
  };

  const saveDataToBackend = async () => {
    try {
      if (!userId) {
        showNotification('error', 'No se encontró el ID del profesional. Por favor, inicie sesión nuevamente.');
        return false;
      }

      const availableDates = modifiedScheduleData.flatMap(schedule =>
        schedule.times
          .filter(({ isNew }) => isNew)
          .map(({ time }) => ({
            dateTime: `${schedule.date}T${time}`,
            professionalId: Number(userId),
            typeAppointment: "ENFERMERIA"
          }))
      );

      if (availableDates.length === 0) {
        showNotification('warning', 'No hay horarios válidos para guardar. Por favor, ingrese al menos una fecha y hora.');
        return false;
      }

      setIsLoading(true);

      const response = await api.post("/appointment/create-date", { availableDates, professionalId: Number(userId) });

      if (response?.status === 200 || response?.status === 201) {
        setOriginalScheduleData(scheduleData);
        setModifiedScheduleData([]);
        return true;
      } else {
        throw new Error('Error al guardar los horarios.');
      }
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      showNotification('error', 'Hubo un error al guardar los horarios.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlerBtnSave = () => {
    if (modifiedScheduleData.length === 0) {
      showNotification('warning', 'No hay cambios para guardar.');
      return;
    }

    setSaveChanges({
      status: true,
      title: "Guardar Cambios",
      content: "¿Desea guardar estos cambios?",
      save: true
    });
  };

  const handlerSaveChangesClose = () => setSaveChanges({ status: false, title: "", content: "", save: false });

  const confirmSave = async () => {
    setIsLoading(true);

    try {
      const saved = await saveDataToBackend();
      if (saved) {
        showNotification('success', 'El horario fue asignado con éxito.');
        setIsEditing(false);
        handlerSaveChangesClose();
      } else {
        showNotification('error', 'No se pudo guardar el horario. Intente de nuevo.');
      }
    } catch (error) {
      showNotification('error', 'Hubo un error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <HeaderNurse />

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
          <table style={styles.cssTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Fecha</th>
                <th style={styles.tableHeader}>Horarios</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay horarios disponibles. Presiona "Agregar Fecha" para comenzar.
                  </td>
                </tr>
              ) : (
                scheduleData.map((schedule, dateIndex) => (
                  <React.Fragment key={`fragment-${dateIndex}`}>
                    <tr key={`dateRow-${dateIndex}`}>
                      <td style={styles.tableCell}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <DateSpanish
                              value={schedule.date}
                              onChange={(date) => handlerDateChange(date, dateIndex)}
                              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                              disabled={!isEditing || isLoading}
                              style={{ width: '100%' }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleDeleteDate(schedule.id)}
                              style={{ color: 'red', marginLeft: '5px' }}
                              disabled={isLoading}
                            >
                              Eliminar
                            </Button>
                          </div>
                        ) : (
                          <span>{schedule.date}</span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        {schedule.times.map((time, timeIndex) => (
                          <div key={`time-${dateIndex}-${timeIndex}`} style={{ display: 'flex', alignItems: 'center' }}>
                            {isEditing ? (
                              <>
                                <TimeSpanish
                                  value={time.time}
                                  onChange={(newTime) => handlerTimeChange(newTime, dateIndex, timeIndex)}
                                  disabled={!isEditing || isLoading}
                                  style={{ width: '100%', marginBottom: '0.5rem' }}
                                />
                                <Button
                                  type="link"
                                  onClick={() => handleDeleteTime(dateIndex, timeIndex)}
                                  style={{ color: 'red', marginLeft: '5px' }}
                                  disabled={isLoading}
                                >
                                  X
                                </Button>
                              </>
                            ) : (
                              <span style={{ display: 'block', marginBottom: '0.5rem' }}>{time.time}</span>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="link"
                            style={styles.linkButton}
                            onClick={() => handlerCreateTime(dateIndex)}
                            disabled={isLoading}
                          >
                            +<span style={styles.decorateText}> Agregar Hora</span>
                          </Button>
                        )}
                      </td>
                    </tr>

                    {dateIndex < scheduleData.length - 1 && (
                      <tr key={`separator-${dateIndex}`}>
                        <td colSpan={2} style={{ borderBottom: '2px solid #f0f0f0', height: '0.5rem' }}></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
              {isEditing && (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <Button
                      type="link"
                      style={styles.linkButton}
                      onClick={handlerCreateDate}
                      disabled={isLoading}
                    >
                      +<span style={styles.decorateText}> Agregar Fecha</span>
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
