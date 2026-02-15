import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Subtarea } from '../domain/Subtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export class SubtareaController extends TransaccionSimpleController<Subtarea> {
  constructor() {
    super(endpoints.subtareas)
  }

  async generateDocument(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const url = axios.getEndpoint({ endpoint: this.getEndpoint(), id }) + '/documento'
    return await axios.get(url, { responseType: 'blob' })
  }
}
