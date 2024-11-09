import axios from "../../api.js"

export const appointmentsProfessionals = async (id) => {  
  try {
    const response = await axios.get(`/appointment-reservation/professional/${id}`)
    console.log(response.data)
  } catch (error) {
    return error
  }
}
