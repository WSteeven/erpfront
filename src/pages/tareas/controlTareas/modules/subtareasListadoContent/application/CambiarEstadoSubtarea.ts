import { AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export class CambiarEstadoSubtarea {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async asignar(subtareaId: number) {
    return this.solicitud('asignar', subtareaId)
  }

  async ejecutar(subtareaId: number) {
    return this.solicitud('ejecutar', subtareaId)
  }

  async realizar(subtareaId: number) {
    return this.solicitud('realizar', subtareaId)
  }

  async pausar(subtareaId: number, mensaje: string) {
    return this.solicitud('pausar', subtareaId, { motivo: mensaje })
  }

  async reanudar(subtareaId: number) {
    return this.solicitud('reanudar', subtareaId)
  }

  async suspender(subtareaId: number, mensaje: string) {
    return this.solicitud('suspender', subtareaId, { motivo: mensaje })
  }

  async cancelar(subtareaId: number, mensaje: string) {
    return this.solicitud('cancelar', subtareaId, { motivo: mensaje })
  }

  async solicitud(accion, tarea, data?) {
    try {
      const ruta =
        this.axios.getEndpoint(endpoints.subtareas) + accion + '/' + tarea
      const response: AxiosResponse = await this.axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: any) {
      throw new ApiError(e)
    }
  }
}
