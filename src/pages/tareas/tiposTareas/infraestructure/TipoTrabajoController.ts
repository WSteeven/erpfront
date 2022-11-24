import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoTrabajo } from '../domain/TipoTrabajo'
import { endpoints } from 'config/api'

export class TipoTrabajoController extends TransaccionSimpleController<TipoTrabajo> {
  constructor() {
    super(endpoints.tipos_trabajos)
  }
}
