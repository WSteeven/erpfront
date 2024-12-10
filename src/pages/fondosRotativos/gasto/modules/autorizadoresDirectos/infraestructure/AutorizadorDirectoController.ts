import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import {
  AutorizadorDirecto
} from 'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/domain/AutorizadorDirecto'
import { endpoints } from 'config/api'

export class AutorizadorDirectoController extends TransaccionSimpleController<AutorizadorDirecto>{
  constructor() {
    super(endpoints.autorizadores_directos)
  }
}
