import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoVacuna } from '../domain/TipoVacuna'
import { endpoints } from 'config/api'

export class TipoVacunaController extends TransaccionSimpleController<TipoVacuna>{
  constructor() {
    super(endpoints.tipos_vacunas)
  }
}

