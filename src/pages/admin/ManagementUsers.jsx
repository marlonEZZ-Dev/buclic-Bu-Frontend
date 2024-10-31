import { Divider, Flex, Select, message } from 'antd'
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
import otherStyles from "../../styles/global/inputSmall.module.css"

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
import deepEqual from '../../utils/deep_equal.js'

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [objectSelectedClone, setObjectSelectedClone] = useState(null)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  const [savePressed, SetSavePressed] = useState(false)
  const [refreshFields, setRefreshFields] = useState(0)
  const [statusRolesGrantSelect, setStatusRolesGrantSelect] = useState("")
  const [statusEstadoRolTipoBecaSelect, setStatusEstadoRolTipoBecaSelect] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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
  const [isModalVerify, setIsModalVerify] = useState(false);
  const [modalStruct, setModalStruct] = useState({title:"",content:""})
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
  /*
  Las porperties estan en inglés entonces es necesario que correctamente se encuentren 
  los valores para cada columna, así hay una key que contiene el nombre de la property 
  del objeto y luego esta relacionada con el nombre de la columna que es el label esto
  para filtrar las columnas que se debe mostrar
  */
  const headerTb = [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: enableResponsive ? "":"email", label: enableResponsive ? "":"Correo"},
    {key: "isActive", label: "Activo"}
  ]

  const ITEM_PER_PAGE = 10

  //functions  
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))

  const tranformToStateUser = atribbute => <StateUser active={atribbute} />
  
  const getTypeUserCurrent = () => buttons[changesDescription].type.toLowerCase()
  
  const handlePageChange = page => setCurrentPage(page)
  
  const getArrObjInArrStr = arr => arr.map( obj => obj.name )

  const loadUsers = async () => {
    if (buttons[changesDescription]) {
        try {
            const result = await listUsers(getTypeUserCurrent(), currentPage-1)
            if("success" in result){
              notifyError(result.message)
              return
            }
            setTotalItems(result.page.totalElements)
            const data = result.content
            setRows(data.map(user => ({
              ...user,
              isActive: tranformToStateUser(user.isActive),
              roles: getArrObjInArrStr(user.roles)
            })))
        } catch (error) {
            console.log(`Esto ocurre en loadUsers ${error}`)
            return {success: false, message: error.message}
        }
    }
};
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
    if(isFuncionary) return objectSelected.roles[0]
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

  const handlerCloseModalEdit = () => setIsModalEdit(false)

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
    const mapea = new Map([
      ["username",validCode(value, !isFuncionary)],
      ["name",validName(value)],
      ["lastName",validLastname(value)],
      ["email",validEmail(value, isFuncionary)],
      ["plan",validPlan(value, !isFuncionary)],
      ["roles",validRol(value)],
      ["grant", !isBeneficiary ? true : validGrant(user.grant)]
    ])
    if(typeof (mapea.get(name)) === "boolean"){
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
    }
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
    if(value === "MONITOR"){
    setUser(prevUser => ({
      ...prevUser,
      roles:[value, "ESTUDIANTE"]
    }))
  }
  setUser(prevUser => ({
    ...prevUser,
    roles:[value]
  }))
  console.log("Roles en creación "+user.roles)
  }

  const handlerRoleEditUser = value => {
    if(value === "MONITOR"){
      setObjectSelected(o => ({
        ...o,
        roles:[value, "ESTUDIANTE"]
      }));
    }
    setObjectSelected(o => ({
      ...o,
      roles:[value]
    }));
    console.log("Roles en modificación "+objectSelected.roles)
}

  const handlerBlur = (e, valid) => {
    if((typeof valid === "string") || !(e.target.checkValidity())){
      e.target.classList.add("invalid")
    }else{
      e.target.classList.remove("invalid")
    }
  }

  const handlerBlurSelect = (valid, fnState) => {
    fnState((typeof valid === "string") ? "error" : "")
  }

  const handlerVerify = user => {
    let content = ""
    const verifier = [
      validCode(user.username, !isFuncionary),
      validName(user.name),
      validLastname(user.lastName),
      validEmail(user.email, isFuncionary),
      validPlan(user.plan, !isFuncionary),
      validRol(user.roles),
      !isBeneficiary ? true : validGrant(user.grant, isModalEdit)
    ]
    const allOk = verifier.every( i => i === true)
    if(allOk){
      return true
    }else{
      
      //Llena la modal
      content = verifier
      .filter( i => typeof i === "string")
      .map((i, index) => <p key={`paragraph${index}`}>{i}</p>)
      setModalStruct({
        title: "Advertencia", 
        content: content
      })
      setIsModalVerify(true)
      return false
    }
  }

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
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={ e => handlerBlur(e, validName(e.currentTarget.value))}
            />
          <SmallInput title='Apellidos'
            isRenderAsteric={false}
            name="lastName"
            value={objectSelected.lastName}
            maxLength={50}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={e => handlerBlur(e, validLastname(e.currentTarget.value))}
            />
        </Flex>

        <Flex gap={29} vertical={isMobile}>
          <SmallInput title={isFuncionary ? "Cédula" : "Código estudiantil"}
            name="username"
            min={isFuncionary ? 10000000 : 200000000}
            max={isFuncionary ? 9999999999 : 299999999}
            required
            isRenderAsteric={false}
            className={styles.inputWidthModal}
            value={objectSelected.username}
            onChange={e => handlerEditUser(e)}
            onBlur={e => handlerBlur(e, validCode(e.currentTarget.value, !isFuncionary))}
            />
          <SmallInput title={isFuncionary ? "Área dependiente":"Plan"}
            isRenderAsteric={false}
            type={(isStudent || isBeneficiary) ? "number" : "text"}
            name="plan"
            value={objectSelected.plan}
            min={(isStudent || isBeneficiary) ? 1000 : undefined}
            max={(isStudent || isBeneficiary) ? 9999 : undefined}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={e => handlerBlur(e, validPlan(e.currentTarget.value, !isFuncionary))}
            />
        </Flex>
          
        <Flex gap={29} vertical={isMobile}>
          <SmallInput title='Correo electrónico'
            value={objectSelected.email}
            isRenderAsteric={false}
            name="email"
            type="email"
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onBlur={e => handlerBlur(e, validEmail(e.currentTarget.value, isFuncionary))}
            />
          <label className={`${otherStyles.labels}`}>
            {isStudent ? "Estado" 
            : isFuncionary ? "Rol" 
            : "Tipo de Beca"}
          <Select value={getValueComplexSelectInModal()}
            className={`${styles.comboboxes} ${styles.inputWidthModal}`}
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
          </label>
        </Flex>

        {isFuncionary && <Flex align='center' justify='flex-start'>
        <label className={`${otherStyles.labels}`}>
            Estado
          <Select
            placeholder="Selecciona"
            value={getStatusValue(objectSelected.isActive)}
            className={`${styles.comboboxes} ${styles.inputWidthModal}`}
            options={cbxStatus}
            onSelect={ (value, option) => handlerEditUser({target:{name:"isActive", value:option.value}})}
            onChange={value => handlerBlurSelect(validStatus(value), setStatusEstadoRolTipoBecaSelect)}
            />
        </label>
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
              if(handlerVerify(objectSelected)){
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
          onClick={() => setObjectSelected(objectSelectedClone)}>Cancelar</button>
        </Flex>
      </Modal>) }
      {isModalAllDelete && (
        <Modal
        open={isModalAllDelete}
        footer={null}
        onClose={handlerCloseModalAllDelete}>
          <Flex vertical align='center' justify='space-around'>
            <span style={fontSizeTitleModal}>Eliminar beneficiarios</span>
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
              <button 
              className={`button-cancel ${styles.buttons}`} 
              onClick={handlerCloseModalAllDelete}>
                No
              </button>
              <button 
              className={`button-save ${styles.buttons}`}
              onClick={() => {
                handlerDeleteUsers()
                .then(() => handlerCloseModalAllDelete)
                .catch( error => console.log(error))
                
              }}>
                Si
              </button>
          </Flex>
        </Modal>
      ) }
      {isModalDelete && (
        <Modal
        open={isModalDelete}
        footer={null}
        onClose={handlerCloseModalDelete}>
          <Flex vertical align='center' justify='space-around'>
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
              <button 
              className={`button-cancel ${styles.buttons}`} 
              onClick={handlerCloseModalDelete}>
                No
              </button>
              <button 
              className={`button-save ${styles.buttons}`}
              onClick={() => {
                handlerDeleteUser()
                .then(handlerCloseModalDelete())
                .catch()
              }}>
                Si
              </button>
          </Flex>
        </Modal>
      ) }
      {isModalVerify && (
        <Modal 
        open={isModalVerify}
        footer={null}
        onClose={() => setIsModalVerify(false)}>
          <Flex vertical align='center' justify='center'>
            <span style={fontSizeTitleModal}>{modalStruct.title}</span>
            {modalStruct.content}
          </Flex>
          <Flex justify='center' align='center'>
            <button className={`button-save ${styles.buttons}`}
             onClick={() => setIsModalVerify(false)}>
              Entendido
            </button>
          </Flex>          
        </Modal>
      )}
      {contextHolder}
        <MenuBecas 
          buttons={buttons}
          onSelect={type => {handlerClick(type); setCurrentPage(1)}}
          defaultSelected={buttons[1].type}
          >
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
                name="name"
                required
                onChange={e => handlerCreateUser(e)}
                onBlur={ e => handlerBlur(e, validName(user.name))}
                />
              <SmallInput title='Apellidos'
                key={`lastName${changesDescription}${refreshFields}`}
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={50}
                required
                name="lastName"
                onChange={e => handlerCreateUser(e)}
                onBlur={e => handlerBlur(e, validLastname(user.lastName))}
                />
            </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title={isFuncionary ? "Cédula" : "Código estudiantil"}
              key={`username${changesDescription}${refreshFields}`}              
              placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}
              type="number"
              min={isFuncionary ? 10000000 : 200000000}
              max={isFuncionary ? 9999999999 : 299999999}
              required
              name="username"
              onChange={ e => handlerCreateUser(e) }
              onBlur={ e => handlerBlur(e, validCode(user.username, !isFuncionary))}
              />
            <SmallInput title={isFuncionary ? "Área dependiente":"Plan"}
              isRenderAsteric={!isFuncionary}
              key={`plan${changesDescription}${refreshFields}`}
              type={(isStudent || isBeneficiary) ? "number" : "text"} 
              placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}
              min={(isStudent || isBeneficiary) ? 1000 : undefined}
              max={(isStudent || isBeneficiary) ? 9999 : undefined}
              required
              name="plan"
              onChange={e => handlerCreateUser(e)}
              onBlur={e => handlerBlur(e, validPlan(user.plan, !isFuncionary))}
              />
          </Flex>
          
          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title='Correo electrónico'
              key={`email${changesDescription}${refreshFields}`}              
              placeholder='Correo del estudiante'
              required
              type="email"              
              name="email"
              onChange={e => handlerCreateUser(e)}
              onBlur={e => handlerBlur(e, validEmail(user.email, isFuncionary))}
            />
          {(!isStudent || !enableResponsive) && 
            <label 
            className={`${otherStyles.labels} ${isStudent ? "visibility-hidden" :""}`}>
            {isFuncionary ? "Rol" : 
            <span>Tipo de beca <span className={otherStyles.asteric}>*</span></span>}          
            <Select name={isBeneficiary ? "grant" : ""}
              key={`SelectImportant${changesDescription}${refreshFields}`}
              placeholder="Selecciona"
              className={styles.comboboxes}
              defaultActiveFirstOption={isFuncionary}
              status={statusRolesGrantSelect}
              options={isFuncionary ? cbxFuncionary : cbxBeneficiaries}
              onChange={value => {
                
                if(isBeneficiary) {
                  handlerSetSelectCreateUser(value)
                  return
                } 

                if(isFuncionary) {
                  handlerAddRoleUserCreate(value)
                  return
                }
              }}
              onBlur={() => {
                if(isBeneficiary || isFuncionary){
                  handlerBlurSelect(isBeneficiary ? validGrant(user.grant) : isFuncionary && validRol(user.roles), setStatusRolesGrantSelect)
                }
              }}
              />
            </label>}
          </Flex>
        </Flex>

        <Flex
        align='center'
        gap='small'
        justify='space-evenly'
        >
          <button className={`button-save ${styles.buttons}`} 
          onClick={() => {
            if(isStudent || isBeneficiary) user.roles = ["ESTUDIANTE"]
            if(handlerVerify(user)){
              SetSavePressed(!savePressed)
              handlerSave()
              handlerClearFields()
            }            
          }}>Guardar</button>
          <button className={`button-cancel ${styles.buttons}`}
          onClick={handlerClearFields}
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
              itemsPerPage={ITEM_PER_PAGE}
              onPageChange={handlePageChange}
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