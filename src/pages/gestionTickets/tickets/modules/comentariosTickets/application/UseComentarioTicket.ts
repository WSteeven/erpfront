import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComentarioTicket } from '../domain/ComentarioTicket'
import { ref, Ref } from 'vue'
import { ComentarioTicketController } from '../infraestructure/ComentarioTicketController'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useAuthenticationStore } from 'stores/authentication'

export const useComentarioTicket = (ticket: Ticket) => {
    const authenticationStore = useAuthenticationStore()

    /*************
     * Variables
     *************/
    const mixin = new ContenedorSimpleMixin(ComentarioTicket, new ComentarioTicketController())
    const { listado: comentarios } = mixin.useReferencias()
    const { guardar } = mixin.useComportamiento()

    const consultarComentarios = () => {
    }

    const guardarComentario = (comentario: string) => {
        const datos = {
            comentario,
            empleado: authenticationStore.user.id,
            ticket: ticket.id,
        }

        // guardar(datos)
    }

    return {
        comentarios,
        consultarComentarios,
    }
}