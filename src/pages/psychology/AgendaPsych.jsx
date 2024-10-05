import Absense from "../../components/global/Absense.jsx"
import HeaderPsych from "../../components/psychology/HeaderPsych.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from "../../components/global/Modal.jsx"
import SearchInput from "../../components/global/SearchInput.jsx"
import TablePaginationUsers from "../../components/global/TablePaginationUsers.jsx"
import Tables from "../../components/global/Tables.jsx"

import { Flex, Select } from "antd"
import moment from "moment/moment.js"

import styles from "../../styles/psychology/agendaPsych.module.css"

export default function AgendaPsych(){
	moment.locale("es")
  const date = moment()
	
	const cbxPsych = [
		{value:"psicologo1", label:"Psicólogo 1"},
		{value:"psicologo2", label:"Psicólogo 2"}
	]

	const appointmentPendingColums = ["Hora","Paciente", "Psicólogo (a)", "Asistencia"]
	const appointmentDoneColums = ["Horario cita","Paciente", "Código/Cédula", "Asistencia"]
	const rowsAppoinmentPending = [
		[
			"2 PM","Carolina Perez",<Select key={1}	placeholder="Selecciona" options={cbxPsych}/>, <Flex key={1} justify="space-evenly">
				<button>✅</button>
				<button><Absense/></button>
				</Flex>],
		[
			"3 PM","José Casanova",<Select key={2}	placeholder="Selecciona" options={cbxPsych}/>, <Flex key={2} justify="space-evenly">
				<button>✅</button>
				<button><Absense/></button>
				</Flex>]
	]
		return(	
		<>
      <HeaderPsych/>
			<Flex align="center" justify="center">
				<h1 className="text-red">Agenda</h1>
				<p>
					Aquí se visualizan las citas pendientes para ser atendidas</p>
			</Flex>			
			<MenuBecas>
			<Modal></Modal>
				<Flex>
					<p className={`${styles.pseudoTableHeader}`}>
						{`${date.format("dddd D [de] MMMM [del] YYYY")}`}
					</p>
				</Flex>
				<Flex>
					<Tables
					columns={appointmentPendingColums}
					rows={rowsAppoinmentPending}/>
					<SearchInput
					placeholder="Fecha de consulta"
					/>
				</Flex>
				<Flex>
					<p></p>
					<TablePaginationUsers></TablePaginationUsers>
				</Flex>
			</MenuBecas>
		</>
    );
}