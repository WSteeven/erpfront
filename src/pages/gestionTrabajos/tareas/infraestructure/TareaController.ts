import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Tarea } from '../domain/Tarea'

export class TareaController extends TransaccionSimpleController<Tarea> {
  constructor() {
    super(endpoints.tareas)
  }
}
