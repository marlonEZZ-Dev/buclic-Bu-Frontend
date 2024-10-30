import axios from "../../api.js"

/*
En este archivo se encuentran las funciones que hacen peticiones al backend sobre 
usuarios y enfoncadas a la vista Gestión de usuarios o ManagementUser
*/
const errorForGet = new Map([
  [400, "Solicitud inválida"],
  [401, "No estas autorizado"],
  [403, "No tienes los permisos para solicitar este recurso"],
  [404, "Usuario no encontrado"],
  [500, "Error interno del servidor"]
])

const errorForPost = new Map([
  [400, "Datos inválidos en la solicitud"],
  [401, "No autorizado para crear usuarios"],
  [403, "No tienes permisos para crear usuarios"],
  [409, "El usuario ya existe"],
  [413, "Archivo demasiado grande"],
  [415, "Tipo de contenido no soportado"],
  [500, "Error interno del servidor"]
])

const errorForPut = new Map([
  [400, "Datos inválidos para la actualización"],
  [401, "No autorizado para actualizar"],
  [403, "No tienes permisos para actualizar"],
  [404, "Usuario a actualizar no encontrado"],
  [409, "Conflicto con el estado actual del usuario"],
  [500, "Error interno del servidor"]
])

const errorForDelete = new Map([
  [401, "No autorizado para eliminar"],
  [403, "No tienes permisos para eliminar"],
  [404, "Usuario a eliminar no encontrado"],
  [409, "No se puede eliminar debido a dependencias"],
  [500, "Error interno del servidor"]
])

//PETICIONES GET
export const listUsers = async (filter, page, size = 10) => {
  try {
    const response = await axios.get(`/users/list?filter=${filter}&page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      message:errorForGet.get(error.response.status)
    }
  }
}

export const searchUser = async (username) => {
  const url = `/users/search/${username}`
  console.log(url);
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: errorForGet.get(error.response.status)
    }
  }
}

//PETICIONES POST
export const createUser = async (user) => {
  try{
    const response = await axios.post("/users", {
      username: user.username, //codigo
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: "",
      plan: user.plan,
      beca: user.grant,
      roles: user.roles //tipo de usuario
    });
    if(response.status === 201) return "Usuario creado exitosamente" 
    
  }catch(error){
    return {
      success: false,
      message: errorForPost.get(error.response.status)
    }
  };
}

export const importUsers = async (role, fileCSV) => {
  try {
    const formData = new FormData()
    formData.append("file",fileCSV)
    const response = await axios.post(`/users/import?role=${role}`, formData,
      {headers:{
        'Content-Type': 'multipart/form-data'
      }}
    )
    if (response.status === 201) {
      return { success: true, message: "Archivo subido con éxito" };
    }
  } catch (error) {
    return {
      success: false,
      message: errorForPost.get(error.response.status)
    }
  }
} 

//PETICIONES PUT
export const editUser = async (user) => {
  const isLunch = () => user.lunchBeneficiary === "Beneficiaro almuerzo"
  try {
    const response = await axios.put("/users/edit",{
      id:user.id,
      username:user.username,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      plan: user.plan,
      eps: user.eps,
      semester: user.semester,
      phone: user.phone,
      isActive: user.isActive,
      lunchBeneficiary: isLunch(),
      snackBeneficiary: !isLunch(),
      roles: user.roles
    })

    if(response.status === 200 || response.status === 201){
      return {success:true, message: "Información actualizada"}
    }

  } catch (error) {
    return {
      success: false, 
      message: errorForPut.get(error.response.status),
      errorGet : error
    }
  }
}

//PETICIONES DELETE
export const deleteBeneficiary = async (username) => {
  try {
    const response = axios.put(`/users/delete/${username}`)

    if(response.status === 200){
      return {
        success:true,
        message:`usuario con código ${username} fue eliminado exitosamente`
      }
    }
  } catch (error) {
    return {
      success: false, 
      message: errorForDelete.get(error.response.status)
    }
  }
}

export const deleteBeneficiaries = async () => {
  try {
    const response = axios.put("/users/delete")
    if(response.status){
      return {
        success: true, 
        message: "Todos los usuarios eliminados"
      }
    }
  } catch (error) {
    return {
      success: false, 
      message: errorForDelete.get(error.response.status)
    }
  }
}
