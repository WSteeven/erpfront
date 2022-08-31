import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { ControlAsistencia } from '../domain/ControlAsistencia'
import { endpoints } from 'config/api'

export class ControlAsistenciaController extends TransaccionSimpleController<ControlAsistencia> {
  constructor() {
    super(endpoints.control_asistencias)
  }
}
