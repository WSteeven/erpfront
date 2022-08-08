/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Endpoint } from '@/app/shared/http/domain/Endpoint'
import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { ApiError } from '../../error/domain/ApiError'

export class GuardableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardar(entidad: T, args?: any) {
    return this.httpRepository
      .post<T>(this.httpRepository.getEndpoint(this.endpoint, args), entidad)
      .catch((error) => {
        throw new ApiError(error)
      })
  }
}
