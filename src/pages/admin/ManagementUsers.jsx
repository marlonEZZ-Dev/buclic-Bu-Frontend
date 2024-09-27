import { 
  Divider,
  Flex, 
  Select } from 'antd'

import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import styles from "../../styles/managementUsers.module.css"

export default function ManagementUsers(){
  
  const buttons = [
    {type:"Estudiantes",label:"Estudiantes"},
    {type:"Funcionarios",label:"Funcionarios"}
  ]

  return (
    <>
      <HeaderAdmin/>
      <div className={styles.menuGrant}>
        <MenuBecas buttons={buttons}>
        <button className={styles.buttonImport}>
          Importar
        </button>
        <div className={styles.contentTitles}>
          <h3>Estudiantes del sistema</h3>
          <p>Aquí puedes agregar estudiantes beneficiarios o no de la beca</p>
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
          <button className=''></button>
        </Flex>
        </MenuBecas>
      </div>
    </>
  )
}