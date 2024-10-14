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

const convertToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
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
  const url = `/users/search?username=${username}`
  console.log(url);
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return getError(error)
  }
}

//PETICIONES POST
export const createUser = async (obj) => {
  try{
    const response = await axios.post("/users", {
      username: obj.username, //codigo
      name: obj.name,
      lastName: obj.lastName,
      email: obj.email,
      password: "",
      plan: obj.plan,
      beca: obj.grant,
      roles: obj.roles //tipo de usuario
    });
    if(response.status === 201) return "Usuario creado exitosamente" 
    
  }catch(error){
    return getError(error)
  };
}

export const importUsers = async (role, fileCSV) => {
  console.dir(fileCSV)
  console.log(fileCSV instanceof File);
  try {
    // const base64File = await convertToBase64(fileCSV)
    // const payload = {
    //   file: base64File
    // }
    const formData = new FormData()
    formData.append("file",fileCSV)
    // formData.append("role",role)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Imprime el nombre del campo y su valor
    }
    const response = await axios.post(`/users/import?role=${role}`, formData)
    console.dir(formData);
    console.dir(response)
    if (response.status === 200) {
      return { success: true, message: "Archivo subido con éxito" };
    } else {
      return { success: false, message: "Error al subir archivo" };
    }
  } catch (error) {
    return { success: false, message: getError(error).message };
  }
} 

//PETICIONES PUT
export const editUsers = () => {}
export const deleteBeneficiaries = () => {}
export const deleteBeneficiary = () => {}