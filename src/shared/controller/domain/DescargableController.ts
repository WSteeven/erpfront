import { DescargableRepository } from '../infraestructure/listado/DescargableRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ParamsType } from 'config/types'

export abstract class DescargableController {
  private descargableRepository: DescargableRepository

  protected constructor(endpoint: Endpoint) {
    this.descargableRepository = new DescargableRepository(endpoint)
  }

  async descargar(params?: ParamsType) {
    return await this.descargableRepository.descargarListado(params)
  }
}
