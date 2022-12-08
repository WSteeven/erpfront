import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'

export class GuardableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardar(entidad: T, params?: any) {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint, params)
      const response: any = await this.httpRepository.post(ruta, entidad)
      // const response: any = await this.httpRepository.post(ruta, this.encapsularFormData(entidad))
      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  encapsularFormData(entidad: any) {
    const formData = new FormData()
    for (const key in entidad) {
      if (entidad[key]) {
        formData.append(key, entidad[key])
      }
    }

    return formData
  }
}
