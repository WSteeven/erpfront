import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import ActividadRealizadaSeguimientoSubtarea from '../domain/ActividadRealizadaSeguimientoSubtarea'

export class ActividadRealizadaSeguimientoSubtareaController extends TransaccionSimpleController<ActividadRealizadaSeguimientoSubtarea> {
  constructor() {
    super(endpoints.actividades_realizadas_seguimientos_subtareas)
  }
}
