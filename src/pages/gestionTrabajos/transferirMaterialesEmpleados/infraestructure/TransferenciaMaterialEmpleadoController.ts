import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TransferenciaMaterialEmpleado } from '../domain/TransferenciaMaterialEmpleado'
import { endpoints } from 'config/api'

export class TransferenciaMaterialEmpleadoController extends TransaccionSimpleController<TransferenciaMaterialEmpleado>{
  constructor() {
    super(endpoints.devoluciones)
  }
}
