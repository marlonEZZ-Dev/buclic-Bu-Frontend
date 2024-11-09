import axios from "../../api.js"

export const appointmentsProfessionals = async (id) => {  
  try {
    const response = await axios.get(`/appointment-reservation/professional/pending/${id}`)
    console.log("Datos"+response.data)
  } catch (error) {
    return error
  }
}
