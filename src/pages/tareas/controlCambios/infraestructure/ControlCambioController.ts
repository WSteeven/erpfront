import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ControlCambio } from '../domain/ControlCambio'
import { endpoints } from 'config/api'

export class ControlCambioController extends TransaccionSimpleController<ControlCambio> {
  constructor() {
    super(endpoints.control_cambios)
  }
}
