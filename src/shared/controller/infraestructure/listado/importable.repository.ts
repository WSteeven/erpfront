/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {ApiError} from "@/@app/shared/error/domain/ApiError"
import {AxiosHttpRepository} from "@/@app/shared/http/infraestructure/AxiosHttpRepository"
import {Endpoint} from "@shared/http/domain/Endpoint"

export class ImportableRepository<T> {
  private httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  importarListado(listado: T[], args?: any) {
    return this.httpRepository
      .post<T>(
        this.httpRepository.getEndpoint(this.endpoint, {
          opcion: "import",
          ...args,
        }),
        {listado}
      )
      .catch((error) => {
        throw new ApiError(error)
      })
  }
}
