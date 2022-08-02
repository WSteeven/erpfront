import {AxiosError} from "axios"

export class ApiError extends Error {
  erroresValidacion: string[]

  constructor(error: AxiosError) {
    super()
    this.erroresValidacion = this.obtenerMensajesError(error)
  }

  private obtenerMensajesError(error: AxiosError): string[] {
    const mensajes: any[] = []
    if (error.response) {
      const errores = Object.values(error.response.data.errors)
      mensajes.push(...errores.flat())
    }
    return mensajes
  }
}
