import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ResumenTendido } from '../domain/ResumenTendido'
import { endpoints } from 'config/api'

export class ResumenTendidoController extends TransaccionSimpleController<ResumenTendido> {
  constructor() {
    super(endpoints.resumen_tendidos)
  }
}
