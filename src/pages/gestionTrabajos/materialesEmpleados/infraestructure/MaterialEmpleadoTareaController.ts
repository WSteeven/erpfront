import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MaterialEmpleadoTarea } from '../domain/MaterialEmpleadoTarea'
import { endpoints } from 'config/api'

export class MaterialEmpleadoTareaController extends TransaccionSimpleController<MaterialEmpleadoTarea> {
  constructor() {
    super(endpoints.materiales_empleado_tarea)
  }
}
