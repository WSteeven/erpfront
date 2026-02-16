import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoFotografia } from '../domain/TipoFotografia'
import { endpoints } from 'config/api'

export class TipoFotografiaController extends TransaccionSimpleController<TipoFotografia> {
  constructor() {
    super(endpoints.tipos_fotografias)
  }
}
