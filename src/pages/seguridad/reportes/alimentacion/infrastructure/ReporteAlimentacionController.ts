import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteAlimentacionController extends TransaccionSimpleController<EntidadAuditable> {
  constructor() {
    super(endpoints.reporte_alimentacion)
  }
}
