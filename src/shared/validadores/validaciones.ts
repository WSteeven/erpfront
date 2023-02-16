

//Validaciones de fechas

import { helpers } from '@vuelidate/validators'

/**
 * Función para comprobar si una fecha recibida es mayor a la fecha actual.
 * @param valor Variable fecha recibida en formato string
 * @returns true si la fecha recibida es mayor a la fecha actual, caso contrario, false
 */
export function fechaMayorActual(valor: string) {
  if(valor===null){
    return true
  }else{
    const arrayFechaLimite = valor.split('-') //devuelve array en formato [dia, mes, año]
    const fechaActual = new Date()
    const fechaRecibida = new Date(+arrayFechaLimite[2], +arrayFechaLimite[1] - 1, +arrayFechaLimite[0])
    // console.log('fecha actual <= fecha recibida ?', fechaActual <= fechaRecibida)
    return !helpers.req(valor) || fechaActual <= fechaRecibida
  }
}