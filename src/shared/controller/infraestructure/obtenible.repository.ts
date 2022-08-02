/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Endpoint} from "@shared/http/domain/Endpoint"
import {AxiosHttpRepository} from "../../http/infraestructure/AxiosHttpRepository"
import {ApiError} from "../../error/domain/ApiError"

export class ObtenibleRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async obtener<K = T>(args?: any): Promise<any> {
    return this.httpRepository
      .get<K>(this.httpRepository.getEndpoint(this.endpoint, args))
      .catch((error) => {
        throw new ApiError(error)
      })
  }

  async obtenerID<K = T>(id: number, args?: any): Promise<any> {
    return this.httpRepository
      .get<K>(
        this.httpRepository.getEndpoint(
          {
            endpoint: this.endpoint,
            id,
          },
          args
        )
      )
      .catch((error) => {
        throw new ApiError(error)
      })
  }
}
