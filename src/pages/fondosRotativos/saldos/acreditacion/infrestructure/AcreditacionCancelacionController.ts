import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosError } from 'axios'
import { ApiError } from 'shared/error/domain/ApiError'
import { Acreditacion } from '../domain/Acreditacion'


export class AcreditacionCancelacionController  {
  private axios ;
  constructor() {
  this.axios= AxiosHttpRepository.getInstance()
  }

    async anularAcreditacion(acreditacion: Acreditacion): Promise<void> {
      try {
        await this.axios.post(this.axios.getEndpoint(endpoints.anular_acreditacion), acreditacion)
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        throw new ApiError(axiosError)
      }
      }
}
