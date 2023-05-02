

//Validaciones de fechas

import { helpers } from '@vuelidate/validators'

/**
 * Función para comprobar si una fecha recibida es mayor a la fecha actual.
 * @param valor Variable fecha recibida en formato string
 * @returns true si la fecha recibida es mayor a la fecha actual, caso contrario, false
 */
export function fechaMayorActual(valor: string) {
  if (valor === null) {
    return true
  } else {
    const arrayFechaLimite = valor.split('-') //devuelve array en formato [dia, mes, año]
    const fechaActual = new Date()
    const fechaRecibida = new Date(+arrayFechaLimite[2], +arrayFechaLimite[1] - 1, +arrayFechaLimite[0])
    // console.log('fecha actual <= fecha recibida ?', fechaActual <= fechaRecibida)
    return !helpers.req(valor) || fechaActual <= fechaRecibida
  }
}

export function valida2rCedula(cedula: string): boolean {
  if (cedula.length !== 10 || isNaN(Number(cedula))) {
    return false;
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  const total_caracteres = cedula.length - 1;
  const digito_verificador = Number(cedula.charAt(total_caracteres));

  for (let i = 0; i < total_caracteres; i++) {
    const valor = Number(cedula.charAt(i));
    let resultado = valor * coeficientes[i];

    if (resultado > 9) {
      resultado = resultado - 9;
    }

    suma += resultado;
  }

  const total = suma + digito_verificador;

  if (total % 10 == 0 && digito_verificador == 0) {
    return true;
  } else if (10 - (total % 10) == digito_verificador) {
    return true;
  } else {
    return false;
  }
}

export function validarCedula(cedula: string): boolean {
  console.log('vali')
  let total = 0;
  const longitud = cedula.length;
  const longcheck = longitud - 1;

  if (!!cedula && longitud === 10) {
    console.log('dentro de if')
    for (let i = 0; i < longcheck; i++) {
      if (i % 2 === 0) {
        let aux = parseInt(cedula.charAt(i)) * 2;
        if (aux > 9) aux -= 9;
        total += aux;
      } else {
        total += parseInt(cedula.charAt(i));
      }
    }

    total = total % 10 ? 10 - total % 10 : 0;

    if (parseInt(cedula.charAt(longitud - 1)) == total) {
      console.log('true')
      return !helpers.req(cedula) || true
    } else {
      console.log('false')
      return !helpers.req(cedula) || false
    }
  }
  console.log('false')
  return !helpers.req(cedula) || false
}

