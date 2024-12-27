import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/domain/EvaluacionDesempeno'
import { endpoints } from 'config/api'

export class EvaluacionDesempenoController extends TransaccionSimpleController<EvaluacionDesempeno>{
  constructor() {
    super(endpoints.evaluaciones_desempeno)
  }
}
