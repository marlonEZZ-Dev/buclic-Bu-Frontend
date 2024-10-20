import Attendance from "../../components/global/Attendance.jsx"
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx"
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx"
import Modal from "../../components/global/Modal.jsx"
import SearchInput from "../../components/global/SearchInput.jsx"
import StateUser from "../../components/global/StateUser.jsx"
import TablePagination from "../../components/global/TablePagination.jsx"
import Tables from "../../components/global/Tables.jsx"

import { Card, Flex } from "antd"
import {ExclamationCircleOutlined} from "@ant-design/icons"
import dayjs from "dayjs"
import 'dayjs/locale/es'

import styles from "../../styles/psychology/agendaPsych.module.css"
import cssButtonsModal from "../../styles/admin/managementUsers.module.css"

import { useState } from "react"

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

	const rowsAppoinmentPending = [
		[
			"2 PM","Carolina Perez",123456789, <AssistanceCell key={1}/>],
		[
			"3 PM","José Casanova",123456789, <AssistanceCell key={2}/>]
	]

	const rowsAppointmentDone = [
		[dayjs("2024-09-30T13:00:00").format("DD/MM/YYYY h:mm A"), "Mario Sánchez",123456789,<StateUser key={1} active={false}/>]
	]
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
					enableClassname
					classNameContainer={styles.table}
					columns={appointmentPendingColums}
					rows={rowsAppoinmentPending}/>
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