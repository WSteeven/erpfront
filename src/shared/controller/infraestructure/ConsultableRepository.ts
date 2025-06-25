import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'
import { useNotificaciones } from 'shared/notificaciones'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import {useAuthenticationStore} from 'stores/authentication';

export class ConsultableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint
  private readonly notificaciones = useNotificaciones()

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async consultar(
    id?: number,
    params?: ParamsType
  ): Promise<ResponseItem<T, HttpResponseGet<T>>> {
    try {
      const endpoint = {
        endpoint: this.endpoint,
        id
      }

      const ruta = this.httpRepository.getEndpoint(endpoint, params)
      const response: AxiosResponse = await this.httpRepository.get(ruta)

      return {
        response,
        result: response.data.modelo
      }
    } catch (error: any) {
      switch (error.status) {
        case 401:
          this.notificaciones.notificarError(error.response.data.message)
          const store = useAuthenticationStore()
              store.isUserLoggedIn()
          break
        default:
          const axiosError = error as AxiosError
          throw new ApiError(axiosError)
      }
    }
  }
}
