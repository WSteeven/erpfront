import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Ticket } from '../domain/Ticket'

export class TicketController extends TransaccionSimpleController<Ticket> {
  constructor() {
    super(endpoints.tickets)
  }
}
