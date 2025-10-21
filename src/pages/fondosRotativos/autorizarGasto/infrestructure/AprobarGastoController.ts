import { endpoints } from 'config/api'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosError } from 'axios'
import { ApiError } from 'shared/error/domain/ApiError'
import { notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import {HttpRepository} from 'shared/http/domain/HttpRepository';

export class AprobarGastoController {
  private axios:HttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async aprobarGasto(gasto: Gasto): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.aprobar_gasto),
        gasto
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async rechazarGasto(gasto: Gasto): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.rechazar_gasto),
        gasto
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async anularGasto(gasto: Gasto): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.anular_gasto),
        gasto
      )
      useNotificaciones().notificarAdvertencia('Gasto anulado correctamente')
    } catch (error: unknown) {
      console.log(error)
      const axiosError = new ApiError(error)

      await notificarMensajesError(
        axiosError.erroresValidacion,
        useNotificaciones()
      )
    }
  }
}
