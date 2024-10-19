import styles from "../../styles/psychology/schedulesPsych.module.css";
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx";
import locale from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import {Flex} from "antd"
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
import { ConfigProvider, DatePicker, TimePicker, Button } from "antd";
import { useState } from "react";

// Componentes para DatePicker y TimePicker
function DateComponent({ value, onChange }) {
  return (
    <ConfigProvider locale={locale}>
      <DatePicker
        value={value}
        onChange={onChange}
        format="YYYY-MM-DD"
        defaultOpenValue={dayjs().format("YYYY-MM-DD")}
      />
    </ConfigProvider>
  );
}

function TimeComponent({ value, onChange }) {
  return (
    <ConfigProvider locale={locale}>
      <TimePicker
        value={value}
        onChange={onChange}
        use12Hours
        format="h:mm a"
      />
    </ConfigProvider>
  );
}

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
      <Flex align="center" justify="center" wrap>
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
                <tr key={`date-${dateIndex}`}>
                  {/* Celda de la fecha */}
                  <td>
                    <DateComponent
                      value={schedule.date}
                      onChange={(date) => handlerDateChange(date, dateIndex)}
                    />
                  </td>
                  {/* Primer campo de hora */}
                  <td>
                    <TimeComponent
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
                    <td></td>
                    <td>
                      <TimeComponent
                        value={time}
                        onChange={(time) =>
                          handlerTimeChange(time, dateIndex, timeIndex + 1)
                        }
                      />
                    </td>
                  </tr>
                ))}

                {/* Enlace para agregar una nueva hora */}
                <tr style={{borderBottomColor:"#D9D9D9"}}>
                  <td></td>
                  <td>
                    <Button
                      type="link"
                      style={{color:"var(--red)"}}
                      onClick={() => handlerCreateTime(dateIndex)}
                    >
                      +<span className={`text-red ${styles.decorateText}`}> Agregar Hora</span>
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
        </Flex>
        </>
  )
}

export default function SchedulesPsych() {

  const [onPressEdit, setOnPressEdit] = useState(false)

  const handlerEdit = () => setOnPressEdit(true)
  const handlerDontEdit = () => setOnPressEdit(false)
  // Estado para manejar las fechas y las horas

  return (
    <>
      <HeaderPsych />
      <div className={`${styles.contentTitle} text-red`}>
        <h1>Definir Horarios</h1>
        <p>Aquí se puede definir el horario para citas disponibles</p>
      </div>
        {onPressEdit ? <TableEditable/>:<>
        <table className={styles.cssTable} border="1">
          <thead>
            <tr>
            <th>Fecha</th>
            <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><DateComponent value="Fecha"/></td>
              <td><TimeComponent value="Hora"/></td>
            </tr>
          </tbody>
        </table>
        </>}
        <Flex justify="center" align="center">
          <button className="button-cancel" onClick={handlerEdit}>Editar</button>
          {onPressEdit && <>
          <button className="button-save">Guardar</button>
          <button className="button-cancel" onClick={handlerDontEdit}>Cancelar</button>
          </>}
        </Flex>
    </>
  );
}
