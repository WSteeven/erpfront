import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class RegistroEmpleadoExamenController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.registros_empleados_examenes)
  }
}

