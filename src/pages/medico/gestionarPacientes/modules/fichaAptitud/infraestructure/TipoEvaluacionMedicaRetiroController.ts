import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoEvaluacionMedicaRetiro } from '../domain/TipoEvaluacionMedicaRetiro'
import { endpoints } from 'config/api'

export class TipoEvaluacionMedicaRetiroController extends TransaccionSimpleController<TipoEvaluacionMedicaRetiro>{
  constructor() {
    super(endpoints.tipos_eval_medicas_retiro)
  }
}

