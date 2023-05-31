import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class TicketAsignadoController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.trabajo_asignado)
  }
}
