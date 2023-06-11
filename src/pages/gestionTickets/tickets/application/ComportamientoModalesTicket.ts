import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TicketModales } from '../domain/TicketModales'

export class ComportamientoModalesTicket extends ComportamientoModales<TicketModales> {
  constructor() {
    super(new TicketModales())
  }
}
