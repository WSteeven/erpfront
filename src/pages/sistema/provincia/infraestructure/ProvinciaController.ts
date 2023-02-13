import { endpoints } from 'config/api'
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Provincia } from '../domain/provincia'

export class ProvinciaController extends TransaccionSimpleController<Provincia> {
  constructor() {
    super(endpoints.provincias)
  }
}
