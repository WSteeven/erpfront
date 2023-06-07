import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { MotivoCanceladoTicket } from '../domain/MotivoCanceladoTicket'

export class MotivoCanceladoTicketController extends TransaccionSimpleController<MotivoCanceladoTicket> {
  constructor() {
    super(endpoints.motivos_cancelados_tickets)
  }
}
