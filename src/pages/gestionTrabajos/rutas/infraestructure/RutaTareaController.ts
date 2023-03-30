import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { RutaTarea } from '../domain/RutaTarea'

export class RutaTareaController extends TransaccionSimpleController<RutaTarea> {
  constructor() {
    super(endpoints.rutas_tareas)
  }
}
