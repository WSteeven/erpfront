/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosHttpRepository } from '@/app/shared/http/infraestructure/AxiosHttpRepository'
import { Endpoint } from '@/app/shared/http/domain/Endpoint'

export class DescargableRepository {
  private httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  descargarListado(args?: any): any {
    return this.httpRepository.get<any>(
      this.httpRepository.getEndpoint(this.endpoint, args),
      { responseType: 'blob' }
    )
  }
}
