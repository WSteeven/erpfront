import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Nodo } from 'gestionTrabajos/nodos/domain/Nodo'

export class NodoController extends TransaccionSimpleController<Nodo>{
  constructor() {
    super(endpoints.nodos)
  }
}
