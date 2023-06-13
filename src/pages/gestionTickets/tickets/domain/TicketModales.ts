// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ReagendarTicketPage from 'tickets/modules/reagendarTicket/ReagendarTicketPage.vue'

export class TicketModales {
  ReagendarTicketPage: ComponenteModal

  constructor() {
    this.ReagendarTicketPage = markRaw(new ComponenteModal('Cambiar responsable', ReagendarTicketPage))
  }
}
