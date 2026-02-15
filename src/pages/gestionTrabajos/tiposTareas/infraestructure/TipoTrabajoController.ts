import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoTrabajo } from '../domain/TipoTrabajo'
import { endpoints } from 'config/api'

import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export class TipoTrabajoController extends TransaccionSimpleController<TipoTrabajo> {
  constructor() {
    super(endpoints.tipos_trabajos)
  }

  async getFormConfig(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const url = axios.getEndpoint({ endpoint: this.getEndpoint(), id }) + '/form-config'
    return await axios.get(url)
  }
}
