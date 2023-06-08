// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ReagendarTicketPage from 'tickets/modules/reagendarTicket/ReagendarTicketPage.vue'
import SeguimientoTicketPage from 'tickets/modules/seguimientosTickets/view/SeguimientoTicketPage.vue'

export class TicketModales {
  ReagendarTicketPage: ComponenteModal
  SeguimientoTicketPage: ComponenteModal

  constructor() {
    this.ReagendarTicketPage = markRaw(new ComponenteModal('Cambiar responsable', ReagendarTicketPage))

    this.SeguimientoTicketPage = markRaw(
      new ComponenteModal('Seguimiento del ticket', SeguimientoTicketPage)
    )
  }
}
