import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RegistroEmpleadoExamen } from '../domain/RegistroEmpleadoExamen'
import { endpoints } from 'config/api'

export class RegistroEmpleadoExamenController extends TransaccionSimpleController<RegistroEmpleadoExamen>{
  constructor() {
    super(endpoints.registros_empleados_examenes)
  }
}

