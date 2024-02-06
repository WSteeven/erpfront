import { ComportamientoModalesGestionPaciente } from "./ComportamientoModalesGestionPaciente"
import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import { DetalleExamen } from "../domain/DetalleExamen"
import { estadosExamenes } from "config/utils/medico"
import { Ref, ref } from "vue"
import { useMedicoStore } from "stores/medico"
import { Examen } from "pages/medico/examenes/domain/Examen"

export function useBotonesSolicitudExamen(tabEstadoExamen: Ref, modales: ComportamientoModalesGestionPaciente) {
  /*********
   * Stores
   *********/
  const medicoStore = useMedicoStore()

  /**************
   * Referencias
   **************/
  const seleccionVariosExamen = ref(false)
  const refTablaExamenes = ref()
  const examenesSeleccionados: Ref<Examen[]> = ref([])

  /*********
   * Header
   *********/
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
    accion: async function () {
      // console.log('Solicitando varios examenes...')
      // console.log(examenesSeleccionados.value)
      medicoStore.examenesSolicitados = examenesSeleccionados.value
      // examenesSeleccionados.value = []
      modales.abrirModalEntidad('SolicitudExamenPage')
    }
  }

  const btnCancelarSeleccionarVariosExamenes: CustomActionTable<DetalleExamen> = {
    titulo: 'Cancelar seleccion',
    icono: 'bi-x',
    color: 'negative',
    visible: () => seleccionVariosExamen.value && tabEstadoExamen.value === estadosExamenes.PENDIENTE_SOLICITAR,
    accion: async () => seleccionVariosExamen.value = false
  }

  const btnNuevoDiagnostico: CustomActionTable<DetalleExamen> = {
    titulo: 'Nuevo diagnostico',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => tabEstadoExamen.value === estadosExamenes.DIAGNOSTICO_REALIZADO,
    accion: async () => {
      modales.abrirModalEntidad('SolicitudExamenPage')
    }
  }

  /********
   * Body
   ********/
  const btnSolicitarExamenIndividual: CustomActionTable<Examen> = {
    titulo: 'Solicitar examen',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => tabEstadoExamen.value === '0' && !seleccionVariosExamen.value,
    accion: ({ entidad }) => {
      medicoStore.examenSolicitado = entidad
      examenesSeleccionados.value = [entidad]
      medicoStore.examenesSolicitados = examenesSeleccionados.value
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
      medicoStore.examenSolicitado = entidad
      console.log(entidad)
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

  /******************
   * Other functions
   ******************/
  async function seleccionarExamen(examenes: Examen[]) {
    examenesSeleccionados.value = examenes
  }

  return {
    // Referencias
    refTablaExamenes,
    seleccionVariosExamen,
    examenesSeleccionados,
    // Header
    btnSeleccionarVariosExamenes,
    btnSolicitarExamenesSeleccionados,
    btnCancelarSeleccionarVariosExamenes,
    btnNuevoDiagnostico,
    // Body
    btnSolicitarExamenIndividual,
    btnResultados,
    // Other functions
    seleccionarExamen,
  }
}
