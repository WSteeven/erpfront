import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'

export class ConsultableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async consultar<T>(id: number, params?: any): Promise<any> {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint) + id
      const response: any = await this.httpRepository.get(ruta)
      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: any) {
      throw new ApiError(error)
    }
  }
}
