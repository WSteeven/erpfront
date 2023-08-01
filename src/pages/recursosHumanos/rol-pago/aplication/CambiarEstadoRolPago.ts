import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UnwrapRef } from 'vue'

export class CambiarEstadoRolPago {
  axios: AxiosHttpRepository
  cargando = new StatusEssentialLoading()

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }



  async ejecutar(idRolPago: number, data: UnwrapRef<any>) {
    return this.solicitud(idRolPago, data)
  }

  async realizar(idRolPago: number, movilizacion: any) {
    return this.solicitud(idRolPago, movilizacion)
  }

  async finalizar(idRolPago: number, data: any) {
    return this.solicitud( idRolPago, data)
  }

  async cancelar(idRolPago: number, idMotivoCancelado: number) {
    return this.solicitud( idRolPago, { motivo_suspendido_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
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
