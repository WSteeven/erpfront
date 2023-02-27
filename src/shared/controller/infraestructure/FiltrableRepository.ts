import { ParamsType } from 'config/types'
import { Endpoint } from 'shared/http/domain/Endpoint'
import {
  HttpResponseGet,
  HttpResponseList,
} from 'shared/http/domain/HttpResponse'
import { ApiError } from '../../error/domain/ApiError'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'

export class FiltrableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async filtrar<C = T>(args?: ParamsType) {
    return this.httpRepository
      .get<HttpResponseGet<HttpResponseList<C>>>(
        this.httpRepository.getEndpoint(this.endpoint, args, true)
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
