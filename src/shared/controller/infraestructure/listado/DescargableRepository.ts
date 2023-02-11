import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ParamsType } from 'config/types'

export class DescargableRepository {
  private httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async descargarListado(params?: ParamsType): Promise<any> {
    const ruta = this.httpRepository.getEndpoint(this.endpoint, params)
    const response = await this.httpRepository.get<any>(
      ruta,
      { responseType: 'blob' }
    )

    return {
      response,
      result: response.data.modelo
    }
  }
}
