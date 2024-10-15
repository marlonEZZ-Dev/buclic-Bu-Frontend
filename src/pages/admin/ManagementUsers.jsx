import { Divider, Flex, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState, useRef } from 'react'

import ButtonRefresh from '../../components/admin/ButtonRefresh.jsx'
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from '../../components/global/Modal.jsx'
import Search  from '../../components/admin/SearchInput.jsx'
import SmallInput from '../../components/global/SmallInput.jsx'
import TablePaginationUsers from '../../components/global/TablePaginationUsers.jsx'

import styles from "../../styles/admin/managementUsers.module.css"
import otherStyles from "../../styles/global/inputSmall.module.css"

import { createUser, deleteBeneficiaries, editUser, importUsers, listUsers, searchUser, deleteBeneficiary } from "../../services/admin/management_user.js"
import { validCode, validRol, validText } from '../../services/validations.js'

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  const [savePressed, SetSavePressed] = useState(false)
  //Cargar archivo
  const [file, setFile] = useState(null)
  const hiddenFileInput = useRef(null)
  const [uploadStatus, setUploadStatus] = useState("ninguno")
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
    {value:"EXTERNO", label:"Externo (a)"},
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

  //functions  
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))

  // const createRows = whoIs => {
  //   const o = {
  //       name: text => <span id={styles.name}>{ `Marlon Esteban${text}`}</span>,
  //       lastName: text => <span id={styles.name}>{ `Zambrano Zambrano${text}`}</span>,
  //       email: text => <span id={styles.email}>{ `marlon.zambrano@correounivalle.edu.co${text}`}</span>,
  //       status: thisStatus => <StateUser id={styles.active} active={thisStatus} />,
  //       toString(){
  //         return "user"
  //       }
  //   };
    
  //   switch (whoIs) {
  //       case 0:
  //           o.typeUser = 0;
  //           o.code = number => <span id={styles.code}>{202059431 + number}</span>;
  //           o.plan = 2711;
  //           o.grant = "almuerzo";
  //           return Array.from({ length: 11 }, (_, index) => ({
  //               name: o.name(index),
  //               lastName: o.lastName(index),
  //               email: o.email(index),
  //               status: o.status(index % 2 === 0),
  //               typeUser: o.typeUser,
  //               code: o.code(index),
  //               plan: o.plan,
  //               grant: o.grant
  //           }));
  //       case 1:
  //           o.typeUser = 1;
  //           o.code = number => <span id={styles.code}>{202059431 + number}</span>;
  //           o.plan = 2711;
  //           return Array.from({ length: 10 }, (_, index) => ({
  //               name: o.name(index),
  //               lastName: o.lastName(index),
  //               email: o.email(index),
  //               status: o.status(index % 2 === 0),
  //               typeUser: o.typeUser,
  //               code: o.code(index),
  //               plan: o.plan
  //           }));
  //       case 2:
  //           o.typeUser = 2;
  //           o.uniqueDoc = <span id={styles.code}>{999999999}</span>;
  //           o.area = "Adminstrativa";
  //           o.rol = "monitor";
  //           return Array.from({ length: 10 }, (_, index) => ({
  //               name: o.name(index),
  //               lastName: o.lastName(index),
  //               email: o.email(index),
  //               status: o.status(index % 2 === 0),
  //               typeUser: o.typeUser,
  //               uniqueDoc: o.uniqueDoc,
  //               area: o.area,
  //               rol: o.rol
  //           }));
  //       default:
  //           return [];
  //   }
  // };

  const loadUsers = async () => {
    if (buttons[changesDescription]) {
        try {
            const result = await listUsers(buttons[changesDescription].type.toLowerCase());
            setRows(result.content);
        } catch (error) {
            console.error("Error al listar usuarios:", error);
        }
    }
};

  //Handlers
  const handlerClick = type => setChangesDescription(users.get(type))

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
    const {name, value} = e.target
    setObjectSelected(o => ({
      ...o,
      [name]:value
    }))
  }

  // const handlerSetSelectEditUser = value => {
  //   setObjectSelected( o => ({
  //     ...o,
  //     lunchBeneficiary : value
  //   }))
  // }

  const handlerSetSelectCreateUser = value => {
    setUser(prevUser => ({
      ...prevUser,
      grant: value
    }));
  }

  const handlerAddRoleUserCreate = value => {
    setUser(prevUser => ({
      ...prevUser,
      roles:[...prevUser.roles, value]
    }))
  }

  const handlerRoleEditUser = value => {
    if(!objectSelected.roles.some( rol => rol.name === "ESTUDIANTE")){
      setObjectSelected(o => ({
        ...o,
        roles:[...o.roles, value]
      }))
      return
    }
    setObjectSelected(o => ({
      ...o,
      roles:[value]
    }))

  }

  const handlerVerifyUser = () => {
    const username = validCode(user.username, !isFuncionary)
    if(typeof username === "string"){
      setModalStruct({
        title:"Alerta",
        content:username
      })
      setIsModalVerify(true)
      return
    }
    const name = validText(user.name)
    if(typeof name === "string"){
      setModalStruct(name)
      setIsModalVerify(true)
      return
    }
    const lastname = validText(user.lastName)
    if(typeof lastname === "string"){
      setModalStruct(lastname)
      setIsModalVerify(true)
      return
    }
    const email = validText(user.email)
    if(typeof email === "string"){
      setModalStruct(email)
      setIsModalVerify(true)
      return
    }
    const plan = validText(user.plan)
    if(typeof plan === "string"){
      setModalStruct(plan)
      setIsModalVerify(true)
      return
    }
    const roles = validRol(user.roles)
    if(typeof roles === "string"){
      setModalStruct(roles)
      setIsModalVerify(true)
      return
    }
    const grant = validText(user.grant)
    if((typeof grant === "string") && (isBeneficiary)){
      setModalStruct(grant)
      setIsModalVerify(true)
      return
    }
    handlerSave()
  }

  const handlerSave = useCallback(async () => {
    let creationResult = null
    try {
      creationResult = await createUser(user);
      loadUsers()
      console.dir(creationResult)
    } catch (error) {
      setIsModalVerify(true)
      setModalStruct(error.message)
    }
  }, [user, changesDescription, users]);

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
        importUsers((isBeneficiary || isStudent) ? "ESTUDIANTE" : "FUNCIONARIO" , file)
        loadUsers()
      }
      return
    } catch (error) {
      console.error(error);
    }
    
  }

  const handlerSearchUser = async () => {
    console.dir(codeUser);
    try{
      const userFound = await searchUser(codeUser)
      const arrayUserFound = []
      arrayUserFound.push(userFound)
      setRows(arrayUserFound)
    }catch(error){
      setModalStruct(error.message)
      setIsModalVerify(true)
    }
  }
  //---------------------------------------------------------

  const handlerSendUserEdited = async () => {
    try {
      await editUser(objectSelected)
      loadUsers()
    } catch (error) {
      console.log(error);
    }
  }

  const handlerDeleteUser = async () => {
    if(!isBeneficiary) return
    try {
      await deleteBeneficiary(objectSelected.username)
      loadUsers()
    } catch (error) {
      console.log(error);
    }
  }
  const handlerDeleteUsers = async () => {
    if(!isBeneficiary) return
    try {
      await deleteBeneficiaries()
      loadUsers()
    } catch (error) {
      console.log(error);
    }
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
          <p>Descarga la plantilla <a href="#">aquí</a> y selecciona el archivo modificado</p>
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
          className={styles.buttonCancel}
          onClick={handlerCloseModalImport}>
            Cancelar
          </button>
          <button 
          className={styles.buttonSave}
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
          <SmallInput
            isRenderAsteric={false}
            name="name"
            title='Nombre'
            value={objectSelected.name}
            maxLength={60}
            minLength={3}
            onChange={e => handlerEditUser(e)}
            />
          <SmallInput
            title='Apellidos'
            name="lastName"
            value={objectSelected.lastName}
            maxLength={60}
            minLength={3}
            onChange={e => handlerEditUser(e)}
            />
        </Flex>

        <Flex gap={29} vertical={isMobile}>
          <SmallInput
            title={isFuncionary ? "Cédula" : "Código estudiantil"}
            name="username"
            value={objectSelected.username}
            onChange={e => handlerEditUser(e)}
            />
          <SmallInput
            isRenderAsteric={isFuncionary ? false:true}
            title={isFuncionary ? "Área dependiente":"Plan"}
            name="plan"
            value={objectSelected.plan}
            maxLength={60}
            minLength={3}
            onChange={e => handlerEditUser(e)}
            />
        </Flex>
          
        <Flex gap={29} vertical={isMobile}>
          <SmallInput 
            title='Correo electrónico'
            value={objectSelected.email}
            name="email"
            type="email"
            minLength={5}
            maxLength={80}
            onChange={e => handlerEditUser(e)}
            />
          <label className={`${otherStyles.labels}`}>
            {isStudent ? "Estado" 
            : isFuncionary ? "Rol" 
            : "Tipo de Beca"}
          <Select
            value={isStudent ? objectSelected.isActive : 
              isFuncionary ? objectSelected.roles[0].name : 
              objectSelected.lunchBeneficiary ? "Beneficiario almuerzo":"Beneficiario refrigerio"}
            className={styles.comboboxes}
            options={isStudent ? cbxStatus 
              : isFuncionary ? cbxFuncionary 
              : cbxBeneficiaries}
            onChange={value => {
              if(isStudent) handlerEditUser({target:{name:"isActive", value}})
              if(isBeneficiary) handlerEditUser({target:{name:"lunchBeneficiary", value}})
              if(isFuncionary) handlerRoleEditUser(value) 
            }}/>
          </label>
        </Flex>

        {isFuncionary && <Flex align='center' justify='flex-start'>
        <label className={`${otherStyles.labels}`}>
            Estado
          <Select
            placeholder="Selecciona"
            value={objectSelected.isActive}
            className={styles.comboboxes}
            options={cbxStatus}
            onChange={ value => handlerEditUser({target:{name:"isActive", value}})}
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
          className={styles.buttonSave}
          onClick={() => {
            handlerSendUserEdited()
            handlerCloseModalEdit()
          }}>
            Guardar
          </button>
          <button className={styles.buttonCancel} onClick={handlerCloseModalEdit}>Cancelar</button>
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
              className={styles.buttonCancel} 
              onClick={handlerCloseModalAllDelete}>
                No
              </button>
              <button 
              className={styles.buttonSave}
              onClick={() => {
                handlerDeleteUsers()
                handlerCloseModalAllDelete()
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
              className={styles.buttonCancel} 
              onClick={handlerCloseModalDelete}>
                No
              </button>
              <button 
              className={styles.buttonSave}
              onClick={() => {
                handlerDeleteUser()
                handlerCloseModalDelete()
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
            <span style={fontSizeTitleModal}>modalStruct.title</span>
            <p>{modalStruct.content}</p>
          </Flex>          
        </Modal>
      )}
        <MenuBecas 
          buttons={buttons}
          onSelect={type => handlerClick(type)}
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
              <SmallInput
                key={`name${changesDescription}`}
                title='Nombre'
                placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={40}
                minLength={3}
                name="name"
                onChange={e => handlerCreateUser(e)}
                required
                />
              <SmallInput
                title='Apellidos'
                key={`lastName${changesDescription}`}
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={40}
                minLength={3}
                name="lastName"
                onChange={e => handlerCreateUser(e)}
                required
                />
            </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput
              key={`username${changesDescription}`}
              title={isFuncionary ? "Cédula" : "Código estudiantil"}
              placeholder={isFuncionary ? "Cédula de la persona":"Código del estudiante"}
              type="number"
              min={100000000}
              max={9999999999}
              name="username"
              onChange={e => handlerCreateUser(e)}
              required
              />
            <SmallInput
              isRenderAsteric={isFuncionary ? false:true}
              key={`plan${changesDescription}`}
              title={isFuncionary ? "Área dependiente":"Plan"}
              placeholder={ isFuncionary ? "Área de la persona":'Plan del estudiante'}
              maxLength={40}
              minLength={3}
              name="plan"
              onChange={e => handlerCreateUser(e)}
              required
              />
          </Flex>
          
          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput
              key={`email${changesDescription}`}
              title='Correo electrónico'
              placeholder='Correo del estudiante'
              type="email"
              minLength={5}
              maxLength={80}
              name="email"
              onChange={e => {
                handlerCreateUser(e)
                const rolAdded  = user.roles.includes("ESTUDIANTE")
                if(((isStudent || isBeneficiary) && !rolAdded)){
                  handlerAddRoleUserCreate("ESTUDIANTE")
                }
              }}
              required
            />
          {(!isStudent || !enableResponsive) && 
            <label 
            className={`${otherStyles.labels} ${isStudent ? "visibility-hidden" :""}`}>
            {isFuncionary ? "Rol" : 
            <span>Tipo de beca <span className={otherStyles.asteric}>*</span></span>}          
            <Select
              placeholder="Selecciona"
              className={styles.comboboxes}
              key={`SelectImportant${changesDescription}`}
              name={isBeneficiary ? "grant" : ""}
              autoFocus={isFuncionary}
              defaultActiveFirstOption={isFuncionary}
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
              options={isFuncionary ? cbxFuncionary : cbxBeneficiaries}/>
            </label>}
          </Flex>
        </Flex>

        <Flex
        align='center'
        gap='small'
        justify='space-evenly'
        >
          <button className={styles.buttonSave} 
          onClick={() => {
            SetSavePressed(!savePressed)
            handlerVerifyUser()
            console.dir(user)
            console.dir(changesDescription)
          }}>Guardar</button>
          <button className={styles.buttonCancel}
          onClick={() => {setUser(initialUser)}}
          >Cancelar</button>
        </Flex>
        <Divider/>
        <Flex 
        wrap
        justify='center'
        gap={11}
        >
          <Search
            key={`findUser${changesDescription}`}
            placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantíl'}
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
            onClick = {loadUsers}
            />
          </Flex>
          <Flex align='center' justify='center' wrap>
            <TablePaginationUsers
              columns={headerTb}
              rows={rows}
              enableDelete={isBeneficiary ? true:false}
              enableEdit
              nameActionsButtons={isBeneficiary ? "Acciones":"Editar"}
              currentPage={1}
              itemsPerPage={10}
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