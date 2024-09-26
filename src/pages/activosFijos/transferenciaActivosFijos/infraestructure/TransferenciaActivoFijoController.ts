import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TransferenciaActivoFijo } from '../domain/TransferenciaActivoFijo'
import { endpoints } from 'config/api'

export class TransferenciaActivoFijoController extends TransaccionSimpleController<TransferenciaActivoFijo>{
  constructor() {
    super(endpoints.transferencias_activos_fijos)
  }
}
