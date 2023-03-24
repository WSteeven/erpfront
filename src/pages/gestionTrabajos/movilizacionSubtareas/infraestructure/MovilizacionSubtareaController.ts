import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MovilizacionSubtarea } from '../domain/MovilizacionSubtarea'
import { endpoints } from 'config/api'

export class MovilizacionSubtareaController extends TransaccionSimpleController<MovilizacionSubtarea> {
  constructor() {
    super(endpoints.movilizacion_subtarea)
  }
}
