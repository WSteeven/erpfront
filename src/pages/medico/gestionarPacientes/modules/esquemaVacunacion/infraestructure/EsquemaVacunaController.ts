import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EsquemaVacuna } from '../domain/EsquemaVacuna'
import { endpoints } from 'config/api'

export class EsquemaVacunaController extends TransaccionSimpleController<EsquemaVacuna>{
  constructor() {
    super(endpoints.esquemas_vacunas)
  }
}

