import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { endpoints } from 'config/api'

export class RespuestaCuestionarioEmpleadoController extends TransaccionSimpleController<RespuestaCuestionarioEmpleado>{
  constructor() {
    super(endpoints.respuestas_cuestionarios_empleados)
  }
}
