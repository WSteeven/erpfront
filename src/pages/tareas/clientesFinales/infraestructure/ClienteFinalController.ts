import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ClienteFinal } from '../domain/ClienteFinal'
import { endpoints } from 'config/api'

export class ClienteFinalController extends TransaccionSimpleController<ClienteFinal> {
  constructor() {
    super(endpoints.clientes_finales)
  }
}
