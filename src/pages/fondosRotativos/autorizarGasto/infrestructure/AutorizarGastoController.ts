import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'

export class AutorizarGastoController extends TransaccionSimpleController<Gasto> {
  constructor() {
    super(endpoints.autorizaciones_gastos)
  }
}
