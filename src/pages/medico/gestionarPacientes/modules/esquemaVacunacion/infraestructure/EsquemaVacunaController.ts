import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EsquemaVacuna } from 'pages/medico/gestionarPacientes/domain/EsquemaVacuna'
import { endpoints } from 'config/api'

export class EsquemaVacunaControllerController extends TransaccionSimpleController<EsquemaVacuna>{
  constructor() {
    super(endpoints.esquemas_vacunas)
  }
}

