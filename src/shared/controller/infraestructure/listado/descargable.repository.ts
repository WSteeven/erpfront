import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'

export class DescargableRepository {
  private httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  descargarListado(args?: any): any {
    return this.httpRepository.get<any>(
      this.httpRepository.getEndpoint(this.endpoint, args),
      // { responseType: 'blob' }
    )
  }
}
