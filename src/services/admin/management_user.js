import axios from "../../api.js"

/*
En este archivo se encuentran las funciones que hacen peticiones al backend sobre 
usuarios y enfoncadas a la vista Gestión de usuarios o ManagementUser
*/

const getError = error => {
  if (error.response) {
    return { success: false, message: error.response.data.message || 'Error desconocido' };
  } else {
    // Error de red o de configuración
    return { success: false, message: error.message || 'Error de red' };
  }
}

//PETICIONES GET
export const listUsers = async (filter, page = 0, size = 10) => {
  try {
    const response = await axios.get(`/users/list?filter=${filter}&page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    return getError(error)
  }
}

export const searchUser = async (username) => {
  const url = `/users/search/${username}`
  console.log(url);
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return getError(error)
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
    return getError(error)
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
    } else {
      return { success: false, message: "Error al subir archivo" };
    }
  } catch (error) {
    return { success: false, message: getError(error).message };
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
      isActive: user.isActive,
      lunchBeneficiary: isLunch(),
      snackBeneficiary: !isLunch(),
      roles: user.roles
    })

    if(response.status === 200 || response.status === 201){
      return {success:true, message: "Usuario actualizado con éxito"}
    }else{
      return {success:false, message: "Error al enviar el usuario"}
    }
  } catch (error) {
    return {success:false, message: getError(error).message}
  }
}

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
    return {success:false, message: getError(error).message}
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
      success:false,
      message: getError(error).message
    }
  }
}
