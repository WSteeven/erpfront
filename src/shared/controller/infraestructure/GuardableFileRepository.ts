import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponsePost } from '../../http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'

export class GuardableFileRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardarArchivos(id: number, entidad: T, params?: ParamsType): Promise<ResponseItem<T, HttpResponsePost<T>>> {
    let ruta
    try {
      if(params){
        ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/'+id+'/' + this.httpRepository.mapearArgumentos(params)
     }else{
        ruta = this.httpRepository.getEndpoint(this.endpoint) + '/files/'
     }
      const response: AxiosResponse = await this.httpRepository.post(ruta, entidad)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
