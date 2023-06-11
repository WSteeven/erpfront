import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoTicket } from '../domain/TipoTicket'
import { endpoints } from 'config/api'

export class TipoTicketController extends TransaccionSimpleController<TipoTicket> {
  constructor() {
    super(endpoints.tipos_tickets)
  }
}
