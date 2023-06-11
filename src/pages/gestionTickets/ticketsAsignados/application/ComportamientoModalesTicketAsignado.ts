import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TicketModales } from 'pages/gestionTickets/tickets/domain/TicketModales'

export class ComportamientoModalesTicketAsignado extends ComportamientoModales<TicketModales> {
  constructor() {
    super(new TicketModales())
  }
}
