import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { endpoints } from 'config/api'

export class ReporteModuloTareaController extends TransaccionSimpleController<ReporteSubtareasRealizadas> {
  constructor() {
    super(endpoints.reportes_modulo_tareas)
  }
}
