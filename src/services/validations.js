import dayjs from "dayjs"

//This is by users
export const validCode = (code, isCode) => {
  if(isCode){
    const c = Number.parseInt(code)
    const limitTop = (dayjs().year() * 10000) + 99999 // ej: año 2024 -> 202499999
    return (c >= 195000000) && (c <= limitTop) ? true : 
    `El código ${code} no es un código de estudiante válido
    este debe tener en su inicio el año con 4 digitos además
    de otros 5 digitos cualesquiera`
  }
  return (code.length >= 8) && (code.length <= 10) ? true : 
  `La cédula ${code} no es una cédula válida
  esta debe contener entre 8  y 10 digitos`
}

export const validText = text => text.length !== 0 ? true: `No deben quedar campos`

export const validRol = rol => rol.length !== 0 ? true : "Debe declarar un valor para el array"

export const validSelects = (arrString, valueValid, title) => {
  const newArr = arrString.filter( item => item.value === valueValid)
  return newArr.length === 0 ? "Debe establecer una opción en " + title : true
}