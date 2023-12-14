import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { Ref, ref } from 'vue'

export function useGestionAtsApplication(cargarVista) {
  const ticketController = new TicketController()
  const { notificarCorrecto } = useNotificaciones()

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
    ticket.para_sso = true

    const fotografia = t.fotografia

    try {
      cargarVista(async () => {
        const { result } = await ticketController.guardar(ticket)
        ticketsAts.value.unshift(result)

        if (fotografia) {
          const file = base64ToFile(fotografia)
          await subir(file, result.id)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  function base64ToFile(base64String: string) {
    // Convertir la cadena Base64 a un blob
    const byteCharacters = atob(base64String.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })

    // Crear un objeto File a partir del blob
    return new File([blob], 'nombre_de_archivo.png', { type: 'image/png' })
  }

  async function subir(file, idTicket) {
    // Ahora puedes utilizar el objeto 'file' para enviarlo en FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('ticket_id', idTicket)

    const endpoint = endpoints.archivos_tickets
    // const mixinArchivoTicket = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())
    const axios = AxiosHttpRepository.getInstance()
    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(endpoint)}`
    const response: AxiosResponse = await axios.post(ruta, formData)
    notificarCorrecto(response.data.mensaje)
  }

  return {
    mostrarSolicitudesAts: ref(false),
    consultarTicketsATS,
    ticketsAts,
    guardarFilaSolicitudAts,
  }
}
