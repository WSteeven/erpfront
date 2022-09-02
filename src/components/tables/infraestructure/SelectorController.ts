import { endpoints } from 'config/api'
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'

export class SelectorController extends TransaccionSimpleController<any> {
  constructor(endpoint: keyof typeof endpoints) {
    super(endpoints[endpoint])
  }
}
