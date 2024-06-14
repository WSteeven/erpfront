import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { AxiosError, AxiosResponse } from 'axios'

export class ListableFileRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async listarArchivos<C = T>(id: number, params?: Record<string, any>) {
    let ruta
    try {
      if (params) {
        ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/' +id+'/'+ this.httpRepository.mapearArgumentos(params)
      } else {
        ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/'+id
      }
      const response: AxiosResponse = await this.httpRepository.get(ruta)

      return {
        response,
        result: response.data.results,
      }
    } catch (error) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }

  }
}
