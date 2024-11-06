import { Divider, Flex, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useState, useRef } from 'react'

import ButtonRefresh from '../../components/admin/ButtonRefresh.jsx'
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from '../../components/global/Modal.jsx'
import Search  from '../../components/admin/SearchInput.jsx'
import StateUser from '../../components/global/StateUser.jsx'
import SmallInput from '../../components/global/SmallInput.jsx'
import TablePaginationUsers from '../../components/global/TablePaginationUsers.jsx'

import styles from "../../styles/admin/managementUsers.module.css"

import { 
  createUser, 
  deleteBeneficiaries, 
  editUser, 
  importUsers, 
  listUsers,
  searchUser, 
  deleteBeneficiary 
} from "../../services/admin/management_user.js"

import { 
  validCode, 
  validEmail, 
  validGrant, 
  validLastname, 
  validName, 
  validPlan, 
  validRol,
  validStatus
} from '../../services/validations.js'
import deepEqual from '../../utils/functions/deep_equal.js'
import ReusableModal from '../../components/global/ReusableModal.jsx'
import SelectWithError from '../../components/global/SelectWithError.jsx'

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [objectSelectedClone, setObjectSelectedClone] = useState(null)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  const [savePressed, SetSavePressed] = useState(false)
  const [refreshFields, setRefreshFields] = useState(0)
  const [statusRolesGrantSelect, setStatusRolesGrantSelect] = useState(undefined)
  const [statusEstadoRolTipoBecaSelect, setStatusEstadoRolTipoBecaSelect] = useState(undefined)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [pressedSave, setPressedSave] = useState(false)
  //Cargar archivo
  const [file, setFile] = useState(null)
  const hiddenFileInput = useRef(null)
  const [uploadStatus, setUploadStatus] = useState("ninguno")
  //nofity
  const [messageApi, contextHolder] = message.useMessage()
  //modals
  const [isModalImport, setIsModalImport] = useState(false)
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [isModalAllDelete, setIsModalAllDelete] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  const defaultValidation = {
    username: "",
    name: "",
    lastName: "",
    email: "",
    plan: "",
    roles: "",
    grant: ""
  }
  const [okValidation, setOkValidation] = useState(defaultValidation)
  const [okValidationEdit, setOkValidationEdit] = useState(defaultValidation)
  //Datos
  const [codeUser, setCodeUser] = useState("")
  const initialUser = {
    username:"",
    name:"",
    lastName:"",
    email: "",
    plan:"",
    roles: [],
    grant: ""
  }
  const [user, setUser] = useState(initialUser)
  //Predicados
  let isBeneficiary = changesDescription === 0
  let isStudent = changesDescription === 1
  let isFuncionary = changesDescription === 2
  let isMobile = deviceType === "mobile"
  let enableResponsive = isMobile || deviceType === "tablet"
  //Definicion de variables

  const fontSizeTitleModal = {fontSize:"1.5rem"}

  //Pestañas para cada usuario
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

  //Valores para el combobox o lista desplegable
  const cbxBeneficiaries = [
    {value:"Beneficiario almuerzo", label:"Beneficiario almuerzo"},
    {value:"Beneficiario refrigerio", label:"Beneficiario refrigerio"}
  ]
  
  const cbxFuncionary = [
    {value:"ADMINISTRADOR", label:"Administrador (a)"},
    {value:"ENFERMERO", label:"Enfermero (a)"},
    {value:"MONITOR", label:"Monitor (a)"},
    {value:"ODONTOLOGO", label:"Odontólogo (a)"},
    {value:"PSICOLOGO", label:"Psicólogo (a)"},
    {value:"FUNCIONARIO", label:"Funcionario (a)"},
    {value:"EXTERNO", label:"Externo (a)"}
  ]

  const cbxStatus = [
    {value:true, label:"Activo"},
    {value:false, label:"Inactivo"}    
  ]
  //-------------------------------------------
  /*
  Las porperties estan en inglés entonces es necesario que correctamente se encuentren 
  los valores para cada columna, así hay una key que contiene el nombre de la property 
  del objeto y luego esta relacionada con el nombre de la columna que es el label esto
  para filtrar las columnas que se debe mostrar
  */
  const headerTb = !enableResponsive ? [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: "email", label: "Correo"},
    {key: "isActive", label: "Activo"}
  ] : [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: "isActive", label: "Activo"}
  ]

  //functions 
  //Crea un mapa para asociar cada tipo de usuario a un número 
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))

  const tranformToStateUser = atribbute => <StateUser active={atribbute} />
  
  const getTypeUserCurrent = () => buttons[changesDescription].type.toLowerCase()
  
  const getArrObjInArrStr = arr => arr.map( obj => obj.name )

  const loadUsers = async () => {
  if (buttons[changesDescription]) {
    try {
      const result = await listUsers(getTypeUserCurrent(), currentPage, 10);
      if ("success" in result) {
        notifyError(result.message);
        return;
      }
      setRows(result.content.map(user => ({
        ...user,
        isActive: tranformToStateUser(user.isActive),
        roles: getArrObjInArrStr(user.roles),
      })));
      setTotalItems(result.page.totalElements)
      console.log(result)
    } catch (error) {
        console.log(`Esto ocurre en loadUsers ${error}`);
        return { success: false, message: error.message };
    }
  }
  }

const handlePageChange = page => {
  setCurrentPage(page)
  loadUsers()
}

  const notifyError = message => {
    messageApi.open({
      type:"error",
      content: message
    })
  }

  const notifySuccess = message => {
    messageApi.open({
      type:"success",
      content: message
    })
  }

  const getStatusValue = (statusComponent) => {
    if (React.isValidElement(statusComponent)) {
      return statusComponent.props.active
    }
    return statusComponent
  };

  const getValueComplexSelectInModal = () => {
    if(isStudent) return getStatusValue(objectSelected.isActive)
    if(isFuncionary) {
      return objectSelected.roles.includes("MONITOR") ? "MONITOR" : objectSelected.roles[0]
    }
    if(isBeneficiary && objectSelected.lunchBeneficiary){
      return "Beneficiario almuerzo"
    }else{
      return "Beneficiario refrigerio"
    }   
  }

  const getOptionsComplexSelectInModal = () => {
    if(isStudent) return cbxStatus
    if(isFuncionary) return cbxFuncionary
    if(isBeneficiary) return cbxBeneficiaries
    console.error("no deberían existir más usuarios")
  }

  //Handlers
  const handlerClick = type => setChangesDescription(users.get(type))

  
  //Manejadores de estado de modals
  const handlerKeyDown = (e) => {
    // Evita la entrada de signos negativos y puntos
    if (e.key === "-" || e.key === "." || e.key === ",") {
      e.preventDefault();
    }
  };

  const handlerOpenModalImport = () => setIsModalImport(true)
  const handlerCloseModalImport = () => setIsModalImport(false)
  
  const handlerOpenModalEdit = row => {
    //Debe seguir ese orden el código...
    //Si lo va a modificar tenga mucho cuidado
    row.isActive = getStatusValue(row.isActive)
    setObjectSelectedClone(structuredClone(row))
    row.isActive = tranformToStateUser(row.isActive)
    setIsModalEdit(true)
    setObjectSelected(row)
  }  

  const handlerOpenModalDelete = row => {
    setIsModalDelete(true)
    setObjectSelected(row)
  }
  const handlerCloseModalDelete = () => setIsModalDelete(false)

  const handlerOpenModalAllDelete = () => setIsModalAllDelete(true)
  const handlerCloseModalAllDelete = () => setIsModalAllDelete(false)

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

  const handlerCreateUser = e => {
    const {name, value} = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handlerEditUser = e => {
    const {name, value} = e.target;
  
    setObjectSelected(prev => ({
        ...prev,
        [name]: value
    }));    
  }

  const handlerSetSelectCreateUser = value => {
    setUser(prevUser => ({
      ...prevUser,
      grant: value
    }));
  }

  const handlerAddRoleUserCreate = value => {
    setUser(prevUser => ({
      ...prevUser,
      roles:[value]
    }))
  }

  const handlerRoleEditUser = value => {
    setObjectSelected(o => ({
      ...o,
      roles:[value]
    }));
}

  const changeClassToRed = (e, valid) => {
    if((typeof valid === "string") || !(e.target.checkValidity())){
      e.target.classList.add("invalid")
    }else{
      e.target.classList.remove("invalid")
    }
  }

  const handlerBlurSelect = (valid, fnState) => fnState((typeof valid === "string") ? "error" : "")

  const handlerOkValidation = ({name, value, fnState = () => {}, clear = false}) => {
    if(clear) {
      fnState(defaultValidation)
      setStatusEstadoRolTipoBecaSelect(undefined)
      setStatusRolesGrantSelect(undefined)
    }else{
      fnState( o => ({
        ...o,
        [name]: value === true ? true : value
    }))
    }    
  }

  const handlerCloseModalEdit = () => {
    setIsModalEdit(false)
    handlerOkValidation({clear: true})
  }

  // const handlerVerify = (user, isEdit = false) => {
  //   console.log("user")
  //   console.dir(user)
  //   const p = isEdit ? setOkValidationEdit : setOkValidation 
  //   handlerOkValidation({name:"username", value:validCode(user.username, !isFuncionary), fnState: p})

  //   handlerOkValidation({name:"name", value:validName(user.name), fnState: p})

  //   handlerOkValidation({name:"lastName", value:validLastname(user.lastName), fnState: p})

  //   handlerOkValidation({name:"email", value:validEmail(user.email, isFuncionary), fnState: p})

  //   handlerOkValidation({name:"plan", value:validPlan(user.plan, !isFuncionary), fnState: p})
    
  //   handlerOkValidation({name:"roles", value:validRol(user.roles), fnState: p})

  //   handlerOkValidation({name:"grant", value:!isBeneficiary ? true : validGrant(user.grant, isModalEdit), fnState: p})
    
  //   return Object.values(isEdit ? okValidationEdit : okValidation)
  //     .every(i => (i.length !== 0) || (i === true)) 
  // }

  const handlerVerify = (user, isEdit = false) => {
    const fnState = isEdit ? setOkValidationEdit : setOkValidation;

    const validations = {
        username: validCode(user.username, !isFuncionary),
        name: validName(user.name),
        lastName: validLastname(user.lastName),
        email: validEmail(user.email, isFuncionary),
        plan: validPlan(user.plan, !isFuncionary),
        roles: validRol(user.roles),
        grant: !isBeneficiary ? true : validGrant(user.grant, isModalEdit)
    };

    // Actualiza el estado de validación de forma consistente
    fnState(validations);

    // Retorna true solo si todas las validaciones son correctas
    return Object.values(validations).every(result => result === true);
};


  const handlerSave = useCallback(async () => {
  try {
    const responseCreate = await createUser(user);
    if(responseCreate.success === false){
      notifyError(responseCreate.message)
      return
    }
    
    const responseLoad = await loadUsers()
    if((responseLoad !== undefined) && ("success" in responseLoad)){
      notifyError(responseLoad.message)
    }
      notifySuccess(responseCreate)
      setRefreshFields(refreshFields + 1)
    } catch (error) {
      console.error(`Esto es en handlerSave ${error}`);
    }
  }, [user, changesDescription, users, refreshFields, messageApi, setRefreshFields]);

  const handlerHiddenClickInput = () => hiddenFileInput.current.click()
  
  const handlerLoadFile = event => {
    const fileSelected = event.target.files[0]
    
    if (!fileSelected){ //si es null o undefined
      setUploadStatus("fallido")
      return
    }  
    if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(fileSelected.type)){
      setUploadStatus("fallaFormato")
      return
    }
    setFile(fileSelected)
    setUploadStatus("exitoso")     
  }

  const handlerSendFile = async () => {
    try {
      if(uploadStatus === "exitoso"){
        const responseImport = await importUsers((isBeneficiary || isStudent) ? "ESTUDIANTE" : "FUNCIONARIO" , file)
        if((responseImport !== undefined) && 
          ("success" in responseImport) && 
          (responseImport.success === false)){
          notifyError(responseImport.message)
          return
        }
        
        const responseLoad = await loadUsers()
        if((responseLoad !== undefined) &&
          ("success" in responseLoad) && 
          (responseLoad.success === false)){
          notifyError(responseLoad.message)
          return
        }

        if(responseImport !== undefined &&
          responseImport.success) {
            notifySuccess(responseImport.message)
          }
        if(responseLoad !== undefined && 
          responseLoad.success) {
            notifySuccess(responseLoad.message)
          }
      }
      return
    } catch (error) {
      console.error(`Ocurrio un error en handlerSendFile ${error}`);
    }
    
  }

  const handlerSearchUser = async () => {
    try{
      const userFound = await searchUser(codeUser)
      if((userFound !== undefined) && ("success" in userFound)){
        notifyError(userFound.message)
        return
      }
      const arrayUserFound = []
      userFound.isActive = tranformToStateUser(userFound.isActive)
      arrayUserFound.push(userFound)
      setRows(arrayUserFound)
    }catch(error){
      console.error(`Esto ocurre en handlerSearchUser ${error}`)
    }
  }
  //---------------------------------------------------------

  const handlerSendUserEdited = async () => {
    try {
      objectSelected.isActive = getStatusValue(objectSelected.isActive)

      const responseEdit = await editUser(objectSelected)
      
      if((responseEdit !== undefined) && ("errorGet" in responseEdit)){
        console.error(responseEdit.errorGet)
      }
      if((responseEdit !== undefined) && (responseEdit.success === false)){
        notifyError(responseEdit.message)
        return
      }

      const responseLoad = await loadUsers()
      if((responseLoad !== undefined) && (responseLoad.success === false)){
        notifyError(responseLoad.message)
        return
      }

      if(responseEdit.success){
        notifySuccess(responseEdit.message)
        console.log(objectSelected)
        return
      }
    } catch (error) {
      console.error(`Esto sucede en handlerSendUserEdited ${error}`)
    }
  }

  const handlerDeleteUser = async () => {
    if(!isBeneficiary) return
    try {
      const responseDel = await deleteBeneficiary(objectSelected.username)
      await loadUsers()
      notifySuccess(responseDel.message)
    } catch (error) {
      console.log("mensaje de error " + error.message)
    }
  }

  const handlerDeleteUsers = async () => {
    if(!isBeneficiary) return
    try {
      const responseAllDelete = await deleteBeneficiaries()
      if(!responseAllDelete.success){
        notifyError(responseAllDelete.message)
        return
      }
      await loadUsers()
      notifySuccess(responseAllDelete.message)
    } catch (error) {
      console.log(error.message);
    }
  }

  const handlerClearFields = () => {
    setUser(initialUser)
    setRefreshFields(refreshFields + 1)
    setStatusEstadoRolTipoBecaSelect(undefined)
    setStatusRolesGrantSelect(undefined)    
  }

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
    loadUsers()
    setUser(initialUser)
  }, [changesDescription])

  // Para cada campo en `user`, agrega un useEffect similar al siguiente
useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "name",
          value: validName(user.name),
          fnState: setOkValidation
      });
  }
}, [user.name, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "lastname",
          value: validLastname(user.lastName),
          fnState: setOkValidation
      });
  }
}, [user.lastName, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "email",
          value: validEmail(user.email, isFuncionary),
          fnState: setOkValidation
      });
  }
}, [user.email, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "username",
          value: validCode(user.username, !isFuncionary),
          fnState: setOkValidation
      });
  }
}, [user.username, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "plan",
          value: validPlan(user.plan, !isFuncionary),
          fnState: setOkValidation
      });
  }
}, [user.plan, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "roles",
          value: validRol(user.roles),
          fnState: setOkValidation
      });
  }
}, [user.roles, pressedSave]);

useEffect(() => {
  if (pressedSave) {
      handlerOkValidation({
          name: "grant",
          value: validGrant(user.grant, isModalEdit),
          fnState: setOkValidation
      });
  }
}, [user.grant, pressedSave]);

useEffect(() => {
  if (objectSelected) { // Verificación de existencia
      handlerOkValidation({
          name: "name",
          value: validName(objectSelected.name),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.name]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "lastname",
          value: validLastname(objectSelected.lastName),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.lastName]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "email",
          value: validEmail(objectSelected.email, isFuncionary),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.email]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "username",
          value: validCode(objectSelected.username, !isFuncionary),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.username]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "plan",
          value: validPlan(objectSelected.plan, !isFuncionary),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.plan]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "roles",
          value: validRol(objectSelected.roles),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.roles]);

useEffect(() => {
  if (objectSelected) {
      handlerOkValidation({
          name: "grant",
          value: validGrant(objectSelected.grant, isModalEdit),
          fnState: setOkValidationEdit
      });
  }
}, [objectSelected?.grant]);


  return (
    <>
      <HeaderAdmin/>
      <main className={styles.menuGrant}>
      {/* Modal import */}
      {isModalImport && (
      <Modal 
        open={isModalImport}
        footer={null}
        onClose={handlerCloseModalImport}>
        <Flex vertical align='center' justify='center'>
          <span style={fontSizeTitleModal}>Importar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</span>
          <p>Descarga la plantilla <a href={`../../../public/importar_${isStudent ? "estudiantes": isFuncionary ? "funcionarios": isBeneficiary ? "beneficiarios" : ""}.csv`}>aquí</a> y selecciona el archivo modificado</p>
        <Flex align="flex-start" justify='space-around'>
          <button 
          className={styles.buttonLoad}
          onClick={handlerHiddenClickInput}>
            <UploadOutlined/> Selecciona archivo
          </button>
          <input 
          type="file" 
          className={styles.displayNone}
          ref={hiddenFileInput} 
          onChange={handlerLoadFile}
          />
          {uploadStatus === "fallido" ? <span>Error al cargar el archivo</span> : 
          uploadStatus === "exitoso" ? <img src='../../assets/icons/csv.svg' width={40} height={40}/> : 
          uploadStatus === "fallaFormato" ? <p>    La extensión del archivo no es correcta debe ser un archivo con extensión csv</p> :
          uploadStatus === "ninguno" ? <span>    Cargue un archivo csv</span> : ""}
        </Flex>
        <Flex align='center' justify='center' gap={25}>
          <button 
          className={`button-cancel ${styles.buttons}`}
          onClick={handlerCloseModalImport}>
            Cancelar
          </button>
          <button 
          className={`button-save ${styles.buttons}`}
          onClick={() => {
            if(uploadStatus === "exitoso"){
              handlerSendFile()
              handlerCloseModalImport()
            }}}
          >
            Enviar
          </button>
        </Flex>
        </Flex>
      </Modal> )}
      {/* Modal edit table */}
      {isModalEdit && (
      <Modal
      open={isModalEdit}
      onClose={handlerCloseModalEdit}>
        <Flex vertical justify='space-around' align='center'>
        <span style={fontSizeTitleModal}>Editar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</span>
        <Flex gap={29} vertical={isMobile}>
          <SmallInput title='Nombre'
            isRenderAsteric={false}
            name="name"
            value={objectSelected.name}
            maxLength={50}
            errorMessage={okValidationEdit.name}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={ e => changeClassToRed(e, validName(e.currentTarget.value))}
            />
          <SmallInput title='Apellidos'
            isRenderAsteric={false}
            name="lastName"
            value={objectSelected.lastName}
            maxLength={50}
            errorMessage={okValidationEdit.lastName}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={e => changeClassToRed(e, validLastname(e.currentTarget.value))}
            />
        </Flex>

        <Flex gap={29} vertical={isMobile}>
          <SmallInput title={isFuncionary ? "Cédula" : "Código estudiantil"}
            name="username"
            min={isFuncionary ? 10000000 : 200000000}
            max={isFuncionary ? 9999999999 : 299999999}
            errorMessage={okValidationEdit.username}
            required
            isRenderAsteric={false}
            className={styles.inputWidthModal}
            value={objectSelected.username}
            onChange={e => handlerEditUser(e)}
            onKeyDown={handlerKeyDown}
            />
          <SmallInput title={isFuncionary ? "Área dependiente":"Plan"}
            isRenderAsteric={false}
            type={isFuncionary ? "text" : "number"}
            name="plan"
            value={objectSelected.plan}
            errorMessage={okValidationEdit.plan}
            min={isFuncionary ? undefined : 1000}
            max={isFuncionary ? undefined : 9999}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onKeyDown={isFuncionary ? () => {} : e => handlerKeyDown(e)}
            />
        </Flex>
          
        <Flex gap={29} vertical={isMobile}>
          <SmallInput title='Correo electrónico'
            value={objectSelected.email}
            isRenderAsteric={false}
            errorMessage={okValidationEdit.email}
            name="email"
            type="email"
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            />
          <SelectWithError title={isStudent ? "Estado" 
            : isFuncionary ? "Rol" 
            : "Tipo de Beca"}
            errorMessage={isStudent ? okValidationEdit.status : isFuncionary ? okValidationEdit.roles : okValidationEdit.grant} 
            value={getValueComplexSelectInModal()}
            status={statusEstadoRolTipoBecaSelect}
            options={getOptionsComplexSelectInModal()}
            onSelect={ (value, option) => {
              const selected = option.value
              if(isStudent) handlerEditUser({target:{name:"isActive", value:selected}})
              if(isBeneficiary) {
                handlerEditUser({target:{name:"lunchBeneficiary", value:selected}})
              }
              if(isFuncionary) handlerRoleEditUser(selected)
            }}
            onChange={value => {
              if(isStudent) handlerBlurSelect(validStatus(value), setStatusEstadoRolTipoBecaSelect)
              if(isBeneficiary) handlerBlurSelect(validGrant(value), setStatusEstadoRolTipoBecaSelect)
              if(isFuncionary) handlerBlurSelect(validRol(value), setStatusEstadoRolTipoBecaSelect)
            }}
            />
        </Flex>

        {isFuncionary && <Flex align='center' justify='flex-start'>
        <SelectWithError title='Estado'
          errorMessage={okValidationEdit.status}
          placeholder="Selecciona"
          value={getStatusValue(objectSelected.isActive)}
          options={cbxStatus}
          onSelect={ (value, option) => handlerEditUser({target:{name:"isActive", value:option.value}})}
          onChange={value => handlerBlurSelect(validStatus(value), setStatusEstadoRolTipoBecaSelect)}
          />
        </Flex>
        }
        </Flex>
        <Flex
        align='center'
        gap='small'
        justify='space-evenly'>
          <button 
          className={`button-save ${styles.buttons}`}
          onClick={() => {
            if(!deepEqual(objectSelected, objectSelectedClone)){
              if(handlerVerify(objectSelected, isModalEdit)){
                if(objectSelected.roles.includes("MONITOR")) objectSelected.roles[1] = "ESTUDIANTE"
                handlerSendUserEdited() //Sólo se envía sí realmente hubieron cambios
                setObjectSelectedClone(null)
                handlerCloseModalEdit(false)
              }
            }
            return
            }}>
            Guardar
          </button>
          <button className={`button-cancel ${styles.buttons}`}
          onClick={() => {
            setObjectSelected(objectSelectedClone)
            handlerOkValidation({clear: true, fnState: setOkValidationEdit})
            // setIsModalEdit(false)
          }}>Cancelar</button>
        </Flex>
      </Modal>) }
      {isModalAllDelete && (
        <ReusableModal 
        title='Eliminar beneficiarios' 
        content='¿Desea eliminar todos los beneficiarios actuales de la plataforma?'
        cancelText='No'
        confirmText='Si'
        visible={isModalAllDelete}
        onCancel={handlerCloseModalAllDelete}
        onConfirm={() => {
          handlerDeleteUsers()
          .then(() => handlerCloseModalAllDelete)
          .catch( error => console.log(error))
        }}/>)}
      {isModalDelete && (
        <ReusableModal 
        title='Eliminar beneficiario'
        content='¿Desea eliminar el beneficiario de la plataforma?'
        cancelText='No'
        confirmText='Si'
        visible={isModalDelete}
        onCancel={handlerCloseModalDelete}
        onConfirm={() => {
          handlerDeleteUser()
          .then(handlerCloseModalDelete())
          .catch()
        }}
        />
      ) }
      {contextHolder}
        <MenuBecas 
          buttons={buttons}
          onSelect={type => {
            handlerClick(type)
            setCurrentPage(0)
            handlerOkValidation({clear: true, fnState: setOkValidation})
            setPressedSave(false)
          }}
          defaultSelected={buttons[1].type}>
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
          gap={30}
          >          
            <Flex 
            gap={29} 
            vertical={isMobile}>
              <SmallInput title='Nombre'
                key={`name${changesDescription}${refreshFields}`}                
                placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={50}
                autoComplete="off"
                errorMessage={pressedSave ? okValidation.name : ""}
                name="name"
                required
                onChange={e => handlerCreateUser(e)}/>
              <SmallInput title='Apellidos'
                key={`lastName${changesDescription}${refreshFields}`}
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={50}
                autoComplete="off"
                errorMessage={pressedSave ? okValidation.lastName : ""}
                required
                name="lastName"
                onChange={e => handlerCreateUser(e)}
                />
            </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title={isFuncionary ? "Cédula" : "Código estudiantil"}
              key={`username${changesDescription}${refreshFields}`}              
              placeholder={isFuncionary ? "Cédula de la persona":"Ej: 202412345"}
              type="number"
              errorMessage={pressedSave ? okValidation.username : ""}
              autoComplete="off"
              min={isFuncionary ? 10000000 : 200000000}
              max={isFuncionary ? 99999999 : 299999999}
              required
              name="username"
              onChange={handlerCreateUser}
              onKeyDown={handlerKeyDown}
              />
            <SmallInput title={isFuncionary ? "Área dependiente":"Plan"}
              isRenderAsteric={!isFuncionary}
              key={`plan${changesDescription}${refreshFields}`}
              type={isFuncionary ? "text" : "number"} 
              placeholder={ isFuncionary ? "Área de la persona":"Ej: 1234"}
              min={isFuncionary ? undefined : 1000}
              max={isFuncionary ? undefined : 9999}
              errorMessage={pressedSave ? okValidation.plan : ""}
              required
              autoComplete="off"
              name="plan"
              onChange={e => handlerCreateUser(e)}
              onKeyDown={isFuncionary ? () => {} : e => handlerKeyDown(e)}
              />
          </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title='Correo electrónico'
              key={`email${changesDescription}${refreshFields}`}              
              placeholder='Correo del estudiante'
              errorMessage={pressedSave ? okValidation.email : ""}
              required
              autoComplete="off"
              type="email"              
              name="email"
              onChange={e => handlerCreateUser(e)}
            />
          {(!isStudent || !enableResponsive) && 
            <SelectWithError title={isFuncionary ? "Rol" : "Tipo de beca"}
              name={isBeneficiary ? "grant" : ""}
              key={`SelectImportant${changesDescription}${refreshFields}`}
              placeholder="Selecciona"
              classContainer={`${isStudent ? "visibility-hidden" :""}`}
              // defaultActiveFirstOption={isFuncionary}
              status={statusRolesGrantSelect}
              options={isFuncionary ? cbxFuncionary : cbxBeneficiaries}
              errorMessage={(isFuncionary && pressedSave) ? okValidation.roles : okValidation.grant}
              onSelect={(value, option) => {
                
                if(isBeneficiary) {
                  handlerSetSelectCreateUser(option.value)
                  return
                } 

                if(isFuncionary) {
                  handlerAddRoleUserCreate(option.value)
                  return
                }
              }}
              />}
          </Flex>
        </Flex>

        <Flex
        align='center'
        gap='small'
        justify='space-evenly'
        >
          <button className={`button-save ${styles.buttons}`} 
          onClick={() => {
            setPressedSave(true)
            if(isStudent || isBeneficiary) user.roles = ["ESTUDIANTE"]
            if(user.roles.includes("MONITOR")) user.roles[1] = "ESTUDIANTE"
            let verify = "No entro"
            if(handlerVerify(user)){
              verify = "Entro"
              SetSavePressed(!savePressed)
              handlerSave()
              handlerClearFields()
              handlerOkValidation({clear:true, fnState: setOkValidation})
              setPressedSave(false)
            }            
            console.log(verify)
            console.dir(okValidation)
          }}>Guardar</button>
          <button className={`button-cancel ${styles.buttons}`}
          onClick={() => {
            handlerClearFields()
            setPressedSave(false)
            handlerOkValidation({clear: true, fnState: setOkValidation})
          }}
          >Cancelar</button>
        </Flex>
        <Divider/>
        <Flex 
        wrap
        justify='center'
        gap={11}
        >
          <Search
            placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantil'}
            value={codeUser}
            onChange={e => setCodeUser(e.target.value)}
            onClick ={handlerSearchUser}
            />
          {isBeneficiary && 
          <button 
          className={styles.buttonDeleteBen}
          onClick={handlerOpenModalAllDelete}>
            Borrar los
            <br />
            beneficiarios
          </button>}
        </Flex>
        <Flex vertical>
          <Flex justify='space-between'>
            <p className={styles.marginTable}>
            {`Tabla de ${
            isFuncionary ? "funcionarios y externos registrados": 
              isStudent ? "estudiantes registrados" : 
                "beneficiarios registrados"}`}
            </p>
            <ButtonRefresh 
            className={styles.flexEnd}
            onClick = {() => {
              setCodeUser("")
              loadUsers()}}
            />
          </Flex>
          <Flex align='center' justify='center' wrap>
            <TablePaginationUsers
              columns={headerTb}
              rows={rows}
              enableDelete={isBeneficiary}
              enableEdit
              nameActionsButtons={isBeneficiary ? "Acciones":"Editar"}
              currentPage={currentPage}
              totalItems={totalItems}
              onNext={handlePageChange}
              onPrev={handlePageChange}
              onEdit={handlerOpenModalEdit}
              onDelete={isBeneficiary ? handlerOpenModalDelete:undefined}
              />
          </Flex>
        </Flex>        
        </MenuBecas>
      </main>
    </>
  )
}
