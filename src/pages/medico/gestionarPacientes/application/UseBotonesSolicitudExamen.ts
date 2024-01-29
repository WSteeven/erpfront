import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import { ComportamientoModalesGestionPaciente } from "./ComportamientoModalesGestionPaciente"
import { Ref, ref } from "vue"
import { DetalleExamen } from "../domain/DetalleExamen"
import { estadosExamenes } from "config/utils/medico"

export function useBotonesSolicitudExamen(tabEstadoExamen: Ref, modales: ComportamientoModalesGestionPaciente) {
  const seleccionVariosExamen = ref(false)

  const btnSolicitar: CustomActionTable = {
    titulo: 'Solicitar examen',
    icono: 'bi-plus',
    color: 'positive',
    visible: ({ entidad }) => tabEstadoExamen.value === '0',
    accion: ({ entidad }) => {
      modales.abrirModalEntidad('SolicitudExamenPage')
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

  const btnSeleccionarVariosExamenes: CustomActionTable<DetalleExamen> = {
    titulo: 'Solicitar varios examenes',
    icono: 'bi-check-square',
    color: 'primary',
    visible: () => !seleccionVariosExamen.value && tabEstadoExamen.value === estadosExamenes.PENDIENTE_SOLICITAR,
    accion: async () => seleccionVariosExamen.value = true
  }

  const btnSolicitarExamenesSeleccionados: CustomActionTable = {
    titulo: 'Solicitar examenes seleccionados',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => seleccionVariosExamen.value,
    accion: async () => seleccionVariosExamen.value = false
  }

  return {
    // Referencias
    seleccionVariosExamen,
    // Botones
    btnSolicitar,
    btnResultados,
    // Botones header
    btnSeleccionarVariosExamenes,
    btnSolicitarExamenesSeleccionados,
  }
}
