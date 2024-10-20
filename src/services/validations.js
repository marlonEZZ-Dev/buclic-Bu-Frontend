import dayjs from "dayjs"
const LIMITS_NAMES = 50
// PENSADOS PARA GESTIÓN DE USUARIOS
//This is by users
export const validName = name => name.length <= LIMITS_NAMES ? true : "Los nombres son muy largos"

export const validLastname = lastname => lastname.length <= LIMITS_NAMES ? true : "Los apellidos son muy largos"

export const validCode = (code, isCode) => {
  //Si es estudiante o beneficiario
  if(isCode){
    const c = Number.parseInt(code)
    const limitTop = (dayjs().year() * 10000) + 99999 // ej: año 2024 -> 202499999
    return (c >= 195000000) && (c <= limitTop) ? true : 
    `El código no es válido, debe tener 9
    dígitos. Ej: ${limitTop}`
  }
  //Si es funcionario
  return (code.length >= 8) && (code.length <= 10) ? true : 
  `La cédula ${code} no es una cédula válida
  esta debe contener entre 8  y 10 digitos`
}

export const validPlan = (plan, isPlan) => {
  if(isPlan){
    return /^\d{4}$/.test(plan) ? true : "Debe ingresar sólo 4 digitos" 
  }
  //Área dependiente es un string sin restricciones
  return true
}

export const validEmail = (email, funcionary) => {
  if(funcionary){
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? true : "Dirección de correo inválida"
  } 
  return /^[a-zA-Z]+\.[a-zA-Z]+@correounivalle.edu.co$/.test(email) ? true : "La dirección de correo electrónico no corresponde a ningún estudiante"
}

export const validRol = rol => rol.length !== 0 ? true : "Debe elegir un rol"

export const validGrant = grant => (grant === "Beneficiario almuerzo") 
|| (grant === "Beneficiario refrigerio") ? true : "Debe elegir un tipo de beca"
/********************************************************************************************************/

//Pensado para Registro de actividades enfermería
export const validFullName = name => name.length <= (LIMITS_NAMES * 2) ? true : "El nombre es demasiado largo"

export const validDate = date => {
  if( !(date.isValid()) ) return "El dato ingresado no es una fecha válida"

  const FORMAT = "YYYY-MM-DD"
  const now = dayjs().startOf("day")
  date = date.startOf("day")

  return date >= now ? true 
          : `La fecha ${date.format(FORMAT)} es anterior a la fecha de hoy ${now.format(FORMAT)}`  
}

export const validPhone = phone => {
  if(isNaN(phone)){
    return "Ingrese un número de celular válido"
  }

  const exampleNumber = 3130000000 + Math.round(Math.random() * 10000000)
  return phone.length === 10 ? true : `El número de celular debe contener 10 digitos Ej: ${exampleNumber}`
}

export const validSemester = semester => {
  if(isNaN(semester)){
    return "El dato ingresado no es un número"
  }
  
  return semester <= 11 ? true 
  :"Una carrera tecnológica dura de 6 a 7 semestres y una carrera profesional de 10 a 11 semestres" 
}

export const validListEmpty = (list, message) => list.length === 0 ? message : true