import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Tendido } from '../domain/Tendido'
import { endpoints } from 'config/api'

export class ControlTendidoController extends TransaccionSimpleController<Tendido> {
  constructor() {
    super(endpoints.tendidos)
  }
}
