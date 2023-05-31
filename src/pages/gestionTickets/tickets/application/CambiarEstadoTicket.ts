import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UnwrapRef } from 'vue'

export class CambiarEstadoTicket {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async asignar(id: number) {
    return await this.solicitud('/asignar', id)
  }

  async ejecutar(id: number, data: UnwrapRef<any>) {
    return this.solicitud('/ejecutar', id, data)
  }

  async finalizar(id: number) {
    return this.solicitud('/finalizar', id)
  }

  async pausar(id: number, movilizacion: any) {
    return this.solicitud('/pausar', id, movilizacion)
  }

  async reanudar(id: number, movilizacion: any) {
    return this.solicitud('/reanudar', id, movilizacion)
  }

  async cancelar(id: number, idMotivoCancelado: number) {
    return this.solicitud('/cancelar', id, { motivo_cancelado_ticket_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
  }

  async solicitud(accion, id, data?: UnwrapRef<any>) {
    const cargando = new StatusEssentialLoading()

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.tickets) + accion + '/' + id

      cargando.activar()
      const response: AxiosResponse = await this.axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    } finally {
      cargando.desactivar()
    }
  }
}
