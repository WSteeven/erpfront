import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MotivoPendiente } from '../domain/MotivoPendiente'
import { endpoints } from 'config/api'

export class MotivoPendienteController extends TransaccionSimpleController<MotivoPendiente> {
  constructor() {
    super(endpoints.motivos_pendientes)
  }
}
