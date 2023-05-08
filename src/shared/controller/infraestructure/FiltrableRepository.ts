import { Endpoint } from 'shared/http/domain/Endpoint'
import {
  HttpResponseGet,
  HttpResponseList,
} from 'shared/http/domain/HttpResponse'
import { ApiError } from '../../error/domain/ApiError'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { AxiosError } from 'axios'

export class FiltrableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async filtrar<C = T>(uri: string) {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint) + '?' + uri
      const response: HttpResponseGet = await this.httpRepository.get<HttpResponseGet<HttpResponseList<C>>>(ruta)

      return {
        response,
        result: response.data.results,
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
