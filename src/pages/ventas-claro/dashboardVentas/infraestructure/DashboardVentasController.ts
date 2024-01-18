import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { endpoints } from 'config/api'

export class DashboardVentasController extends TransaccionSimpleController<ReporteSubtareasRealizadas> {
  constructor() {
    super(endpoints.dashboard_ventas_claro)
  }
}
