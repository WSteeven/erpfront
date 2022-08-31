import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { Endpoint } from 'shared/http/domain/Endpoint'

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
          opcion: 'import',
          ...args,
        }),
        { listado }
      )
      .catch((error) => {
        throw new ApiError(error)
      })
  }
}
