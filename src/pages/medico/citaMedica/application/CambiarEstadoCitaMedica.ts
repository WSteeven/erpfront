import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import { UnwrapRef } from 'vue'

export class CambiarEstadoCitaMedica {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async agendar(id: number) {
    return await this.solicitud('/agendar', id)
  }

  async cancelar(id: number, motivo: string) {
    return this.solicitud('/cancelar', id, { motivo_cancelacion: motivo })
  }

  async rechazar(id: number, motivo: string) {
    return this.solicitud('/rechazar', id, { motivo_rechazo: motivo })
  }

  cargando = new StatusEssentialLoading()
  async solicitud(accion, id, data?: UnwrapRef<any>) {

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.citas_medicas) + accion + '/' + id

      this.cargando.activar()
      const response: AxiosResponse = await this.axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    } finally {
      this.cargando.desactivar()
    }
  }
}
