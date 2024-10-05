import Attendance from "../../components/global/Attendance.jsx"
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx"
import Modal from "../../components/global/Modal.jsx"
import SearchInput from "../../components/global/SearchInput.jsx"
import StateUser from "../../components/global/StateUser.jsx"
import TablePagination from "../../components/global/TablePagination.jsx"
import Tables from "../../components/global/Tables.jsx"

import { Card, Flex, Select } from "antd"
import moment from "moment/moment.js"
import 'moment/locale/es'

import styles from "../../styles/psychology/agendaPsych.module.css"
import { useEffect } from "react"

export default function AgendaPsych(){
	moment.locale("es")
  let date = moment()
	
	const cbxPsych = [
		{value:"psicologo1", label:"Psicólogo 1"},
		{value:"psicologo2", label:"Psicólogo 2"}
	]

	const appointmentPendingColums = ["Hora","Paciente", "Psicólogo (a)", "Asistencia"]
	
	const appointmentDoneColums = ["Horario cita","Paciente", "Código/Cédula", "Asistencia"]
	
	const rowsAppoinmentPending = [
		[
			"2 PM","Carolina Perez",<Select key={1}	placeholder="Selecciona" options={cbxPsych}/>, <Flex key={1} justify="space-around" align="center">
				<button className={styles.assistance}><Attendance non={false}/></button>
				<button className={styles.assistance}><Attendance/></button>
				</Flex>],
		[
			"3 PM","José Casanova",<Select key={2}	placeholder="Selecciona" options={cbxPsych}/>, <Flex key={2} justify="space-around" align="center">
				<button className={styles.assistance}><Attendance non={false}/></button>
				<button className={styles.assistance}><Attendance/></button>
				</Flex>]
	]

	const rowsAppointmentDone = [
		[moment("2024-09-30T13:00:00").format("DD/MM/YYYY h:mm A"), "Mario Sánchez","2057165",<StateUser key={1} active={false}/>]
	]

	useEffect(() => console.dir(date), [])
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
			<Modal></Modal>
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
					className={styles.table}
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
					enableClassname
					className={styles.table}
					columns={appointmentDoneColums}
					rows={rowsAppointmentDone}
					currentPage={1}
					itemsPerPage={1}
					/>
				</Flex>
			</Card>
			</Flex>
		</>
    );
}