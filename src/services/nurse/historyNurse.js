import dayjs from "dayjs";
import axios from "../../api.js";

export const searchBy = async ({name="", startDate = "", endDate = ""}) => {
  const baseUrl = "/nursing-activities"
  let queryParams = [];

  if (name) {
    queryParams.push(`username=${name}`)
  }

  if (startDate && endDate) {
    const fStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const fEndDate = dayjs(endDate).format('YYYY-MM-DD')
    queryParams.push(`startDate=${fStartDate}`)
    queryParams.push(`endDate=${fEndDate}`)
  }

  const finalUrl = queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl
  
  console.log(finalUrl)
  
  try {
    const response = await axios.get(finalUrl)
    return response.data
  } catch (error) {
    return error
  }
}