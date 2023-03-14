import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MotivoPausa } from '../domain/MotivoPausa'
import { endpoints } from 'config/api'

export class MotivoPausaController extends TransaccionSimpleController<MotivoPausa> {
  constructor() {
    super(endpoints.motivos_pausas)
  }
}
