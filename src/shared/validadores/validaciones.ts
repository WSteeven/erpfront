

//Validaciones de fechas

import { helpers } from "@vuelidate/validators"

/**
 * Función para comprobar si una fecha recibida es mayor a la fecha actual.
 * @param valor Variable fecha recibida en formato string
 * @returns true si la fecha recibida es mayor a la fecha actual, caso contrario, false
 */
export function fechaMayorActual(valor: string) {
    const arrayFechaLimite = valor.split('-') //devuelve array en formato [dia, mes, año]
    const fechaActual = new Date()
    const fechaRecibida = new Date(+arrayFechaLimite[2], +arrayFechaLimite[1] - 1, +arrayFechaLimite[0])
    // console.log('fecha actual <= fecha recibida ?', fechaActual <= fechaRecibida)
    return !helpers.req(valor)|| fechaActual <= fechaRecibida
  }
  export function validarIdentificacion(usuario: string) {
    const numero = usuario;
      let suma = 0;
      let residuo = 0;
      let pri = false;
      let pub = false;
      let nat = false;
      const numeroProvincias = 22;
      let modulo = 11;

      // tslint:disable-next-line: one-variable-per-declaration
      let p1=0, p2=0, p3=0, p4=0, p5=0, p6=0, p7=0, p8=0, p9=0;

      /* Verifico que el campo no contenga letras */
      let ok = 1;
      for (let i = 0; i < numero.length && ok === 1; i++) {
        // tslint:disable-next-line: radix
        const n = parseInt(numero.charAt(i));
        if (isNaN(n)) { ok = 0; }
      }
      if (ok === 0) {
        return false;
      }

      if (numero.length < 10) {
        return false;
      }

      /* Los primeros dos digitos corresponden al codigo de la provincia */
      const provincia: any = numero.substr(0, 2);
      if (provincia < 1 || provincia > numeroProvincias) {
        return false;
      }

      /* Aqui almacenamos los digitos de la cedula en variables. */
      const d1: any = numero.substr(0, 1);
      const d2: any = numero.substr(1, 1);
      const d3: any = numero.substr(2, 1);
      const d4: any = numero.substr(3, 1);
      const d5: any = numero.substr(4, 1);
      const d6: any = numero.substr(5, 1);
      const d7: any = numero.substr(6, 1);
      const d8: any = numero.substr(7, 1);
      const d9: any = numero.substr(8, 1);
      const d10: any = numero.substr(9, 1);

      /* El tercer digito es: */
      /* 9 para sociedades privadas y extranjeros   */
      /* 6 para sociedades publicas */
      /* menor que 6 (0,1,2,3,4,5) para personas naturales */

      if (d3 === 7 || d3 === 8) {
        return false;
      }

      /* Solo para personas naturales (modulo 10) */
      if (d3 < 6) {
        nat = true;
        p1 = d1 * 2; if (p1 >= 10) { p1 -= 9; }
        p2 = d2 * 1; if (p2 >= 10) { p2 -= 9; }
        p3 = d3 * 2; if (p3 >= 10) { p3 -= 9; }
        p4 = d4 * 1; if (p4 >= 10) { p4 -= 9; }
        p5 = d5 * 2; if (p5 >= 10) { p5 -= 9; }
        p6 = d6 * 1; if (p6 >= 10) { p6 -= 9; }
        p7 = d7 * 2; if (p7 >= 10) { p7 -= 9; }
        p8 = d8 * 1; if (p8 >= 10) { p8 -= 9; }
        p9 = d9 * 2; if (p9 >= 10) { p9 -= 9; }
        modulo = 10;
      } else if (d3 === 6) {
        pub = true;
        p1 = d1 * 3;
        p2 = d2 * 2;
        p3 = d3 * 7;
        p4 = d4 * 6;
        p5 = d5 * 5;
        p6 = d6 * 4;
        p7 = d7 * 3;
        p8 = d8 * 2;
        p9 = 0;
      } else if (d3 === 9) {
        pri = true;
        p1 = d1 * 4;
        p2 = d2 * 3;
        p3 = d3 * 2;
        p4 = d4 * 7;
        p5 = d5 * 6;
        p6 = d6 * 5;
        p7 = d7 * 4;
        p8 = d8 * 3;
        p9 = d9 * 2;
      }

      suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
      residuo = suma % modulo;

      /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
      const digitoVerificador = residuo === 0 ? 0 : modulo - residuo;

      /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
      if (pub === true) {
        if (digitoVerificador != d9) {
          return false;
        }
        /* El ruc de las empresas del sector publico terminan con 0001*/
        if (numero.substr(9, 4) != '0001') {
          return false;
        }
      } else if (pri === true) {
        if (digitoVerificador != d10) {
          return false;
        }
        if (numero.substr(10, 3) != '001') {
          return false;
        }
      } else if (nat === true) {
        if (digitoVerificador != d10) {
          return false;
        }
        if (numero.length > 10 && numero.substr(10, 3) != '001') {
          return false;
        }
      }
      return true;
  }
