import { 
  Divider,
  Flex, 
  Select 
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import ButtonEdit from "../../components/global/ButtonEdit.jsx"
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from '../../components/global/Modal.jsx'
import SearchInput from '../../components/global/SearchInput.jsx'
import SmallInput from '../../components/global/SmallInput.jsx'
import StateUser from '../../components/global/StateUser.jsx'
import TablePaginationV2 from '../../components/global/TablePaginationV2.jsx'

import styles from "../../styles/admin/managementUsers.module.css"
import otherStyles from "../../styles/global/inputSmall.module.css"

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [isModalImport, setIsModalImport] = useState(false)
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  //Predicados
  let isStudent = changesDescription === 1
  let isFuncionary = changesDescription === 2
  let enableResponsive = deviceType === "mobile" || deviceType === "tablet"
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
  //Las porperties se llaman como las llaves en inglés para que se puedan encontrar en el componente table
  const headerTb = [
    {key: isFuncionary  ? "uniqueDoc" : "code", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: enableResponsive ? "":"email", label: enableResponsive ? "":"Correo"},
    {key: "status", label: "Estado"},
    {key: "edit", label: "Editar"}
  ]

  //functions  
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))
  
  
  const createRows = (onClickBtnEdit, whoIs) => {
    const o = {
        name: text => <span id={styles.name}>{ `Marlon Esteban${text}`}</span>,
        lastName: text => <span id={styles.name}>{ `Zambrano Zambrano${text}`}</span>,
        email: text => <span id={styles.email}>{ `marlon.zambrano@correounivalle.edu.co${text}`}</span>,
        status: thisStatus => <StateUser id={styles.active} active={thisStatus} />,
        edit: <ButtonEdit id={styles.edit} onClick={onClickBtnEdit} />
    };
    
    switch (whoIs) {
        case 0:
            o.typeUser = 0;
            o.code = number => <span id={styles.code}>{202059431 + number}</span>;
            o.plan = 2711;
            o.grant = "almuerzo";
            return Array.from({ length: 10 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                edit: o.edit,
                typeUser: o.typeUser,
                code: o.code(index),
                plan: o.plan,
                grant: o.grant
            }));
        case 1:
            o.typeUser = 1;
            o.code = 202059431;
            o.plan = 2711;
            return Array.from({ length: 10 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                edit: o.edit,
                typeUser: o.typeUser,
                code: o.code,
                plan: o.plan
            }));
        case 2:
            o.typeUser = 2;
            o.uniqueDoc = number => <span id={styles.code}>{BigInt("0123456789") + number}</span>;
            o.area = "Adminstrativa";
            o.rol = "monitor";
            return Array.from({ length: 10 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                edit: o.edit,
                typeUser: o.typeUser,
                uniqueDoc: o.uniqueDoc(index),
                area: o.area,
                rol: o.rol
            }));
        default:
            return [];
    }
};

  //Handlers
  const handlerClick = type => setChangesDescription(users.get(type))
  
  const handlerRowEdit = row => {
    setObjectSelected(row)
    console.dir(row)
  }

  const showError = () => {
    console.dir(rows)
  }

  const handlerOpenModalImport = () => setIsModalImport(true)
  const handlerCloseModalImport = () => setIsModalImport(false)
  
  const handlerOpenModalEdit = () => setIsModalEdit(true)
  const handlerCloseModalEdit = () => setIsModalEdit(false)
  
  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 767) {
      setDeviceType('mobile');
    } else if (width >= 768 && width <= 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  };

  useEffect(() => {
    handleResize();

    // Añade el event listener para cambios en el tamaño de la pantalla
    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])
  
  useEffect(() => {
    setRows(createRows(handlerOpenModalEdit, changesDescription))
  }, [changesDescription])

  return (
    <>
      <HeaderAdmin/>
      <main className={styles.menuGrant}>
      {/* Modal import */}
      {isModalImport ? (
      <Modal 
        open={isModalImport}
        onClose={handlerCloseModalImport}>
        <Flex vertical>
          <h4>Importar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</h4>
          <p>Descarga la plantilla <a href="#">aquí</a> y selecciona el archivo modificado</p>
        <Flex justify='flex-start'>
          <button className={styles.buttonLoad}>
            <UploadOutlined /> Selecciona archivo
          </button>              
        </Flex>
        <Flex align='center' justify='center' gap={25}>
          <button 
          className={styles.buttonCancel}
          onClick={handlerCloseModalImport}>
            Cancelar
          </button>
          <button className={styles.buttonSave}>Aceptar</button>
        </Flex>
        </Flex>
      </Modal> ) : ""}
      {/* Modal edit table */}
      {isModalEdit ? (
      <Modal
      open={isModalEdit}
      onClose={handlerCloseModalEdit}>
        <h4>Editar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</h4>
        <Flex gap={29}>
          <SmallInput
            isRenderAsteric={false}
            title='Nombre'
            value={"s"}/>
          <SmallInput
            title='Apellidos'
            placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
        </Flex>

        <Flex gap={29}>
          <SmallInput
            title={isFuncionary ? "Cédula" : "Código estudiantil"}
            placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}/>
          <SmallInput
            isRenderAsteric={isFuncionary ? false:true}
            title={isFuncionary ? "Área dependiente":"Plan"}
            placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}/>
        </Flex>
          
        <Flex gap={29}>
          <SmallInput 
            title='Correo electrónico'
            placeholder='Correo del estudiante'/>
          <label className={`${otherStyles.labels} ${isStudent ? "visibility-hidden" : ""}`}>
          {isFuncionary ? "Rol" : 
          <span>Tipo de beca <span className={otherStyles.asteric}>*</span></span>}          
          <Select
            placeholder="Selecciona"
            className={styles.comboboxes}
            options={isFuncionary ? cbxFuncionary : cbxStudents}/>
          </label>
        </Flex>
      </Modal>) : ""}
        <MenuBecas 
          buttons={buttons}
          onSelect={type => handlerClick(type)}>
            <button 
            className={styles.buttonImport} 
            onClick={handlerOpenModalImport}>
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
          gap={30}>
          
            <Flex gap={29}>
              <SmallInput
                title='Nombre'
                placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
              <SmallInput
                title='Apellidos'
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
            </Flex>

          <Flex gap={29}>
            <SmallInput
              title={isFuncionary ? "Cédula" : "Código estudiantil"}
              placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}/>
            <SmallInput
              isRenderAsteric={isFuncionary ? false:true}
              title={isFuncionary ? "Área dependiente":"Plan"}
              placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}/>
          </Flex>
          
          <Flex gap={29}>
            <SmallInput 
              title='Correo electrónico'
              placeholder='Correo del estudiante'/>
            <label className={`${otherStyles.labels} ${isStudent ? "visibility-hidden" : ""}`}>
            {isFuncionary ? "Rol" : 
            <span>Tipo de beca <span className={otherStyles.asteric}>*</span></span>}          
            <Select
              placeholder="Selecciona"
              className={styles.comboboxes}
              options={isFuncionary ? cbxFuncionary : cbxStudents}/>
            </label>
          </Flex>
        </Flex>

        <Flex
        align='center'
        gap='small'
        justify='space-evenly'>
          <button className={styles.buttonSave} onClick={showError}>Guardar</button>
          <button className={styles.buttonCancel}>Cancelar</button>
        </Flex>
        <Divider/>
        <Flex
        justify='center'
        gap={11}>
          <SearchInput
            placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantíl'}/>
        </Flex>
        <Flex vertical>
          <p className={styles.marginTable}>
          {`Tabla de ${
          isFuncionary ? "funcionarios y externos registrados": 
            isStudent ? "estudiantes registrados" : 
              "beneficiarios registrados"}`}
          </p>
          <Flex align='center' justify='center' wrap>
            <TablePaginationV2
              columns={headerTb}
              rows={rows}
              currentPage={1}
              itemsPerPage={10}
              onRowClick={(row => handlerRowEdit(row))}/>
          </Flex>
        </Flex>        
        </MenuBecas>
      </main>
    </>
  )
}