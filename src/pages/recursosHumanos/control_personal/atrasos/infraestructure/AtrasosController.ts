import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Atrasos } from '../domain/Atrasos'
import { endpoints } from 'config/api'

export class AtrasosController extends TransaccionSimpleController<Atrasos> {
  constructor() {
    super(endpoints.atrasos)
  }
}
