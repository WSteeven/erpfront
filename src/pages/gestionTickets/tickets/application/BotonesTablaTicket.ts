import { MotivoCanceladoTicket } from 'pages/gestionTickets/motivosCanceladosTickets/domain/MotivoCanceladoTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesTicket } from './ComportamientoModalesTicket'
import { CambiarEstadoTicket } from './CambiarEstadoTicket'
import { useNotificaciones } from 'shared/notificaciones'
import { estadosTickets } from 'config/tickets.utils'
import { Ticket } from '../domain/Ticket'
import { useTicketStore } from 'stores/ticket'

export const useBotonesTablaTicket = (mixin: ContenedorSimpleMixin<Ticket>, modales: ComportamientoModalesTicket) => {
  const { confirmar, prompt, notificarAdvertencia, notificarCorrecto, promptItems } = useNotificaciones()
  const { listado, listadosAuxiliares } = mixin.useReferencias()

  const cambiarEstadoTicket = new CambiarEstadoTicket()
  const ticketStore = useTicketStore()

  const btnSeguimiento: CustomActionTable = {
    titulo: 'Seguimiento',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTickets.EJECUTANDO, estadosTickets.PAUSADO, estadosTickets.FINALIZADO_SIN_SOLUCION, estadosTickets.FINALIZADO_SOLUCIONADO, estadosTickets.CALIFICADO].includes(entidad.estado),
    accion: async ({ entidad }) => {
      //
    }
  }

  const btnReasignar: CustomActionTable = {
    titulo: 'Cambiar responsable',
    icono: 'bi-arrow-left-right',
    color: 'positive',
    accion: async ({ entidad, posicion }) => {
      ticketStore.filaTicket = entidad
      ticketStore.posicionFilaTicket = posicion
      modales.abrirModalEntidad('ReagendarTicketPage')
    }
  }

  const btnAsignar: CustomActionTable = {
    titulo: 'Asignar',
    icono: 'bi-person-fill-up',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosTickets.SIN_ASIGNAR,
    accion: async ({ entidad }) => {
      //
    }
  }

  const btnCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    icono: 'bi-x',
    color: 'negative',
    accion: async ({ entidad, posicion }) => {
      const config: CustomActionPrompt = {
        mensaje: 'Seleccione el motivo de la cancelación',
        accion: (data) => {
          confirmar('¿Está seguro de cancelar el ticket?', async () => {
            const { result } = await cambiarEstadoTicket.cancelar(entidad.id, data)
            entidad.estado = estadosTickets.CANCELADO
            entidad.fecha_hora_cancelado = result.fecha_hora_cancelado
            entidad.motivo_cancelado = result.motivo_cancelado
            notificarCorrecto('Ticket cancelado exitosamente!')
            eliminarElemento(posicion)
          })
        },
        tipo: 'radio',
        items: listadosAuxiliares.motivosCancelados.map((motivo: MotivoCanceladoTicket) => {
          return {
            label: motivo.motivo,
            value: motivo.id
          }
        })
      }

      promptItems(config)
    }
  }

  const btnCalificar: CustomActionTable = {
    titulo: 'Calificar',
    icono: 'bi-stars',
    color: 'secondary',
    visible: ({ entidad }) => [estadosTickets.FINALIZADO_SIN_SOLUCION, estadosTickets.FINALIZADO_SOLUCIONADO].includes(entidad.estado),
    accion: async ({ entidad }) => {
      //
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }

  return {
    btnSeguimiento,
    btnReasignar,
    btnCancelar,
    btnCalificar,
    btnAsignar,
  }
}
