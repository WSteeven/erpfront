/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Endpoint } from '@/app/shared/http/domain/Endpoint'
import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { HttpResponsePut } from '../../http/domain/HttpResponse'
import { AxiosResponse } from 'axios'

export class EditableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async editar(
    id: number | null,
    entidad: T,
    args?: any
  ): Promise<ResponseItem<T, HttpResponsePut<T>>> {
    try {
      const endpoint = {
        endpoint: this.endpoint,
        id,
      }
      const ruta = this.httpRepository.getEndpoint(endpoint, args)
      const response: AxiosResponse = await this.httpRepository.put(
        ruta,
        entidad
      )
      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: any) {
      throw new ApiError(error)
    }
  }
}
