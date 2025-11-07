import { MotivoCanceladoTicket } from 'pages/gestionTickets/motivosCanceladosTickets/domain/MotivoCanceladoTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MotivoPausaTicket } from 'pages/gestionTickets/motivosPausasTickets/domain/MotivoPausaTicket'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesTicket } from './ComportamientoModalesTicket'
import { isApiError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { CambiarEstadoTicket } from './CambiarEstadoTicket'
import { useNotificaciones } from 'shared/notificaciones'
import { estadosTickets } from 'config/tickets.utils'
import { useTicketStore } from 'stores/ticket'
import { Ticket } from '../domain/Ticket'
import { reactive } from 'vue'

export const useBotonesTablaTicket = (mixin: ContenedorSimpleMixin<Ticket | any>, modales: ComportamientoModalesTicket | any) => {
  const { confirmar, prompt, notificarCorrecto, promptItems } = useNotificaciones()
  const notificaciones = useNotificaciones()
  const { entidad: ticket, listado, listadosAuxiliares } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()

  const cambiarEstadoTicket = new CambiarEstadoTicket()
  const ticketStore = useTicketStore()
  const authenticationStore = useAuthenticationStore()

  let filtrarTickets: (estado: string) => void
  const setFiltrarTickets = (funcion: (estado: string) => void) => filtrarTickets = funcion

  const btnTransferir: CustomActionTable = {
    titulo: 'Transferir',
    icono: 'bi-arrow-right',
    color: 'secondary',
    visible: ({ entidad }) => [estadosTickets.ASIGNADO, estadosTickets.REASIGNADO, estadosTickets.EJECUTANDO, estadosTickets.PAUSADO].includes(entidad.estado) && entidad.responsable_id === authenticationStore.user.id,
    accion: ({ entidad, posicion }) => {
      ticketStore.filaTicket = entidad
      ticketStore.posicionFilaTicket = posicion
      modales.abrirModalEntidad('ReagendarTicketPage')
    }
  }

  const btnEjecutar: CustomActionTable = {
    titulo: 'Ejecutar',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosTickets.ASIGNADO, estadosTickets.REASIGNADO].includes(entidad.estado) && entidad.puede_ejecutar,
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de ejecutar el ticket?', async () => {
        const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
        entidad.estado = estadosTickets.EJECUTANDO
        entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
        filtrarTickets(estadosTickets.EJECUTANDO)
        notificarCorrecto(response.data.mensaje)
      })
    }
  }

  const btnPausar: CustomActionTable<Ticket> = {
    titulo: 'Pausar',
    icono: 'bi-pause-circle',
    color: 'blue-6',
    visible: ({ entidad }) => entidad.estado === estadosTickets.EJECUTANDO && entidad.responsable_id === authenticationStore.user.id,
    accion: ({ entidad }) => {

      confirmar('¿Está seguro de pausar el ticket?', () => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Seleccione el motivo de la pausa',
          accion: async (idMotivoPausa) => {

            try {

              const data = {
                motivo_pausa_ticket_id: idMotivoPausa,
              }

              await cambiarEstadoTicket.pausar(entidad.id, data)
              filtrarTickets(estadosTickets.PAUSADO)
              notificarCorrecto('Ticket pausado exitosamente!')
            } catch (error: any) {
              if (isApiError(error)) {
                const mensajes: string[] = error.erroresValidacion
                notificarMensajesError(mensajes, notificaciones)
              } else {
                notificaciones.notificarError(error.message)
              }
            }
          },
          tipo: 'radio',
          items: listadosAuxiliares.motivosPausas.map((motivo: MotivoPausaTicket) => {
            return {
              label: motivo.motivo,
              value: motivo.id
            }
          })
        })

        promptItems(config)
      })
    },
  }

  const btnReanudar: CustomActionTable = {
    titulo: 'Reanudar',
    icono: 'bi-play-circle',
    color: 'positive',
    visible: ({ entidad }) => [estadosTickets.PAUSADO, estadosTickets.FINALIZADO_SOLUCIONADO].includes(entidad.estado) && entidad.puede_ejecutar,
    accion: async ({ entidad }) => {
      confirmar('¿Está seguro de reanudar el trabajo?', async () => {
        await cambiarEstadoTicket.reanudar(entidad.id)
        filtrarTickets(estadosTickets.EJECUTANDO)
        notificarCorrecto('Ticket reanudado exitosamente!')
      })
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosTickets.EJECUTANDO && entidad.responsable_id === authenticationStore.user.id,
    accion: ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como finalizado el ticket?', async () => {
      const config: CustomActionPrompt = reactive({
        mensaje: 'Seleccione una opción de finalización',
        accion: async (opcion) => {

          if (opcion === 1) {
            try {
              await cambiarEstadoTicket.finalizar(entidad.id)
              filtrarTickets(estadosTickets.FINALIZADO_SOLUCIONADO)

              eliminarElemento(posicion)
              notificarCorrecto('Ticket finalizado exitosamente!')
            } catch (error: any) {
              if (isApiError(error)) {
                const mensajes: string[] = error.erroresValidacion
                notificarMensajesError(mensajes, notificaciones)
              } else {
                notificaciones.notificarError(error.message)
              }
            }
          } else {
            const config2: CustomActionPrompt = {
              titulo: 'Motivo',
              mensaje: 'Ingrese el motivo por el que no se pudo dar solución.',
              accion: async (motivo) => {
                try {
                  await cambiarEstadoTicket.finalizarNoSolucion(entidad.id, { motivo })
                  filtrarTickets(estadosTickets.FINALIZADO_SIN_SOLUCION)

                  eliminarElemento(posicion)
                  notificarCorrecto('Ticket finalizado exitosamente!')
                } catch (error: any) {
                  if (isApiError(error)) {
                    const mensajes: string[] = error.erroresValidacion
                    notificarMensajesError(mensajes, notificaciones)
                  } else {
                    notificaciones.notificarError(error.message)
                  }
                }
              },
            }

            prompt(config2)
          }
        },
        tipo: 'radio',
        items: [
          {
            label: 'SE SOLUCIONÓ EL TICKET',
            value: 1,
          },
          {
            label: 'NO SE LOGRÓ DAR SOLUCIÓN AL TICKET',
            value: 2,
          },
        ]
      })

      promptItems(config)

      /*await cambiarEstadoTicket.finalizar(entidad.id)
      notificarCorrecto('Ticket finalizado exitosamente!')*/
    }),
  }

  const btnSeguimiento: CustomActionTable = {
    titulo: 'Seguimiento',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTickets.REASIGNADO, estadosTickets.EJECUTANDO, estadosTickets.PAUSADO, estadosTickets.FINALIZADO_SIN_SOLUCION, estadosTickets.FINALIZADO_SOLUCIONADO].includes(entidad.estado),
    accion: async ({ entidad }) => {
      ticketStore.filaTicket = entidad
      modales.abrirModalEntidad('SeguimientoTicketPage')
    }
  }

  const btnReasignar: CustomActionTable = {
    titulo: 'Cambiar responsable',
    icono: 'bi-arrow-left-right',
    color: 'teal',
    visible: ({ entidad }) => entidad.estado === estadosTickets.ASIGNADO,
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
    visible: ({ entidad }) => entidad.estado === estadosTickets.RECHAZADO,
    accion: async ({ entidad, posicion }) => {
      ticketStore.filaTicket = entidad
      ticketStore.posicionFilaTicket = posicion
      modales.abrirModalEntidad('ReagendarTicketPage')
      // filtrarTickets(estadosTickets.ASIGNADO)
    }
  }

  const btnRechazar: CustomActionTable = {
    titulo: 'Rechazar',
    icono: 'bi-person-fill-down',
    color: 'negative',
    visible: ({ entidad }) => [estadosTickets.ASIGNADO, estadosTickets.REASIGNADO].includes(entidad.estado),
    accion: async ({ entidad, posicion }) => {
      const config: CustomActionPrompt = {
        titulo: 'Motivo',
        mensaje: 'Ingrese el motivo por el que rechaza el ticket.',
        accion: async (motivo) => {
          // await cambiarEstadoTicket.rechazar(entidad.id, { motivo })

          confirmar('¿Está seguro de rechazar el ticket?', async () => {
            const { response } = await cambiarEstadoTicket.rechazar(entidad.id, { motivo })
            eliminarElemento(posicion)
            notificarCorrecto(response.data.mensaje)
          })
        },
      }

      prompt(config)
    }
  }

  const btnCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    icono: 'bi-x',
    color: 'negative',
    visible: ({ entidad }) => [estadosTickets.RECHAZADO, estadosTickets.ASIGNADO].includes(entidad.estado),
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

  const btnCalificarSolicitante: CustomActionTable = {
    titulo: 'Calificar',
    icono: 'bi-stars',
    color: 'amber-8',
    visible: ({ entidad }) => [estadosTickets.FINALIZADO_SIN_SOLUCION, estadosTickets.FINALIZADO_SOLUCIONADO].includes(entidad.estado) && (authenticationStore.user.id === entidad.solicitante_id && entidad.pendiente_calificar_solicitante),
    accion: ({ entidad, posicion }) => {
      ticketStore.posicionFilaTicket = posicion
      ticketStore.filaTicket = entidad
      modales.abrirModalEntidad('CalificarTicketPage')
    }
  }

  const btnCalificarResponsable: CustomActionTable = {
    titulo: 'Calificar',
    icono: 'bi-stars',
    color: 'positive',
    visible: ({ entidad }) => [estadosTickets.FINALIZADO_SIN_SOLUCION, estadosTickets.FINALIZADO_SOLUCIONADO].includes(entidad.estado) && (authenticationStore.user.id === entidad.responsable_id && entidad.pendiente_calificar_responsable),
    accion: ({ entidad, posicion }) => {
      ticketStore.posicionFilaTicket = posicion
      ticketStore.filaTicket = entidad
      modales.abrirModalEntidad('CalificarTicketPage')
    }
  }

  const btnPausarRecurrente: CustomActionTable<Ticket> = {
    titulo: ({ entidad }) => (entidad.recurrence_active ? 'Pausar ' : 'Activar ') + 'recurrencia',
    icono: ({ entidad }) => entidad.recurrence_active ? 'bi-pause-fill' : 'bi-play-fill',
    color: ({ entidad }) => entidad.recurrence_active ? 'blue-4' : 'blue',
    visible: ({ entidad }) => entidad.is_recurring && entidad.solicitante_id === authenticationStore.user.id,
    accion: ({ entidad }) => {
      confirmar(`¿Está seguro de ${entidad.recurrence_active ? 'pausar' : 'activar'} la recurrencia del ticket?`, async () => {
        await editarParcial(entidad.id, { recurrence_active: !entidad.recurrence_active })
      })
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }

  return {
    btnTransferir,
    btnEjecutar,
    btnPausar,
    btnReanudar,
    btnFinalizar,
    btnSeguimiento,
    btnReasignar,
    btnCancelar,
    btnRechazar,
    btnCalificarSolicitante,
    btnCalificarResponsable,
    btnAsignar,
    setFiltrarTickets,
    btnPausarRecurrente,
  }
}
