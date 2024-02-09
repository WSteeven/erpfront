import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { ConfiguracionCuestionarioEmpleado } from '../domain/ConfiguracionCuestionarioEmpleado'

export class ConfiguracionCuestionarioEmpleadoController extends TransaccionSimpleController<ConfiguracionCuestionarioEmpleado> {
  constructor() {
    super(endpoints.configuracion_cuestionario_empleado)
  }
}
