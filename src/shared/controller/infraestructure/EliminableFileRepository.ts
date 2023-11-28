import { Endpoint } from 'shared/http/domain/Endpoint'
import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { ApiError } from '../../error/domain/ApiError'
import { HttpResponseDelete } from '../../http/domain/HttpResponse'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'

export class EliminableFileRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async eliminarFile(
    id: number,
    // params?: any
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
