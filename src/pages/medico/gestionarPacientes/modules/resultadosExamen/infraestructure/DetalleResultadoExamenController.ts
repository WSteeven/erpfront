import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ResultadoExamen } from '../domain/ResultadoExamen'
import { endpoints } from 'config/api'
import { DetalleResultadoExamen } from '../domain/DetalleResultadoExamen'

export class DetalleResultadoExamenController extends TransaccionSimpleController<DetalleResultadoExamen>{
  constructor() {
    super(endpoints.detalles_resultados_examenes)
  }
}
