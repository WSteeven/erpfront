import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RegistroTendido } from '../domain/RegistroTendido'
import { endpoints } from 'config/api'

export class RegistroTendidoController extends TransaccionSimpleController<RegistroTendido> {
  constructor() {
    super(endpoints.registros_tendidos)
  }
}
