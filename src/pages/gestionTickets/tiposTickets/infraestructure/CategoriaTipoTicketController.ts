import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { CategoriaTipoTicket } from '../domain/CategoriaTipoTicket'

export class CategoriaTipoTicketController extends TransaccionSimpleController<CategoriaTipoTicket> {
  constructor() {
    super(endpoints.categorias_tipos_tickets)
  }
}
