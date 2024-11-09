import Attendance from "../../components/global/Attendance.jsx"
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx"
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx"
import Modal from "../../components/global/Modal.jsx"
import SearchInput from "../../components/global/SearchInput.jsx"
import StateUser from "../../components/global/StateUser.jsx"
import TablePagination from "../../components/global/TablePagination.jsx"
import Tables from "../../components/global/Tables.jsx"
import axios from 'axios';
import AssistanceButtons from "../../components/global/AssistanceButtons.jsx"

import { appointmentsProfessionals } from "../../services/professionals/agenda.js"

import { Card, Flex } from "antd"
import {ExclamationCircleOutlined} from "@ant-design/icons"
import dayjs from "dayjs"
import 'dayjs/locale/es'

import styles from "../../styles/psychology/agendaPsych.module.css"
import cssButtonsModal from "../../styles/admin/managementUsers.module.css"

import { useEffect, useState } from "react"

function AssistanceCell(key){
	const [selectedAssistance, setSelectedAssistance] = useState("nothing")
	const [isModalActive, setIsModalActive] = useState(false)
	const [yes, setYes] = useState(false)
	let initShow = true
	return (
	<>
	<Modal 
		open={isModalActive}
		onClose={() => setIsModalActive(false)}>
		<Flex vertical
			align="center"
			justify="center">
				<div style={{fontSize:"2rem"}}>
					<ExclamationCircleOutlined />    <h3 style={{display:"inline"}}>Confirmar</h3>
				</div>
				<p style={{fontSize:"1.5rem"}}>{`¿Desea confirmar la ${selectedAssistance === "active" ? "asistencia?" 
				: selectedAssistance ? "inasistencia" : ""}`}</p>
		</Flex>
		<Flex
      align='center'
      gap='small'
      justify='space-around'>
        <button
				style={{fontSize:"1.5rem"}}
				className={cssButtonsModal.buttonCancel} 
				onClick={() => {
					setYes(false)
					setIsModalActive(false)
				}}>
					Cancelar
				</button>
        <button 
				style={{fontSize:"1.5rem"}}
				className={cssButtonsModal.buttonSave}
				onClick={() => {
					setYes(true)
					setIsModalActive(false)
				}}>
					Guardar
				</button>
    </Flex>
	</Modal>
		<Flex 
		key={key} 
		justify="space-around" 
		align="center">
			{initShow && <>
				<button 
				name="active"
				onClick={(e) => {
					setSelectedAssistance(e.currentTarget.name)
					setIsModalActive(true)
				}}
				className={styles.assistance}>
					<Attendance non={false}/>
			</button>
			<button 
				name="inactive" 
				onClick={(e) => {
					setSelectedAssistance(e.currentTarget.name)
					setIsModalActive(true)
				}} 
				className={styles.assistance}>
					<Attendance/>
			</button>
			</>}
			{selectedAssistance === "active" && yes && <StateUser key={`stateUser-${selectedAssistance}`} active={true}/>}
			{selectedAssistance === "inactive" && yes && <StateUser key={`stateUser-${selectedAssistance}`} active={false}/>}
		</Flex>
	</>
	)
}

export default function AgendaPsych(){
	dayjs.locale("es")
  
	let date = dayjs()

	const appointmentPendingColums = ["Hora","Paciente", "Télefono", "Asistencia"]
	
	const appointmentDoneColums = ["Horario cita","Paciente", "Télefono", "Asistencia"]

	

	const rowsAppointmentDone = [
		[dayjs("2024-09-30T13:00:00").format("DD/MM/YYYY h:mm A"), "Mario Sánchez",123456789,<StateUser key={1} active={false}/>]
	]

	const [pendingAppointments, setPendingAppointments] = useState([]);
	const [id, setId] = useState(null);

useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    setId(userId); // Establece el id sólo si existe
  } else {
    console.error("ID de usuario no encontrado en localStorage");
  }
}, []); 
const token = localStorage.getItem('access');// Este efecto se ejecuta al montar

const fetchPendingAppointments = async () => {
	try {
	  const response = await axios.get(`http://localhost:8080/appointment-reservation/professional/pending/${id}`, {
		  headers: {
			Authorization: `Bearer ${token}` // Pasa el token en el encabezado
		  }
		});
	  const data = response.data.appointments; // Ajusta esto según los datos correctos

	  // Transforma los datos para tu tabla
	  const formattedRows = data.map(appointment => [
		  dayjs(appointment.availableDate?.dateTime).format("DD/MM/YYYY h:mm A") || 'Sin Fecha',
		  appointment.patient || 'Anónimo',
		  appointment.phone || 'Sin Teléfono',
		  <AssistanceButtons
				key={appointment.reservationId}
				appointmentId={appointment.reservationId}
				onReload={fetchPendingAppointments} // Recargar datos después de una acción
		  />
		]);

	  console.log("Formatted Rows: ", formattedRows); // Ahora se ejecutará
	  setPendingAppointments(formattedRows);
	} catch (error) {
	  console.error("Error al obtener citas pendientes:", error);
	}
  };


useEffect(() => {
  if (id) { // Espera a que id esté definido
    
    fetchPendingAppointments();
  }
}, [id]);  
	 
		return(	
		<>
      <HeaderPsych/>
			<div className={styles.contentTitle}>
				<h1 className="text-red">Agenda</h1>
				<p>Aquí se visualizan las citas pendientes para ser atendidas</p>
			</div>
			<Flex
			align="center" 
			justify="center">			
			<Card
			className={styles.card}
			bordered
			>			
				<Flex 
				vertical
				align="center"
				justify="center"
				>
					<p className={`${styles.pseudoTableHeader} text-left`}>
						{`${date.format("dddd D [de] MMMM [del] YYYY").split(' ')
  					.map(palabra => (palabra !== 'de' && palabra !== 'del') ? palabra.charAt(0).toUpperCase() + palabra.slice(1) 
    				: palabra).join(' ')}`}
					</p>
					<Tables
					columns={appointmentPendingColums}
					rows={pendingAppointments} 
					/>
					<SearchInput
					className={styles.searchInput}
					placeholder="Fecha de consulta"
					/>
				</Flex>
				<Flex vertical>
					<p className="text-left">Tabla historial de citas realizadas</p>
					<TablePagination
					columns={appointmentDoneColums}
					rows={rowsAppointmentDone}
					currentPage={1}
					itemsPerPage={1}
					/>
				</Flex>
			</Card>
			</Flex>
			<FooterProfessionals/>
		</>
    );
}