import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class EstadoViaticoController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.estados_viaticos)
  }
}
