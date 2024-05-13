import axios, { AxiosError, AxiosResponse, Method, ResponseType } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { apiConfig, endpoints } from 'config/api'
import { date } from 'quasar'
import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { EntidadAuditable } from './entidad/domain/entidadAuditable'
import { ApiError } from './error/domain/ApiError'
import { AxiosHttpRepository } from './http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from './notificaciones'
import { ServiceWorkerClass } from './notificacionesServiceWorker/ServiceWorkerClass'
import { ItemProforma } from 'pages/comprasProveedores/proforma/domain/ItemProforma'
import { useAuthenticationStore } from 'stores/authentication'
import { rolesSistema } from 'config/utils'

const authenticationStore = useAuthenticationStore()
const usuario = authenticationStore.user

export function limpiarListado<T>(listado: T[]): void {
  listado.splice(0, listado.length)
}

export function reemplazarListado<T>(listado: T[], elementos: T[]): void {
  listado.splice(0, listado.length, ...elementos)
}

export function compararObjetos(
  data_inicial?: EntidadAuditable,
  data_final?: EntidadAuditable
): boolean {
  return JSON.stringify(data_inicial) !== JSON.stringify(data_final)
}

export function validarKeyBuscar(keyCode?: number): boolean {
  return keyCode === 9 || keyCode === 13
}

export function validarEmail(email?: string): boolean {
  const validador =
    /^(([^<>()\[\]\\.,:\s@']+(\.[^<>()\[\]\\.,:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return validador.test(String(email).toLowerCase())
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function descargarArchivo(
  data: any,
  titulo: string,
  formato: string
): void {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(
    new Blob([data], { type: `application/${formato}` })
  )
  link.setAttribute('download', `${titulo}.${formato}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function descargarArchivoUrl(url: string): void {
  const link = document.createElement('a')
  link.href = apiConfig.URL_BASE + url
  link.target = '_blank'
  link.click()
  link.remove()
}

export function agregarCerosIzquierda(
  num: string | number,
  size: number
): string {
  const parse = typeof num === 'string' ? parseInt(num === '' ? '1' : num) : num
  return (Math.pow(10, size) + parse).toString().substring(1)
}

/* imprimirArchivo(data: any, formato: PrintTypes) {
    const objectUrl = URL.createObjectURL(
      new Blob([data], {type: `application/${formato}`})
    )
    PrintJS({
      printable: objectUrl,
      type: formato
    })
  } */

export function clonar(data: EntidadAuditable): any {
  return JSON.parse(JSON.stringify(data))
}

export function crearIconoHtml(icon: string): any {
  const iconHTML = document.createElement('i')
  iconHTML.classList.add('bi', icon)
  return iconHTML
}

export function quitarComasNumero(num: string): string {
  let formateo = '0'
  if (num !== undefined) {
    num = `${num}`
    formateo = num.toString()
    formateo = formateo.replace(/,/gi, '')
  }
  return formateo
}

export function convertirDecimalFloat(num: string): number {
  return typeof num === 'undefined' ||
    num === null ||
    num === '' ||
    num === '.' ||
    num.toString() === 'NaN'
    ? 0
    : parseFloat(quitarComasNumero(num))
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function redondear(numero: any, decimales = 6): number {
  numero = numero ? numero : 0
  numero = convertirDecimalFloat(numero)
  return +`${Math.round(parseFloat(`${numero}e+${decimales}`))}e-${decimales}`
}

/**
 *
 * @param entidad: Instancia de entidad
 * @param atributos: Array de atributos que se desean redondear
 * @param decimales: Cantidad de decimales
 */
export function redondearAtributos<R = Record<string, number>>(
  entidad: R,
  atributos: (keyof R)[],
  decimales: number
): void {
  for (const atributo of atributos) {
    entidad[atributo] = redondear(entidad[atributo], decimales) as any
  }
}

export function formatoNumeroTexto(
  amount: number,
  decimalCount: number
): string {
  return amount
    .toFixed(decimalCount)
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

export function resaltarCampoNoValido(errors: string[]): boolean | null {
  return errors.length > 0 ? false : null
}

export function mensajeCampoNoValido(errors: string[]): string {
  return errors[0]
}

export function obtenerStringCerosUno(cantidadCeros: number): string {
  return (Math.pow(10, cantidadCeros) + 1).toString().substring(1)
}

export function generarFilters<T>(
  listaIDs: number[],
  campoFiltrado: keyof T
): string | null {
  let res = ''
  listaIDs.forEach((id: number, index: number) => {
    res += `${index > 0 ? '|' : ''}(${campoFiltrado.toString()}=${id})`
  })
  if (listaIDs.length === 0) return null
  return res
}

export function partirNumeroDocumento(numeroDocumento: string): string[] {
  return numeroDocumento.split('-')
}

export function construirNumeroDocumento(
  establecimiento: string,
  punto_emision: string,
  secuencial: string
): string {
  return `${establecimiento}-${punto_emision}-${secuencial}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

export function isAxiosError(candidate: any): candidate is ApiError {
  return candidate instanceof ApiError === true
}

export async function notificarMensajesError(
  mensajes: string[],
  notificaciones: any
): Promise<void> {
  for (let i = 0; i < mensajes.length; i++) {
    notificaciones.notificarAdvertencia(mensajes[i])
  }
}

// DEPURAR ESTE CODIGO (NO SE USA EN NINGUNA PARTE)
// export function gestionarNotificacionError(
//   error: any,
//   notificaciones: any
// ): void {
//   if (isAxiosError(error)) {
//     const mensajes: string[] = error.erroresValidacion
//     if (mensajes.length > 0) {
//       notificarMensajesError(mensajes, notificaciones)
//     } else {
//       if (error.status === 413) {
//         notificaciones.notificarAdvertencia(
//           'El tamaño del archivo es demasiado grande.'
//         )
//       } else {
//         notificaciones.notificarAdvertencia(error.mensaje)
//       }
//     }
//   } else {
//     notificaciones.notificarAdvertencia(error.message)
//   }
// }

export function wrap(el: HTMLElement, wrapper: HTMLElement) {
  el.parentNode?.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

export function resetInput(input: HTMLElement) {
  const form = document.createElement('form')
  wrap(input, form)
  form.reset()
}

export function getVisibleColumns<T>(
  configuracionColumnas: ColumnConfig<T>[]
): string[] {
  const columnas: string[] = []
  for (const columna of configuracionColumnas) {
    if (!columna.hasOwnProperty('visible') || columna.visible)
      columnas.push(columna.field.toString())
  }

  return columnas
}

// 20-04-2022
export function obtenerFechaActual(formato = 'DD-MM-YYYY') {
  const timeStamp = Date.now()
  const formattedString = date.formatDate(timeStamp, formato)
  return formattedString
}

/**
 * Funcion para remover tildes o acentos de una cadena
 * @param accents cadena que se va a limpiar
 * @returns cadena sin acentos ni tildes
 */
export function removeAccents(accents: string) {
  return accents.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export async function obtenerTiempoActual() {
  const axios = AxiosHttpRepository.getInstance()

  try {
    const fecha: AxiosResponse = await axios.get(
      axios.getEndpoint(endpoints.fecha)
    )
    const hora: AxiosResponse = await axios.get(
      axios.getEndpoint(endpoints.hora)
    )

    return {
      fecha: fecha.data,
      hora: hora.data,
      fecha_hora: fecha.data + ' ' + hora.data,
    }
  } catch (e: any) {
    throw new ApiError(e)
  }
}

// Lunes, 16 Enero 2023
export function obtenerFechaActualTexto() {
  return date.formatDate(Date.now(), 'dddd, DD MMMM YYYY')
}

// 20-04-2022 12:30:00
export function obtenerFechaHoraActual() {
  return date.formatDate(Date.now(), 'DD-MM-YYYY HH:mm:ss')
}

export function obtenerMensajesError() {
  //
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function stringToArray(listado: string) {
  const array = listado.split(',')
  return array.map((item) => item.trim())
}

export function quitarItemDeArray(listado: any[], elemento: string) {
  return listado.filter((item) => item !== elemento)
}
export function pushEventMesaggeServiceWorker(data: ServiceWorkerClass) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.active!.postMessage({
        action: 'notificacionPush',
        titulo: data.titulo,
        mensaje: data.mensaje,
        icono: data.icono,
        link: data.link,
        badge: data.badge,
      })
    })
  }
}

/**
 * Metodo generico para descargar archivos desde una API
 * @param ruta URL desde donde se descargará el archivo
 * @param metodo metodo http de la consulta, generalmente GET
 * @param responseType tipo de respuesta esperada, de la clase axios.ResponseType
 * @param formato tipo de archivo esperado
 * @param titulo  nombre del archivo para descargar
 * @param data  lo que se envia en el post
 *
 * @returns mensaje que indica que no se puede imprimir el archivo
 */
export async function imprimirArchivo(
  ruta: string,
  metodo: Method,
  responseType: ResponseType,
  formato: string,
  titulo: string,
  data?: any
) {
  const statusLoading = new StatusEssentialLoading()
  const { notificarAdvertencia, notificarError } = useNotificaciones()
  statusLoading.activar()
  const axiosHttpRepository = AxiosHttpRepository.getInstance()
  axios({
    url: ruta,
    method: metodo,
    data: data,
    responseType: responseType,
    headers: {
      Authorization: axiosHttpRepository.getOptions().headers.Authorization,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        if (
          response.data.size < 100 ||
          response.data.type == 'application/json'
        )
          throw 'No se obtuvieron resultados para generar el reporte'
        else {
          const fileURL = URL.createObjectURL(
            new Blob([response.data], { type: `appication/${formato}` })
          )
          const link = document.createElement('a')
          link.href = fileURL
          link.target = '_blank'
          link.setAttribute('download', `${titulo}.${formato}`)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
        // } else if (response.status === 500) {
        //   console.log(response)
      } else {
        notificarError('Se produjo un error inesperado')
      }
    })
    .catch(async (error) => {
      notificarError(error)
    })
    .finally(() => statusLoading.desactivar())
}

export function filtrarLista(val, update, lista, clave, defaultValue = []) {
  if (val === '') {
    update(() => (lista.value = defaultValue))
  } else {
    update(() => {
      const needle = val.toLowerCase()
      lista.value = defaultValue.filter(
        (v: any) => v[clave].toLowerCase().indexOf(needle) > -1
      )
    })
  }
}

/**
 * La función `ordenarLista` ordena una lista determinada según una clave específica.
 * Esta función sirve para ordenar cualquier lista que se muestra en un select.
 * En el metodo popup-show debe envíar como argumentos la lista y la clave por la cual quiere ordenar los registros.
 * @param lista - El parámetro "lista" es una matriz de objetos que desea ordenar.
 * @param {string} clave - El parámetro "clave" es una cadena que representa la clave o propiedad de
 * los objetos en la matriz "lista" que se utilizará para ordenar.
 */
export function ordenarLista(lista, clave: string) {
  lista.sort((a, b) => ordernarListaString(a[clave], b[clave]))
}

/**
 *  Función de comparación para ordenar dos strings, se debe usar de la siguiente manera:
 * (a,b)=>ordenarListaString(a.propiedad, b.propiedad)
 * @param a primer string
 * @param b segundo string
 * @returns el valor de ordenación segun sea menor, mayor o igual la comparación dada
 */
export function ordernarListaString(a: string, b: string) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export function obtenerUbicacion(onUbicacionConcedida) {
  const onErrorDeUbicacion = (err) => {
    console.log('Error obteniendo ubicación: ', err)
  }

  const opcionesDeSolicitud = {
    enableHighAccuracy: true, // Alta precisión
    maximumAge: 0, // No queremos caché
    timeout: 5000, // Esperar solo 5 segundos
  }

  navigator.geolocation.getCurrentPosition(
    onUbicacionConcedida,
    onErrorDeUbicacion,
    opcionesDeSolicitud
  )
}

export function extraerRol(roles: string[], rolConsultar: string) {
  return roles.some((rol: string) => rol === rolConsultar)
}

/**
 * La función "extraerPermiso" comprueba si existe un permiso dado en una lista de permisos.
 * @param {string[]} permisos - Una matriz de cadenas que representan los permisos.
 * @param {string} permisoConsultar - El parámetro `permisoConsultar` es una cadena que representa el
 * permiso a consultar. Debe ser en base a la estructura de establecida para nombres de permisos (Ej. 'puede.ver.accion')
 * @returns un valor booleano.
 */
export function extraerPermiso(permisos: string[], permisoConsultar: string) {
  return permisos.some((permiso: string) => permiso === permisoConsultar)
}

export function formatearFecha(fecha: string) {
  const arrayFecha = fecha.split('-').map(Number) // YYYY-MM-DD
  const nuevaFecha = date.buildDate({
    year: arrayFecha[2],
    month: arrayFecha[1],
    day: arrayFecha[0],
  })

  return date.formatDate(nuevaFecha, 'YYYY-MM-DD')
}

export function formatearFechaHora(fecha: string, hora: string) {
  const arrayFecha = fecha.split('-').map(Number) // YYYY-MM-DD
  const nuevaFecha = date.buildDate({
    year: arrayFecha[2],
    month: arrayFecha[1],
    day: arrayFecha[0],
  })

  return date.formatDate(nuevaFecha, 'YYYY-MM-DD') + ' ' + hora
}

// recibe fecha dd-mm-yyyy y sale yyyy-mm-dd con el nuevo separador
export function formatearFechaSeparador(
  fecha: string,
  separador: string,
  sumarTiempo?: any
) {
  const arrayFecha = fecha.split('-').map(Number) // YYYY-MM-DD
  let nuevaFecha = date.buildDate({
    year: arrayFecha[2],
    month: arrayFecha[1],
    day: arrayFecha[0],
  })

  if (sumarTiempo) nuevaFecha = date.addToDate(nuevaFecha, sumarTiempo)

  return date.formatDate(
    nuevaFecha,
    'YYYY' + separador + 'MM' + separador + 'DD'
  )
}

export function formatearFechaTexto(fecha: number) {
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(fecha).toLocaleDateString('es-Es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generarColorHexadecimalAleatorio() {
  const r = Math.floor(Math.random() * 128 + 128) // Componente rojo entre 128 y 255
  const g = Math.floor(Math.random() * 128 + 128) // Componente verde entre 128 y 255
  const b = Math.floor(Math.random() * 128 + 128) // Componente azul entre 128 y 255

  const colorHexadecimal =
    '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)

  return colorHexadecimal
}

function componentToHex(component) {
  const hex = component.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function generarColorPastelAzulAleatorio() {
  const r = Math.floor(Math.random() * 128) // Componente rojo entre 0 y 127
  const g = Math.floor(Math.random() * 128 + 128) // Componente verde entre 0 y 127
  const b = Math.floor(Math.random() * 128) // Componente azul entre 128 y 255

  const colorHexadecimal =
    '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)

  return colorHexadecimal
}

// --
export function generarColorAzulPastelClaro() {
  // Generar valores RGB altos (entre 150 y 220) para obtener un tono azul claro
  const r = Math.floor(Math.random() * 70) + 150
  const g = Math.floor(Math.random() * 70) + 150
  const b = Math.floor(Math.random() * 100) + 155 // Para asegurarse de que el tono sea azul claro

  // Ajustar el brillo para hacerlo más claro (entre 0.7 y 1.0)
  const brillo = Math.random() * 0.3 + 0.7

  // Convertir a formato hexadecimal
  const colorHex =
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  // Aplicar el brillo al color hexadecimal
  const colorClaroHex = ajustarBrillo(colorHex, brillo)

  return colorClaroHex
}

function ajustarBrillo(colorHex, brillo) {
  const r = parseInt(colorHex.substr(1, 2), 16)
  const g = parseInt(colorHex.substr(3, 2), 16)
  const b = parseInt(colorHex.substr(5, 2), 16)

  const rNuevo = Math.round(r * brillo)
  const gNuevo = Math.round(g * brillo)
  const bNuevo = Math.round(b * brillo)

  const colorOscuroHex = `#${((rNuevo << 16) | (gNuevo << 8) | bNuevo)
    .toString(16)
    .padStart(6, '0')}`
  return colorOscuroHex
}

/**
 * La función verifica si una matriz tiene elementos repetidos.
 * @param array - El parámetro `array` es una matriz de elementos.
 * @returns un valor booleano. Devuelve verdadero si la matriz de entrada tiene elementos repetidos y
 * falso si todos los elementos de la matriz son únicos.
 */
export function tieneElementosRepetidos(array) {
  const set = new Set(array)
  return set.size !== array.length
}

/**
 * La función comprueba si una matriz de objetos contiene objetos duplicados.
 * @param arrayDeObjetos - El parámetro `arrayDeObjetos` es una matriz de objetos.
 * @returns un valor booleano. Devuelve verdadero si hay objetos repetidos en la matriz y falso si no
 * hay objetos repetidos.
 */
export function tieneElementosRepetidosObjeto(arrayDeObjetos) {
  const objetoSet = new Set()
  for (const objeto of arrayDeObjetos) {
    const objetoString = JSON.stringify(objeto)
    if (objetoSet.has(objetoString)) {
      return true
    } else {
      objetoSet.add(objetoString)
    }
  }
  return false
}

/**
 * La función calcula el monto del descuento en función del subtotal y el porcentaje de descuento
 * proporcionado.
 * @param {number} subtotal - El subtotal es el monto total antes de aplicar cualquier descuento. Es un
 * valor numérico.
 * @param {number} porcentaje_descuento - El parámetro "porcentaje_descuento" representa el porcentaje
 * de descuento que se aplicará al subtotal.
 * @param {number} decimales - El parámetro "decimales" es el número de decimales al que se redondeará
 * el resultado.
 * @returns el importe del descuento calculado como una cadena con el número especificado de decimales.
 */
export function calcularDescuento(
  subtotal: number,
  porcentaje_descuento: number,
  decimales: number
) {
  return ((subtotal * porcentaje_descuento) / 100).toFixed(decimales)
}

/**
 * La función calcula el monto del IVA (Impuesto al Valor Agregado) en función del subtotal, descuento,
 * porcentaje de IVA y número de decimales.
 * @param {number} subtotal - El subtotal es el monto total antes de que se apliquen descuentos o
 * impuestos. Representa el monto base sobre el cual se realizarán los cálculos.
 * @param {number} descuento - El parámetro "descuento" representa el monto del descuento aplicado al
 * subtotal antes de calcular el impuesto.
 * @param {number} porcentaje_iva - El parámetro "porcentaje_iva" representa el valor porcentual del
 * IVA (Impuesto al Valor Agregado) a aplicar al subtotal luego de restar el descuento.
 * @param {number} decimales - El parámetro "decimales" es el número de decimales al que se redondeará
 * el resultado.
 * @returns el valor calculado del IVA (Impuesto al Valor Agregado) en base a los parámetros dados.
 */
export function calcularIva(
  subtotal: number,
  descuento: number,
  porcentaje_iva: number,
  decimales: number
) {
  return (((subtotal - descuento) * porcentaje_iva) / 100).toFixed(decimales)
}

export function calcularSubtotalSinImpuestosLista(val: ItemProforma) {
  let suma = 0
  suma += val.grava_iva ? 0 : Number(val.subtotal) || 0
  suma -= val.grava_iva ? 0 : Number(val.descuento) || 0
  return suma
}
export function calcularSubtotalConImpuestosLista(val: ItemProforma) {
  let suma = 0
  suma += val.facturable && val.grava_iva ? Number(val.subtotal) || 0 : 0
  suma -= val.facturable && val.grava_iva ? Number(val.descuento) || 0 : 0
  return suma
}

/**
 * La función "encontrarUltimoIdListado" toma una lista de objetos y devuelve el id del objeto con el
 * valor de id más alto.
 * @param {any} listado - El parámetro "listado" es una matriz de objetos. Cada objeto de la matriz
 * tiene una propiedad llamada "id" que representa el identificador único del objeto.
 * @returns el último valor de identificación de la matriz de listado dada.
 */
export function encontrarUltimoIdListado(listado: any) {
  const objMayorId = listado.reduce(
    (max, objeto) => (objeto.id > max.id ? objeto : max),
    listado[0]
  )

  return objMayorId.id
}

export function convertirNumeroPositivo(entidad, campo) {
  if (entidad[campo]) {
    if (entidad[campo] < 0) {
      entidad[campo] = -1 * entidad[campo]
    }
  }
}

/**
 * La función filtra a los empleados según sus roles.
 * @param empleados - Una lista de empleados consultados en la base de datos. Cada objeto de empleado debe tener una
 * propiedad llamada "roles", que es una cadena que representa todos los roles del empleado.
 * @param roles - Una variedad de roles para filtrar a los empleados.Los roles
 * deben estar separados por comas y espacios (por ejemplo, ["rol1, rol2, rol3"]).
 * @return una lista de empleados que tienen al menos uno de los roles especificados en el parámetro
 * "roles".
 */
export function filtrarEmpleadosPorRoles(empleados, roles) {
  const filtrados = empleados.filter((empleado) => {
    const rolesEmpleado = empleado.roles.split(', ')
    return roles.some((rol) => rolesEmpleado.includes(rol))
  })
  return filtrados
}
export function filtarVisualizacionEmpleadosSaldos(empleados) {
  if (authenticationStore.can('puede.buscar.tecnicos')) {
    const filtrados_busqueda =
      authenticationStore.esContabilidad ||
      authenticationStore.esCoordinador ||
      authenticationStore.esAdministrador
        ? empleados
        : empleados.filter((empleado) => empleado.departamento === rolesSistema.tecnico && extraerRol(empleado.roles.split(', '), rolesSistema.tecnico)&& !extraerRol(empleado.roles.split(', '), rolesSistema.coordinador))
    return filtrados_busqueda
  }

  const filtrados =
    authenticationStore.esContabilidad ||
    authenticationStore.esCoordinador ||
    authenticationStore.esAdministrador
      ? empleados
      : empleados.filter((empleado) => empleado.jefe_id === usuario.id)

  return filtrados
}
export function filtarJefeImediato(empleados) {
  return empleados.filter((empleado) => empleado.id === usuario.jefe_id)[0]
}


export async function notificarErrores(err) {
  const axiosError = err as AxiosError
  const error = new ApiError(axiosError)
  if (isAxiosError(error)) {
    const mensajes: string[] = error.erroresValidacion
    await notificarMensajesError(mensajes, useNotificaciones())
  } else {
    console.log(axiosError)
  }
}
