import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { AxiosError, AxiosResponse } from 'axios'
import {
  HttpResponseGet,
  HttpResponseList
} from 'shared/http/domain/HttpResponse'

export class ListableFileRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async listarArchivos<C = T>(id: number, params?: any) {
    //Record<string, any>) {
    let ruta
    try {
      if (params) {
        // ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/' + id + '?tipo=justificativo'
        ruta =
          this.httpRepository.getEndpoint(this.endpoint) +
          '/files/' +
          id +
          this.httpRepository.mapearArgumentos(params)
      } else {
        ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/' + id
      }
      const response: AxiosResponse = await this.httpRepository.get<
        HttpResponseGet<HttpResponseList<C>>
      >(ruta)

      return {
        response,
        result: response.data.results
      }
    } catch (error) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
