import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { Ref, ref } from 'vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export function useGestionAtsApplication(cargarVista) {
  const ticketController = new TicketController()
  // const cargando = new StatusEssentialLoading()

  const ticketsAts: Ref<Ticket[]> = ref([])

  async function consultarTicketsATS(idSubtarea: number) {
    cargarVista(async () => {

      const { result } = await ticketController.listar({
        filter: `solicitud_ats[subtarea_id]=${idSubtarea}`,
      })

      return ticketsAts.value = result
    })
  }

  async function guardarFilaSolicitudAts(t: Ticket, idSubtarea: number) {
    const ticket = new Ticket()
    ticket.asunto = t.asunto
    ticket.descripcion = t.descripcion
    ticket.es_solicitud_ats = true
    ticket.prioridad = 'ALTA'
    ticket.subtarea_id = idSubtarea

    try {
      // cargando.activar
      cargarVista(async () => {

        const { result } = await ticketController.guardar(ticket)
        ticketsAts.value.unshift(result)
      })
    } catch (e) {
      console.log(e)
    }
  }

  return {
    consultarTicketsATS,
    ticketsAts,
    guardarFilaSolicitudAts,
  }
}
