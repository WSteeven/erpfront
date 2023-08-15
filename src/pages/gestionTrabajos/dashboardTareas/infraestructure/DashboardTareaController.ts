import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class DashboardTareaController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.dashboard_tareas)
  }
}
