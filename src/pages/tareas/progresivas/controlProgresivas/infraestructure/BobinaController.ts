import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class BobinaController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.materiales_despachados_con_bobina)
  }
}
