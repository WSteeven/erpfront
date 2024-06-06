import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RegionCuerpo } from '../domain/RegionCuerpo'
import { endpoints } from 'config/api'

export class RegionCuerpoController extends TransaccionSimpleController<RegionCuerpo> {
  constructor() {
    super(endpoints.regiones_cuerpo)
  }
}

