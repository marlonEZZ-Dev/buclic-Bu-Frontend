import { 
  Divider,
  Flex, 
  Select } from 'antd'
import { useState } from 'react'
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import styles from "../../styles/admin/managementUsers.module.css"

export default function ManagementUsers(){
  
  const buttons = [
    {type:"Beneficiarios",label:"Beneficiarios"},
    {type:"Estudiantes",label:"Estudiantes"},
    {type:"Funcionarios",label:"Funcionarios"}
  ]

  const [changesDescription, setChangesDescription] = useState(0)
  const [selectedType, setSelectedType] = useState("Estudiantes")
  
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
      description:"Aquí puedes agregar personas con alguna dependencia en la universidado externas"
    }
  ]
  
  return (
    <>
      <HeaderAdmin/>
      <div className={styles.menuGrant}>
        <MenuBecas 
        buttons={buttons}
        selectedType={selectedType}>
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
              Nombre <span>*</span>
              <input 
              type="text"
              className={styles.inputs} 
              placeholder='Nombre(s) del estudiante'/>
            </label>
            <label className={styles.labels}>
              Apellidos <span>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Apellidos del estudiante'/>
            </label>
          </Flex>

          <Flex gap={29}>
          <label className={styles.labels}>
              Código estudiantil <span>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Código del estudiante'/>
            </label>
            <label className={styles.labels}>
              Plan <span>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Plan del estudiante'/>
            </label>
          </Flex>
          
          <Flex gap={29}>
          <label className={styles.labels}>
              Correo electrónico <span>*</span>
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Correo del estudiante'/>
            </label>
            <label className={styles.labels}>
              Tipo de beca
              <Select
              placeholder="Selecciona"
              className={styles.comboboxes}
              options={[
                {value:"almuerzo", label:"Beneficiario almuerzo"},
                {value:"refrigerio", label:"Beneficiario refrigerio"}
              ]}
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
        >
          <input 
          type="text"
          className={styles.inputs}
          placeholder='código estudiantíl' />
          <button></button>
        </Flex>
        </MenuBecas>
      </div>
    </>
  )
}