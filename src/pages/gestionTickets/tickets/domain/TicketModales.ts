// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ReagendarTicketPage from 'tickets/modules/reagendarTicket/ReagendarTicketPage.vue'
import SeguimientoTicketPage from 'tickets/modules/seguimientosTickets/view/SeguimientoTicketPage.vue'
import DetalleTicketAsignadoPage from 'ticketsAsignados/modules/detalleTicketAsignado/view/DetalleTicketAsignadoPage.vue'
import CalificarTicketPage from 'pages/gestionTickets/tickets/modules/calificarTicket/CalificarTicketPage.vue'
export class TicketModales {
  ReagendarTicketPage: ComponenteModal
  SeguimientoTicketPage: ComponenteModal
  DetalleTicketAsignadoPage: ComponenteModal
  CalificarTicketPage: ComponenteModal

  constructor() {
    this.ReagendarTicketPage = markRaw(new ComponenteModal('Cambiar responsable', ReagendarTicketPage))

    this.SeguimientoTicketPage = markRaw(
      new ComponenteModal('Seguimiento del ticket', SeguimientoTicketPage)
    )

    this.DetalleTicketAsignadoPage = markRaw(
      new ComponenteModal('Detalles del ticket', DetalleTicketAsignadoPage)
    )

    this.CalificarTicketPage = markRaw(new ComponenteModal('Calificar ticket', CalificarTicketPage))
  }
}
