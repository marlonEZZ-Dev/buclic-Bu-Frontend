import axios from "../api.js"

const getError = error => {
  if (error.response) {
    return { success: false, message: error.response.data.message || 'Error desconocido' };
  } else {
    // Error de red o de configuración
    return { success: false, message: error.message || 'Error de red' };
  }
}

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
    roles: obj.rols //tipo de usuario
    });
    if(response.status === 201) return "Usuario creado exitosamente" 
    
  }catch(error){
    return getError(error)
  };
}

export const listUsers = async (filter, page = 0, size = 10) => {
  const url = `/users/list?filter=${filter}&page=${page}&size=${size}`
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return getError(error)
  }
}

export const searchUser = () => {}

export const editUsers = () => {}
export const deleteBeneficiaries = () => {}
export const deleteBeneficiary = () => {}