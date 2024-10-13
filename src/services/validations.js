//This is by users
export const validCode = (code, isCode) => {
  if(isCode){
    const c = Number.parseInt(code)
    return (c >= 195000000) && (c <= 210000000) ? true : "No es un código de estudiante válido" //entre 1950 y 2100
  }
  return (code.length >= 8) && (code.length <= 10) ? true : "No es una cédula válida"
}

export const validText = text => text.length === 0

export const validRol = rol => rol.length !== 0 ? true : "Debe declarar un valor para el array"