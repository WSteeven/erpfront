import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'
import { endpoints } from 'config/api'

export class TransferenciaProductoEmpleadoController extends TransaccionSimpleController<TransferenciaProductoEmpleado>{
  constructor() {
    super(endpoints.transferencias_productos_empleados)
  }
}
