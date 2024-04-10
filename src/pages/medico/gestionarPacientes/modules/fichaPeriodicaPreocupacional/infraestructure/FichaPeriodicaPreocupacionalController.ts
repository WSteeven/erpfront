import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { endpoints } from 'config/api'

export class FichaPeriodicaPreocupacionalController extends TransaccionSimpleController<FichaPeriodicaPreocupacional>{
  constructor() {
    super(endpoints.fichas_periodicas_preocupacionales)
  }
}

