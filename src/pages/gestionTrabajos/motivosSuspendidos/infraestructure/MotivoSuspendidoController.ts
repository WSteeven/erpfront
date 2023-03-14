import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MotivoSuspendido } from '../domain/MotivoSuspendido'
import { endpoints } from 'config/api'

export class MotivoSuspendidoController extends TransaccionSimpleController<MotivoSuspendido> {
  constructor() {
    super(endpoints.motivos_suspendidos)
  }
}
