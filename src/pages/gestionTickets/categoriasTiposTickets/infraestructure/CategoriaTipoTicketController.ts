import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CategoriaTipoTicket } from '../domain/CategoriaTipoTicket'
import { endpoints } from 'config/api'

export class CategoriaTipoTicketController extends TransaccionSimpleController<CategoriaTipoTicket> {
  constructor() {
    super(endpoints.categorias_tipos_tickets)
  }
}
