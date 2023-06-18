import { AxiosError } from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosResponse, Method, ResponseType } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { apiConfig, endpoints } from 'config/api'
import { date, useQuasar } from 'quasar'
import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { EntidadAuditable } from './entidad/domain/entidadAuditable'
import { ApiError } from './error/domain/ApiError'
import { HttpResponseGet } from './http/domain/HttpResponse'
import { AxiosHttpRepository } from './http/infraestructure/AxiosHttpRepository'
import Swal from 'sweetalert2'

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

export function descargarArchivoUrl(
  url: string,
): void {
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

export function gestionarNotificacionError(
  error: any,
  notificaciones: any
): void {
  if (isAxiosError(error)) {
    const mensajes: string[] = error.erroresValidacion
    if (mensajes.length > 0) {
      notificarMensajesError(mensajes, notificaciones)
    } else {
      if (error.status === 413) {
        notificaciones.notificarAdvertencia(
          'El tamaño del archivo es demasiado grande.'
        )
      } else {
        notificaciones.notificarAdvertencia(error.mensaje)
      }
    }
  } else {
    notificaciones.notificarAdvertencia(error.message)
  }
}

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
export function obtenerFechaActual() {
  const timeStamp = Date.now()
  const formattedString = date.formatDate(timeStamp, 'DD-MM-YYYY')
  return formattedString
}

/**
 * Funcion para remover tildes o acentos de una cadena
 * @param accents cadena que se va a limpiar
 * @returns cadena sin acentos ni tildes
 */
export function removeAccents(accents: string) {
  return accents.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export async function obtenerTiempoActual() {
  const axios = AxiosHttpRepository.getInstance()

  const cargando = new StatusEssentialLoading()

  try {
    cargando.activar()
    cargando.establecerMensaje('Obteniendo fecha y hora actual')

    const fecha: AxiosResponse = await axios.get(axios.getEndpoint(endpoints.fecha))
    const hora: AxiosResponse = await axios.get(axios.getEndpoint(endpoints.hora))

    //const fechaArray = fecha.split('-') //.map(Number)
    console.log(fecha.data)
    return { fecha: fecha.data, hora: hora.data, fecha_hora: fecha.data + ' ' + hora.data }
  } catch (e: any) {
    throw new ApiError(e)
  } finally {
    cargando.desactivar()
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
export async function imprimirArchivo(ruta: string, metodo: Method, responseType: ResponseType, formato: string, titulo: string, data?: any,) {
  const statusLoading = new StatusEssentialLoading()
  statusLoading.activar()
  const axiosHttpRepository = AxiosHttpRepository.getInstance()
  axios({
    url: ruta,
    method: metodo,
    data: data,
    responseType: responseType,
    headers: {
      'Authorization': axiosHttpRepository.getOptions().headers.Authorization
    }
  }).then((response: HttpResponseGet) => {
    console.log(response.data)
    if (response.data.size < 100 || response.data.type=='application/json') throw 'No se obtuvieron resultados para generar el reporte'
    else {
      const fileURL = URL.createObjectURL(new Blob([response.data], { type: `appication/${formato}` }))
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.setAttribute('download', `${titulo}.${formato}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }).catch(error => {
    let timerInterval
    Swal.fire({
      title: 'No hay datos!',
      html: error,
      icon: 'warning',
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => { clearInterval(timerInterval) }
    })
  })

  statusLoading.desactivar()

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

  const onErrorDeUbicacion = err => {
    console.log('Error obteniendo ubicación: ', err)
  }

  const opcionesDeSolicitud = {
    enableHighAccuracy: true, // Alta precisión
    maximumAge: 0, // No queremos caché
    timeout: 5000 // Esperar solo 5 segundos
  }

  navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud)
}

export function extraerRol(roles: string[], rolConsultar: string) {
  return roles.some((rol: string) => rol === rolConsultar)
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
