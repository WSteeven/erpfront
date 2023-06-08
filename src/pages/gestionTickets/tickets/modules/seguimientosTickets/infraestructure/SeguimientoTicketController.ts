import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import ActividadRealizadaSeguimientoTicket from '../domain/ActividadRealizadaSeguimientoTicket'
import { endpoints } from 'config/api'

export class SeguimientoTicketController extends TransaccionSimpleController<ActividadRealizadaSeguimientoTicket> {
  constructor() {
    super(endpoints.actividades_realizadas_seguimientos_tickets)
  }
}
