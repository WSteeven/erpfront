import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ReporteCuestionarioController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.reporte_cuestionario)
  }
}
