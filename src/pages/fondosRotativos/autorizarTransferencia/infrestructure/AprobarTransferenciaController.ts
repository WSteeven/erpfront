import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosError } from 'axios'
import { ApiError } from 'shared/error/domain/ApiError'
import { Transferencia } from 'pages/fondosRotativos/transferencias/domain/Transferencia'

export class AprobarTransferenciaController {
  private  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async aprobarTransferencia(transferencia:any): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.aprobar_transferencia),
        transferencia
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async rechazarTransferencia(transferencia: Transferencia): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.rechazar_transferencia),
        transferencia
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async anularTransferencia(transferencia: Transferencia): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.anular_transferencia),
        transferencia
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
