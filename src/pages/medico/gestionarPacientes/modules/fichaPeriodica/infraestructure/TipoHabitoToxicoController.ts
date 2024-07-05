import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { TipoHabitoToxico } from '../domain/TipoHabitoToxico'

export class TipoHabitoToxicoController extends TransaccionSimpleController<TipoHabitoToxico> {
  constructor() {
    super(endpoints.tipos_habitos_toxicos)
  }
}

