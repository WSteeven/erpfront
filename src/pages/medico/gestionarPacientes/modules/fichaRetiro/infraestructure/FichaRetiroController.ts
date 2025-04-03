import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaRetiro } from '../domain/FichaRetiro'
import { endpoints } from 'config/api'

export class FichaRetiroController extends TransaccionSimpleController<FichaRetiro> {
  constructor() {
    super(endpoints.fichas_retiros)
  }
}

