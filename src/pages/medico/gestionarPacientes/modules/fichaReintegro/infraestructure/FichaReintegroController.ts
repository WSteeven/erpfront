import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaReintegro } from '../domain/FichaReintegro'
import { endpoints } from 'config/api'

export class FichaReintegroController extends TransaccionSimpleController<FichaReintegro> {
  constructor() {
    super(endpoints.fichas_reintegro)
  }
}

