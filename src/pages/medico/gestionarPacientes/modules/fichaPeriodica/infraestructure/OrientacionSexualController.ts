import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { OrientacionSexual } from '../domain/OrientacionSexual'
import { endpoints } from 'config/api'

export class OrientacionSexualController extends TransaccionSimpleController<OrientacionSexual>{
  constructor() {
    super(endpoints.orientaciones_sexuales)
  }
}

