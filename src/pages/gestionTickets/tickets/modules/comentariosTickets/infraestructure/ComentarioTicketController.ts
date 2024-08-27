import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ComentarioTicket } from '../domain/ComentarioTicket'
import { endpoints } from 'config/api'

export class ComentarioTicketController extends TransaccionSimpleController<ComentarioTicket> {
  constructor() {
    super(endpoints.comentarios_tickets)
  }
}
