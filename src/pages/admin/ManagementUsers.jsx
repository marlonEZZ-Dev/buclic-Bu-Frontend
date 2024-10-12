import { 
  Divider,
  Flex, 
  Select 
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from '../../components/global/Modal.jsx'
import SearchInput from '../../components/global/SearchInput.jsx'
import SmallInput from '../../components/global/SmallInput.jsx'
import StateUser from '../../components/global/StateUser.jsx'
import TablePaginationUsers from '../../components/global/TablePaginationUsers.jsx'

import styles from "../../styles/admin/managementUsers.module.css"
import otherStyles from "../../styles/global/inputSmall.module.css"

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  //States de modals
  const [isModalImport, setIsModalImport] = useState(false)
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [isModalAllDelete, setIsModalAllDelete] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  //Predicados
  let isBeneficiary = changesDescription === 0
  let isStudent = changesDescription === 1
  let isFuncionary = changesDescription === 2
  let enableResponsive = deviceType === "mobile" || deviceType === "tablet"
  let isMobile = deviceType === "mobile"
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

  const cbxBeneficiaries = [
    {value:"almuerzo", label:"Beneficiario almuerzo"},
    {value:"refrigerio", label:"Beneficiario refrigerio"}
  ]
  
  const cbxFuncionary = [
    {value:"administrador", label:"Administrador (a)"},
    {value:"enfermero", label:"Enfermero (a)"},
    {value:"monitor", label:"Monitor (a)"},
    {value:"odontologo", label:"Odontólogo (a)"},
    {value:"psicologo", label:"Psicólogo (a)"},
    {value:"funcionario", label:"Funcionario (a)"},
    {value:"externo", label:"Externo (a)"},
  ]

  const cbxStatus = [
    {value:true, label:"Activo"},
    {value:false, label:"Inactivo"}    
  ]
  /*
  Las porperties estan en inglés entonces es necesario que correctamente se encuentren 
  los valores para cada columna, así hay una key que contiene el nombre de la property 
  del objeto y luego esta relacionada con el nombre de la columna que es el label esto
  para filtrar las columnas que se debe mostrar
  */
  const headerTb = [
    {key: isFuncionary  ? "uniqueDoc" : "code", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: enableResponsive ? "":"email", label: enableResponsive ? "":"Correo"},
    {key: "status", label: "Activo"}
  ]

  //functions  
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))
  
  
  const createRows = whoIs => {
    const o = {
        name: text => <span id={styles.name}>{ `Marlon Esteban${text}`}</span>,
        lastName: text => <span id={styles.name}>{ `Zambrano Zambrano${text}`}</span>,
        email: text => <span id={styles.email}>{ `marlon.zambrano@correounivalle.edu.co${text}`}</span>,
        status: thisStatus => <StateUser id={styles.active} active={thisStatus} />,
        toString(){
          return "user"
        }
    };
    
    switch (whoIs) {
        case 0:
            o.typeUser = 0;
            o.code = number => <span id={styles.code}>{202059431 + number}</span>;
            // o.actions = number => (
            // <Flex align='center' justify='space-between'>
            //   <ButtonDelete key={`delete${number}`} onClick={handlerBtnDelete} />
            //   <ButtonEdit key={`edit${number}`} onClick={handlerBtnEdit} />
            // </Flex>);
            o.plan = 2711;
            o.grant = "almuerzo";
            return Array.from({ length: 11 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                // actions: o.actions(index),
                typeUser: o.typeUser,
                code: o.code(index),
                plan: o.plan,
                grant: o.grant
            }));
        case 1:
            o.typeUser = 1;
            o.code = number => <span id={styles.code}>{202059431 + number}</span>;
            o.plan = 2711;
            // o.edit = number => <ButtonEdit id={styles.edit} key={`edit${number}`} onClick={handlerBtnEdit} />;
            return Array.from({ length: 10 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                // edit: o.edit(index),
                typeUser: o.typeUser,
                code: o.code(index),
                plan: o.plan
            }));
        case 2:
            o.typeUser = 2;
            o.uniqueDoc = <span id={styles.code}>{999999999}</span>;
            o.area = "Adminstrativa";
            o.rol = "monitor";
            // o.edit = number => <ButtonEdit id={styles.edit} key={`edit${number}`} onClick={handlerBtnEdit} />;
            return Array.from({ length: 10 }, (_, index) => ({
                name: o.name(index),
                lastName: o.lastName(index),
                email: o.email(index),
                status: o.status(index % 2 === 0),
                // edit: o.edit(index),
                typeUser: o.typeUser,
                uniqueDoc: o.uniqueDoc,
                area: o.area,
                rol: o.rol
            }));
        default:
            return [];
    }
};

  //Handlers
  const handlerClick = type => setChangesDescription(users.get(type))

  const showError = () => {
    console.dir(rows)
  }

  //Manejadores de estado de modals
  const handlerOpenModalImport = () => setIsModalImport(true)
  const handlerCloseModalImport = () => setIsModalImport(false)
  
  const handlerOpenModalEdit = row => {
    setIsModalEdit(true)
    setObjectSelected(row)
    console.dir(row)
  }

  const handlerCloseModalEdit = () => setIsModalEdit(false)

  const handlerOpenModalDelete = row => {
    setIsModalDelete(true)
    setObjectSelected(row)
    console.dir(objectSelected)
  }
  const handlerCloseModalDelete = () => setIsModalDelete(false)

  const handlerOpenModalAllDelete = () => setIsModalAllDelete(true)
  const handlerCloseModalAllDelete = () => setIsModalAllDelete(false)
  //---------------------------------------------------------
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
    setRows(createRows(changesDescription))
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
        <Flex vertical justify='space-between' align='center' gap="large">
        <h4>Editar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</h4>
        <Flex gap={29}>
          <SmallInput
            isRenderAsteric={false}
            title='Nombre'
            value={objectSelected.name.props.children}/>
          <SmallInput
            title='Apellidos'
            value={objectSelected.lastName.props.children}/>
        </Flex>

        <Flex gap={29}>
          <SmallInput
            title={isFuncionary ? "Cédula" : "Código estudiantil"}
            value={isFuncionary ? objectSelected.uniqueDoc.props.children : objectSelected.code.props.children}/>
          <SmallInput
            isRenderAsteric={isFuncionary ? false:true}
            title={isFuncionary ? "Área dependiente":"Plan"}
            value={isFuncionary ? objectSelected.area : objectSelected.plan}/>
        </Flex>
          
        <Flex gap={29}>
          <SmallInput 
            title='Correo electrónico'
            value={objectSelected.email.props.children}/>
          <label className={`${otherStyles.labels}`}>
            {isStudent ? "Estado" 
            : isFuncionary ? "Rol" 
            : "Tipo de Beca"}
          <Select
            value={isStudent ? objectSelected.status.props.active : 
              isFuncionary ? objectSelected.rol 
              : objectSelected.grant}
            className={styles.comboboxes}
            options={isStudent ? cbxStatus 
              : isFuncionary ? cbxFuncionary 
              : cbxBeneficiaries}/>
          </label>
        </Flex>

        {isFuncionary ? <Flex align='center' justify='flex-start'>
        <label className={`${otherStyles.labels}`}>
            Estado
          <Select
            placeholder="Selecciona"
            value={objectSelected.status.props.active}
            className={styles.comboboxes}
            options={cbxStatus}/>
        </label>
        </Flex>
        : ""}
        </Flex>
        <Flex
        align='center'
        gap='small'
        justify='space-evenly'>
          <button className={styles.buttonSave}>Guardar</button>
          <button className={styles.buttonCancel} onClick={handlerCloseModalEdit}>Cancelar</button>
        </Flex>
      </Modal>) : ""}
      {isModalAllDelete ? (
        <Modal
        open={isModalAllDelete}
        onClose={handlerCloseModalAllDelete}>
          <Flex vertical>
            <span>Eliminar beneficiarios</span>
            <p>
              ¿Desea eliminar todos los beneficiarios
              <br />
              actuales de la plataforma?
            </p>
          </Flex>
          <Flex
            align='center'
            gap='small'
            justify='space-evenly'>
              <button className={styles.buttonCancel} onClick={handlerCloseModalAllDelete}>Cancelar</button>
              <button className={styles.buttonSave}>Guardar</button>
          </Flex>
        </Modal>
      ) : ""}
      {isModalDelete ? (
        <Modal
        open={isModalDelete}
        onClose={handlerCloseModalDelete}>
          <Flex vertical>
            <span>Eliminar beneficiario</span>
            <p>
              ¿Desea eliminar el beneficiario de la
              <br />
              plataforma?
            </p>
          </Flex>
          <Flex
            align='center'
            gap='small'
            justify='space-evenly'>
              <button className={styles.buttonCancel} onClick={handlerCloseModalDelete}>Cancelar</button>
              <button className={styles.buttonSave}>Guardar</button>
          </Flex>
        </Modal>
      ) : ""}
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
          
            <Flex 
            gap={29} 
            vertical={deviceType === "mobile" ? true:false}>
              <SmallInput
                title='Nombre'
                placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
              <SmallInput
                title='Apellidos'
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}/>
            </Flex>

          <Flex 
          gap={29}
          vertical={deviceType === "mobile" ? true:false}
          >
            <SmallInput
              title={isFuncionary ? "Cédula" : "Código estudiantil"}
              placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}/>
            <SmallInput
              isRenderAsteric={isFuncionary ? false:true}
              title={isFuncionary ? "Área dependiente":"Plan"}
              placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}/>
          </Flex>
          
          <Flex 
          gap={29}
          vertical={deviceType === "mobile" ? true:false}
          >
            <SmallInput 
              title='Correo electrónico'
              placeholder='Correo del estudiante'/>
          {!isStudent || !enableResponsive ? 
            <label 
            className={`${otherStyles.labels} ${isStudent ? "visibility-hidden" :""}`}>
            {isFuncionary ? "Rol" : 
            <span>Tipo de beca <span className={otherStyles.asteric}>*</span></span>}          
            <Select
              placeholder="Selecciona"
              className={styles.comboboxes}
              options={isFuncionary ? cbxFuncionary : cbxBeneficiaries}/>
            </label>: ""}
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
        <Flex wrap
        justify='center'
        gap={11}>
          <SearchInput
            placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantíl'}/>
          {isBeneficiary ? 
          <button 
          className={styles.buttonDeleteBen}
          onClick={handlerOpenModalAllDelete}>
            Borrar los
            <br />
            beneficiarios
          </button> : ""}
        </Flex>
        <Flex vertical>
          <p className={styles.marginTable}>
          {`Tabla de ${
          isFuncionary ? "funcionarios y externos registrados": 
            isStudent ? "estudiantes registrados" : 
              "beneficiarios registrados"}`}
          </p>
          <Flex align='center' justify='center' wrap>
            <TablePaginationUsers
              columns={headerTb}
              rows={rows}
              enableDelete={isBeneficiary ? true:false}
              enableEdit
              nameActionsButtons={isBeneficiary ? "Acciones":"Editar"}
              currentPage={1}
              itemsPerPage={isMobile ? 5 : 10}
              onEdit={handlerOpenModalEdit}
              />
          </Flex>
        </Flex>        
        </MenuBecas>
      </main>
    </>
  )
}