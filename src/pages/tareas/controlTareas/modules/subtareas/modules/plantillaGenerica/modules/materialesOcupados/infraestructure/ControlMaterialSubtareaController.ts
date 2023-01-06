import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ControlMaterialSubtarea } from '../domain/ControlMaterialSubtarea'
import { endpoints } from 'config/api'

export class ControlMaterialSubtareaController extends TransaccionSimpleController<ControlMaterialSubtarea> {
  constructor() {
    super(endpoints.materiales_pedidos)
  }
}
