import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoAptitudMedicaLaboral } from '../domain/TipoAptitudMedicaLaboral'
import { endpoints } from 'config/api'

export class TipoAptitudMedicaLaboralController extends TransaccionSimpleController<TipoAptitudMedicaLaboral>{
  constructor() {
    super(endpoints.tipos_aptitudes_medicas_laborales)
  }
}

