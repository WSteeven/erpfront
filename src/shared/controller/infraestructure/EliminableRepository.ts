import { Endpoint } from 'shared/http/domain/Endpoint'
import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { ApiError } from '../../error/domain/ApiError'
import { HttpResponseDelete } from '../../http/domain/HttpResponse'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosResponse } from 'axios'

export class EliminableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async eliminar(
    id: number,
    params?: any
  ): Promise<ResponseItem<T, HttpResponseDelete<T>>> {
    try {
      const endpoint = {
        endpoint: this.endpoint, 
        id
      }
      const ruta = this.httpRepository.getEndpoint(endpoint)
      const response: AxiosResponse = await this.httpRepository.delete(ruta)
      return {
        response,
        result: response.data.mensaje,
      }
    } catch (error: any) {
      throw new ApiError(error)
    }
  }
}
