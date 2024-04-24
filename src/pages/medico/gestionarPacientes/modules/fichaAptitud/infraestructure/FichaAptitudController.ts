import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaAptitud } from '../domain/FichaAptitud'
import { endpoints } from 'config/api'

export class FichaAptitudController extends TransaccionSimpleController<FichaAptitud>{
  constructor() {
    super(endpoints.fichas_aptitudes)
  }
}

