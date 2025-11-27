/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { obtenerMensajesError } from 'shared/utils'

export class ApiError extends Error {
  public readonly erroresValidacion: string[]
  public readonly mensaje: string
  public readonly status?: number
  public readonly headers?: any
  public readonly data: any

  constructor(error: AxiosError | any) {
    super()
    //Guardamos todo el error original por si necesitamos debug
    this.data = error?.response?.data || error

    this.mensaje = this.obtenerMensajePrincipal(error)
    this.erroresValidacion = this.obtenerErroresValidacion(error)
    this.headers = this.obtenerHeaders(error)
    this.status = error?.response?.status
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
      console.log('tiene errores:')

      headers = error.response.headers
    }
    console.log('obtenerHeaders', headers)
    return headers
  }

  private obtenerMensajePrincipal(error: AxiosError): string {
    // 1. Laravel 422 normal
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    // 2. Error 500 con JSON
    if (error.response?.data?.exception || error.response?.data?.message) {
      return (
        error.response.data.message ||
        error.response.data.exception ||
        'Error del servidor'
      )
    }

    // 3. Error de red (sin respuesta)
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar al servidor'
    }

    if (error.message === 'Network Error') {
      return 'Error de red. Revisa tu conexión'
    }

    // 4. Último recurso
    return error.message || 'Error desconocido'
  }

  private obtenerErroresValidacion(error: AxiosError): string[] {
    const errores: string[] = []

    // Caso 1: Laravel 422 → { message: "...", errors: { campo: ["msg"] } }
    if (error.response?.data?.errors) {
      const errorsObjetc = error.response.data.errors as Record<
        string,
        string[]
      >
      Object.values(errorsObjetc).forEach(msgs => {
        errores.push(...msgs)
      })
    }

    // Caso 2: Error 500 con mensaje directo
    if (
      error.response?.data?.message &&
      typeof error.response.data.message === 'string'
    ) {
      errores.push(error.response.data.message)
    }

    return errores.length > 0 ? errores : ['Ocurrió un error inesperado']
  }

  // Útil para mostrar en consola o logs
  public toString(): string {
    return `[${this.status}] ${this.mensaje} ${this.erroresValidacion.join(
      ' | '
    )}`
  }
}
