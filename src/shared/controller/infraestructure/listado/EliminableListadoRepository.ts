import { Endpoint } from 'shared/http/domain/Endpoint'
import { AxiosError, AxiosResponse } from 'axios'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ResponseItem } from 'shared/controller/domain/ResponseItem'
import { HttpResponseDelete } from 'shared/http/domain/HttpResponse'
import { ApiError } from 'shared/error/domain/ApiError'

export class EliminableListadoRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async eliminar(
    ids: number[],
  ): Promise<ResponseItem<T, HttpResponseDelete<T>>> {
    try {
      /* const endpoint = {
        endpoint: this.endpoint,
        ids
      } */
      const ruta = this.httpRepository.getEndpoint(this.endpoint) + '?ids=' + ids
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
