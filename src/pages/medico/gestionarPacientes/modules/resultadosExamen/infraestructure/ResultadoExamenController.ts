import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ResultadoExamen } from '../domain/ResultadoExamen'
import { endpoints } from 'config/api'

export class ResultadoExamenController extends TransaccionSimpleController<ResultadoExamen>{
  constructor() {
    super(endpoints.resultados_examenes)
  }
}
