import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import {
  EmpleadoDelegado
} from 'recursosHumanos/empleados/modules/modoNoDisponible/domain/EmpleadoDelegado'
import { endpoints } from 'config/api'

export class EmpleadoDelegadoController extends TransaccionSimpleController<EmpleadoDelegado>{
  constructor() {
    super(endpoints.empleados_delegados)
  }
}
