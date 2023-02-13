  import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class TableroController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.tablero)
  }
}
