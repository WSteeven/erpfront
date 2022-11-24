import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { endpoints } from 'config/api'

export class SubtareaAsignadaController extends TransaccionSimpleController<Subtarea> {
  constructor() {
    super(endpoints.subtareas_asignadas)
  }
}
