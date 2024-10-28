import styles from "../../styles/psychology/schedulesPsych.module.css";

import HeaderPsych from "../../components/psychology/HeaderPsych.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import Modal from "../../components/global/Modal.jsx";
import DateSpanish from "../../components/global/DateSpanish.jsx";
import TimeSpanish from "../../components/global/TimeSpanish.jsx";

import dayjs from "dayjs";

import {Flex, Button} from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"

import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

import { useState } from "react";

function TableEditable(){
  const [scheduleData, setScheduleData] = useState([
    { date: "", times: [""] }, // Siempre hay un campo Time por defecto
  ]);
  // Función para manejar la creación de nuevas fechas
  const handlerCreateDate = () => {
    setScheduleData([...scheduleData, { date: "", times: [""] }]); // Cada nueva fecha empieza con un Time vacío
  };

  // Función para actualizar una fecha
  const handlerDateChange = (date, index) => {
    const newSchedule = [...scheduleData];
    newSchedule[index].date = date;
    setScheduleData(newSchedule);
  };

  // Función para agregar una nueva hora a una fecha específica
  const handlerCreateTime = (index) => {
    const newSchedule = [...scheduleData];
    newSchedule[index].times.push(""); // Agrega un nuevo campo de Time vacío
    setScheduleData(newSchedule);
  };

  // Función para actualizar una hora específica
  const handlerTimeChange = (time, dateIndex, timeIndex) => {
    const newSchedule = [...scheduleData];
    newSchedule[dateIndex].times[timeIndex] = time;
    setScheduleData(newSchedule);
  };
  
  return (
    <>
    <table className={styles.cssTable} border="1">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        {scheduleData.map((schedule, dateIndex) => (
        <>
       {/* Fila principal de la fecha */}
          <tr key={`dateRow-${dateIndex}`}>
          {/* Celda de la fecha */}
            <td key={`cellInput-${dateIndex}`}>
              <DateSpanish
                key={`dateSpanish-${dateIndex}`}
                value={schedule.date}
                onChange={(date) => handlerDateChange(date, dateIndex)}
              />
            </td>
             {/* Primer campo de hora */}
            <td key={`cellInput--${dateIndex}`}>
              <TimeSpanish
                key={`timeSpanish${dateIndex}`}
                value={schedule.times[0]}
                onChange={(time) =>
                  handlerTimeChange(time, dateIndex, 0)
                }
              />
            </td>
          </tr>

                {/* Fila para las horas adicionales (si hay más de una hora) */}
                {schedule.times.slice(1).map((time, timeIndex) => (
                  <tr key={`time-${dateIndex}-${timeIndex}`}>
                    <td key={`emptyTime-${dateIndex}`}></td>
                    <td>
                      <TimeSpanish
                        key={`timeSpanish-${timeIndex}`}
                        value={time}
                        onChange={(time) =>
                          handlerTimeChange(time, dateIndex, timeIndex + 1)
                        }
                      />
                    </td>
                  </tr>
                ))}

                {/* Enlace para agregar una nueva hora */}
                <tr key={`RowLink-${dateIndex}`} style={{borderBottomColor:"#D9D9D9"}}>
                  <td key={`emptyTime--${dateIndex}`}></td>
                  <td>
                    <Button
                      key={`btnLink-${dateIndex}`}
                      type="link"
                      style={{color:"var(--red)"}}
                      onClick={() => handlerCreateTime(dateIndex)}
                    >
                      +<span key={`linkHour-${dateIndex}`} className={`text-red ${styles.decorateText}`}> Agregar Hora</span>
                    </Button>
                  </td>
                </tr>
              </>
            ))}
            {/* Enlace para agregar una nueva fecha */}
            <tr>
              <td colSpan={2} className={styles.bordered}>
                <Button type="link" style={{color:"var(--red)"}} onClick={handlerCreateDate}>
                +<span className={`text-red ${styles.decorateText}`}> Agregar Fecha</span>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        </>
  )
}

export default function SchedulesPsych() {
  const [saveChanges, setSaveChanges] = useState({status: false, title: "", content: "", save: false})
  const [onPressEdit, setOnPressEdit] = useState(false)

  const handlerEdit = () => setOnPressEdit(true)

  const handlerSaveChangesFill = ({title, content, save}) => {
    setSaveChanges({
      status: true,
      title: title,
      content: content,
      save: save
    })
  }

  const handlerSaveChangesClose = () => {
    setSaveChanges( obj => ({
      ...obj,
      status: false
    }))
  }

  const handlerDontEdit = () => setOnPressEdit(false)
  
  const handlerBtnSave = () => {
    handlerSaveChangesFill({
      title:"Guardar Cambios",
      content:"¿Desea guardar estos cambios?",
      save: true})
  }
  
  const handlerBtnCancel = () => {
    handlerSaveChangesFill({
      title:"Sin guardar cambios",
      content:"¿Desea irse sin guardar cambios?",
      save: false
    })
  }

  return (
    <>
      <HeaderPsych />
      <Modal
      open={saveChanges.status}
      footer={null}
      onClose={handlerSaveChangesClose}
      >
        <Flex vertical justify="center" align="center">
          <span className={styles.modalFontSizeTitle}><InfoCircleOutlined />  {saveChanges.title}</span>
        </Flex>
        <Flex vertical justify="flex-start" align="center">
          <p className={styles.modalFontSizeContent}>{saveChanges.content}</p>
        </Flex>
        <Flex justify="center" align="center" gap={20}>
          <button 
          className="button-cancel" 
          onClick={handlerSaveChangesClose}>No</button>
          <button 
          className="button-save"
          onClick={() => {
              handlerSaveChangesClose()
              handlerDontEdit()
              }}>Si</button>
        </Flex>
      </Modal>
      <div className={`${styles.contentTitle} text-red`}>
        <h1>Definir Horarios</h1>
        <p>Aquí se puede definir el horario para citas disponibles</p>
      </div>
      <Flex justify="center" align="center" className={styles.tableWrapper}>
        {onPressEdit ? <TableEditable/>:<>
        <table className={styles.cssTable} border="1">
          <thead>
            <tr>
            <th>Fecha</th>
            <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.rowInputsTableInit}>
              <td><DateSpanish placeholder="Fecha"/></td>
              <td><TimeSpanish placeholder="Hora"/></td>
            </tr>
          </tbody>
        </table>
        </>}
        </Flex>
        <Flex justify="center" align="center" className={styles.marginTopEdit} gap={30}>
          {!onPressEdit && <button className="button-save" onClick={handlerEdit}>Editar</button>}
          {onPressEdit && <>
          <button 
            className="button-save" 
            onClick={handlerBtnSave}>Guardar</button>
          <button className="button-cancel" onClick={handlerBtnCancel}>Cancelar</button>
          </>}
        </Flex>
        <FooterProfessionals/>
    </>
  );
}
