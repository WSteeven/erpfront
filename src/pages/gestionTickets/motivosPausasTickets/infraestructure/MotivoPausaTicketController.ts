import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MotivoPausaTicket } from '../domain/MotivoPausaTicket'
import { endpoints } from 'config/api'

export class MotivoPausaTicketController extends TransaccionSimpleController<MotivoPausaTicket> {
  constructor() {
    super(endpoints.motivos_pausas_tickets)
  }
}
