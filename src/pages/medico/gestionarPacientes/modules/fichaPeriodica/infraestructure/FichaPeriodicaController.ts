import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaPeriodica } from '../domain/FichaPeriodica'
import { endpoints } from 'config/api'

export class FichaPeriodicaController extends TransaccionSimpleController<FichaPeriodica> {
  constructor() {
    super(endpoints.fichas_periodicas)
  }
}

