import { 
  Divider,
  Flex, 
  Select 
} from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react'

import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import ButtonEdit from "../../components/global/ButtonEdit.jsx"
import StateUser from '../../components/global/StateUser.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';

import styles from "../../styles/admin/managementUsers.module.css"

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)

  //Predicados
  let isStudent = changesDescription === 1
  let isFuncionary = changesDescription === 2

  //Definicion de variables
  const buttons = [
    {type:"Beneficiarios",label:"Beneficiarios"},
    {type:"Estudiantes",label:"Estudiantes"},
    {type:"Funcionarios",label:"Funcionarios"}
  ]
  
  const descriptions = [
    {
      title:"Beneficiarios del sistema",
      description:"Aquí puedes agregar estudiantes beneficiarios de la beca"
    },
    {
      title:"Estudiantes del sistema",
      description:"Aquí puedes agregar estudiantes del sistema"
    },
    {
      title:"Funcionarios del sistema",
      description:"Aquí puedes agregar personas con alguna dependencia en la universidad o externas"
    }
  ]

  const cbxStudents = [
    {value:"almuerzo", label:"Beneficiario almuerzo"},
    {value:"refrigerio", label:"Beneficiario refrigerio"}
  ]
  
  const cbxFuncionary = [
    {value:"administrador", label:"Administrador (a)"},
    {value:"enfermero", label:"Enfermero (a)"},
    {value:"monitor", label:"Monitor (a)"},
    {value:"odontologo", label:"Odontólogo (a)"},
    {value:"psicologo", label:"Psicólogo (a)"}
  ]

  const o = {
    code : number => <span id={styles.code}>{202059125 + number}</span>,
    name: text => <span id={styles.name}>{ `Carolina Perez${text}`}</span>,
    email : text => <span id={styles.email}>{ `carolina.perez@correounivalle.edu.co${text}`}</span>,
    active : status => <StateUser id={styles.active} active={status}/>,
    edit : <ButtonEdit id={styles.edit}/>
  }

  const headerTb = [isFuncionary ? "Cédula":"Código", "Nombre", "Correo","Estado","Editar"]

  const rows = Array.from({length: 10}, (_,index) => [
    o.code(index), 
    o.name(index),
    o.email(index), 
    o.active(),
    o.edit
  ])
  //functions  
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))

  //Handlers
  const handlerClick = type => {
    setChangesDescription(users.get(type))
  }
  
  return (
    <>
      <HeaderAdmin/>
      <main className={styles.menuGrant}>
        <MenuBecas 
        buttons={buttons}
        onSelect={type => handlerClick(type)}>
        <button className={styles.buttonImport}>
          Importar
        </button>
        <div className={styles.contentTitles}>
          <h3>{descriptions[changesDescription].title}</h3>
          <p>{descriptions[changesDescription].description}</p>
        </div>

        <Flex
          align='center'
          justify='center'
          wrap
          gap={30}
          >
          
          <Flex gap={29}>
            <label className={styles.labels}>
              Nombre <span className={styles.asteric}>*</span>
              <input 
              type="text"
              className={styles.inputs} 
              placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
            </label>
            <label className={styles.labels}>
              Apellidos <span className={styles.asteric}>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
            </label>
          </Flex>

          <Flex gap={29}>
          <label className={styles.labels}>
              {isFuncionary ? "Cédula" : "Código estudiantil"} <span className={styles.asteric}>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}/>
            </label>
            <label className={styles.labels}>
              {isFuncionary ? "Área dependiente" : 
              <span>Plan <span className={styles.asteric}>*</span></span>}
              <input 
              type="text" 
              className={styles.inputs}
              placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}/>
            </label>
          </Flex>
          
          <Flex gap={29}>
          <label className={styles.labels}>
              Correo electrónico <span className={styles.asteric}>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Correo del estudiante'/>
          </label>
          <label className={`${styles.labels} ${isStudent ? "visibility-hidden" : ""}`}>
            {isFuncionary ? "Rol" : 
            <span>Tipo de beca <span className={styles.asteric}>*</span></span>}          
            <Select
            placeholder="Selecciona"
            className={styles.comboboxes}
            options={isFuncionary ? cbxFuncionary : cbxStudents}
            />
          </label>
          </Flex>
        </Flex>

        <Flex
        align='center'
        justify='space-evenly'>
          <button className={styles.buttonSave}>Guardar</button>
          <button className={styles.buttonCancel}>Cancelar</button>
        </Flex>
        <Divider/>
        <Flex
        justify='center'
        gap={11}
        >
          <input 
          type="text"
          className={styles.inputs}
          placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantíl'} />
          <button className={styles.buttonSearch}><SearchOutlined/></button>
        </Flex>
        <Flex vertical
        >
          <p className={styles.marginTable}>
          {`Tabla de ${
          isFuncionary ? "funcionarios y externos registrados": 
            isStudent ? "estudiantes registrados" : 
              "beneficiarios registrados"}`}
          </p>
        <TablePagination
        columns={headerTb}
        rows={rows}
        currentPage={1}
        itemsPerPage={10}
        />
        </Flex>        
        </MenuBecas>
      </main>
    </>
  )
}