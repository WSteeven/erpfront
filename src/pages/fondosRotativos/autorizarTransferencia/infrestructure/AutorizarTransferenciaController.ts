import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Transferencia } from 'pages/fondosRotativos/transferencias/domain/Transferencia'


export class AutorizarTransferenciaController extends TransaccionSimpleController<Transferencia> {
  constructor() {
    super(endpoints.autorizaciones_transferencia)
  }
}
