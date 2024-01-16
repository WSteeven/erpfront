import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UnwrapRef } from 'vue'

export class CambiarEstadoAlimentacion {
  axios: AxiosHttpRepository
  cargando = new StatusEssentialLoading()

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }
  async finalizar(idAlimentacion: number, data: any) {
    return this.solicitud( idAlimentacion, data)
  }

  async solicitud( rolPago, data?: UnwrapRef<any>) {

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.rol_pago) +'/estado'+ '/' + rolPago

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
