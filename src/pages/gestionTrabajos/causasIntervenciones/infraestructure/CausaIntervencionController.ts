import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CausaIntervencion } from '../domain/CausaIntervencion'
import { endpoints } from 'config/api'

export class CausaIntervencionController extends TransaccionSimpleController<CausaIntervencion> {
  constructor() {
    super(endpoints.causas_intervenciones)
  }
}
