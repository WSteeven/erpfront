import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Cie } from '../domain/Cie'

export class CieController extends TransaccionSimpleController<Cie> {
  constructor() {
    super(endpoints.cie)
  }
}
