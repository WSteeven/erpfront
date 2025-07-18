/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'

export class ApiError extends Error {
  erroresValidacion: string[]
  mensaje: string
  status?: number
  headers?: any

  constructor(error) {
    super()
    this.mensaje = error.response?.data.mensaje
    this.erroresValidacion = this.obtenerMensajesError(error)
    this.headers = this.obtenerHeaders(error)
    this.status = error.response?.status
  }

  private obtenerMensajesError(error: AxiosError): string[] {
    const mensajes: any[] = []
    if (error.response?.data.errors) {
      const errores = Object.values(error.response.data.errors)
      mensajes.push(...errores.flat())
    }
    console.log('obtenerMensajesError', mensajes)
    return mensajes
  }
  private obtenerHeaders(error: AxiosError) {
    let headers = null

    if (error.response?.data.errors) {
      console.log('tiene errores:');

      headers =  error.response.headers
    }
    console.log('obtenerHeaders',headers)
    return headers
  }
}
