import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoTarea } from '../domain/TipoTarea'
import { endpoints } from 'config/api'

export class TipoTareaController extends TransaccionSimpleController<TipoTarea> {
  constructor() {
    super(endpoints.tipos_tareas)
  }
}
