/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Endpoint } from '@/app/shared/http/domain/Endpoint'
import {
  HttpResponseGet,
  HttpResponseList,
} from '@/app/shared/http/domain/HttpResponse'
import { ApiError } from '../../error/domain/ApiError'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'

export class ListableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async listar<C = T>(args?: any) {
    return this.httpRepository
      .get<HttpResponseGet<HttpResponseList<C>>>(
        this.httpRepository.getEndpoint(this.endpoint, args)
      )
      .then((response: HttpResponseGet) => {
        return {
          response,
          result: response.data.results,
        }
      })
      .catch((error) => {
        throw new ApiError(error)
      })
  }
}
