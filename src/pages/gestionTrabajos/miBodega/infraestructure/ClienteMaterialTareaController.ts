import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MaterialEmpleadoTarea } from '../domain/MaterialEmpleadoTarea'
import { endpoints } from 'config/api'
import { ClienteMaterial } from '../domain/ClienteMaterial'

export class ClienteMaterialTareaController extends TransaccionSimpleController<ClienteMaterial> {
  constructor() {
    super(endpoints.obtener_clientes_materiales_tarea)
  }
}
