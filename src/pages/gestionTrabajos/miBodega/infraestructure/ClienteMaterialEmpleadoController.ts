import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ClienteMaterial } from '../domain/ClienteMaterial'
import { endpoints } from 'config/api'

export class ClienteMaterialEmpleadoController extends TransaccionSimpleController<ClienteMaterial> {
  constructor() {
    super(endpoints.obtener_clientes_materiales_empleado)
  }
}
