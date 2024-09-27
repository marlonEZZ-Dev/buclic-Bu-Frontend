import { 
  Divider,
  Flex, 
  Select } from 'antd'
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
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
        <MenuBecas
          buttons={buttons}
        >
        <button className={styles.buttonImport}>
          Importar
        </button>
        <div className={styles.contentTitles}>
          <h3>Estudiantes del sistema</h3>
          <p>Aquí puedes agregar estudiantes beneficiarios o no de la beca</p>
        </div>
        <Flex
          align='center'
          justify='space-evenly'
          >

          <Flex 
          vertical
          align='center'
          justify='center'
          >
          <label className={styles.labels}>
              Nombre
              <input 
              type="text"
              className={styles.inputs} 
              placeholder='Nombre(s) de estudiante'/>
            </label>
            <label className={styles.labels}>
              Código estudiantil
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Código del estudiante'/>
            </label>
            <label className={styles.labels}>
              Correo electrónico
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Correo del estudiante'/>
            </label>
          </Flex>

          <Flex vertical>
          <label className={styles.labels}>
              Apellidos
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Apellidos del estudiante'/>
            </label>
            <label className={styles.labels}>
              Plan
              <input 
              type="text" 
              className={styles.inputs}
              placeholder='Plan del estudiante'/>
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
            <button>Guardar</button>
            <button>Cancelar</button>
          </Flex>
          <Divider/>
        </MenuBecas>
      </div>
    </>
  )
}