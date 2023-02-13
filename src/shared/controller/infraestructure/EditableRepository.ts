/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponsePut } from '../../http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'

export class EditableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async editar(
    id: number | null,
    entidad: T,
    params?: ParamsType
  ): Promise<ResponseItem<T, HttpResponsePut<T>>> {
    try {
      const endpoint = {
        endpoint: this.endpoint,
        id,
      }
      const ruta = this.httpRepository.getEndpoint(endpoint, params)
      const response: AxiosResponse = await this.httpRepository.put(
        ruta,
        entidad
      )

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
