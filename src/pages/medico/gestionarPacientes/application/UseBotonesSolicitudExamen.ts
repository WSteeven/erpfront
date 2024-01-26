import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import { ComportamientoModalesGestionPaciente } from "./ComportamientoModalesGestionPaciente"
import { Ref } from "vue"

export function useBotonesSolicitudExamen(tabEstadoExamen: Ref, modales: ComportamientoModalesGestionPaciente) {
  const btnSolicitar: CustomActionTable = {
    titulo: 'Solicitar examen',
    icono: 'bi-plus',
    color: 'positive',
    visible: ({ entidad }) => tabEstadoExamen.value === '0',
    accion: ({ entidad }) => {
      /*confirmar('¿Está seguro de ejecutar el ticket?', async () => {
        const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
        entidad.estado = estadosTickets.EJECUTANDO
        entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
        filtrarTickets(estadosTickets.EJECUTANDO)
        notificarCorrecto(response.data.mensaje)
      })*/
    }
  }

  const btnResultados: CustomActionTable = {
    titulo: 'Resultados',
    icono: 'bi-list',
    color: 'primary',
    visible: ({ entidad }) => tabEstadoExamen.value === '1',
    accion: ({ entidad }) => {
      modales.abrirModalEntidad('ResultadosExamenPage')
      /*confirmar('¿Está seguro de ejecutar el ticket?', async () => {
        const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
        entidad.estado = estadosTickets.EJECUTANDO
        entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
        filtrarTickets(estadosTickets.EJECUTANDO)
        notificarCorrecto(response.data.mensaje)
      })*/
    }
  }

  return {
    btnSolicitar,
    btnResultados,
  }
}
