// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { estadosSolicitudesExamenes } from 'config/utils/medico'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'
import { Ref, ref } from 'vue'

// Logica y controladores
import { ComportamientoModalesGestionPaciente } from './ComportamientoModalesGestionPaciente'
import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { DetalleExamen } from '../domain/DetalleExamen'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export function useBotonesSolicitudExamen(tabEstadoExamen: Ref, modales?: ComportamientoModalesGestionPaciente) {
  /*********
   * Stores
   *********/
  const medicoStore = useMedicoStore()

  /**************
   * Referencias
   **************/
  const seleccionVariosExamen = ref(false)
  const refTablaExamenes = ref()
  const examenesSeleccionados: Ref<ExamenSolicitado[]> = ref([])
  const { notificarAdvertencia } = useNotificaciones()

  /*********
   * Header
   *********/
  const btnSeleccionarVariosExamenes: CustomActionTable<DetalleExamen> = {
    titulo: 'Solicitar varios examenes',
    icono: 'bi-check-square',
    color: 'positive',
    visible: () => !seleccionVariosExamen.value && tabEstadoExamen.value === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value,
    accion: async () => seleccionVariosExamen.value = true
  }

  const btnSolicitarExamenesSeleccionados: CustomActionTable = {
    titulo: 'Solicitar examenes seleccionados',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => seleccionVariosExamen.value,
    accion: async function () {
      if (!examenesSeleccionados.value.length) return notificarAdvertencia('Debe seleccionar al menos un examen!')
      /* medicoStore.examenesSolicitados = examenesSeleccionados.value
      modales.abrirModalEntidad('SolicitudExamenSolicitarPage') */

      medicoStore.accion = acciones.nuevo
      const solicitudExamen = new SolicitudExamen()
      solicitudExamen.examenes_solicitados = examenesSeleccionados.value.map((examen: ExamenSolicitado) => {
        const examenSolicitado = new ExamenSolicitado()
        examenSolicitado.examen = examen.id
        return examenSolicitado
      })

      // console.log(entidad)
      // console.log(solicitudExamen)
      medicoStore.solicitudExamen = solicitudExamen
      modales?.abrirModalEntidad('SolicitudExamenSolicitarPage')
    }
  }

  const btnCancelarSeleccionarVariosExamenes: CustomActionTable<DetalleExamen> = {
    titulo: 'Cancelar seleccion',
    icono: 'bi-x',
    color: 'negative',
    visible: () => seleccionVariosExamen.value && tabEstadoExamen.value === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value,
    accion: async () => {
      seleccionVariosExamen.value = false
      limpiarExamenesSolicitados()
    }
  }

  /* const btnNuevoDiagnostico: CustomActionTable<DetalleExamen> = {
    titulo: 'Nuevo diagnostico',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => tabEstadoExamen.value === estadosSolicitudesExamenes.DIAGNOSTICO_REALIZADO.value,
    accion: async () => {
      modales.abrirModalEntidad('DiagnosticoRecetaPage')
    }
  } */

  /*const btnResultados: CustomActionTable = {
    titulo: 'Resultados de los exámenes',
    icono: 'bi-table',
    color: 'positive',
    visible: () => tabEstadoExamen.value === estadosSolicitudesExamenes.SOLICITADO.value,
    accion: () => {
      // medicoStore.examenSolicitado = entidad
      // console.log(entidad)

      modales?.abrirModalEntidad('ResultadosExamenPage')
    }
  }*/

  /* const btnCitaMedica: CustomActionTable = {
    titulo: 'Diagnóstico y receta',
    icono: 'bi-capsule-pill',
    color: 'blue-grey',
    visible: () => tabEstadoExamen.value === estadosSolicitudesExamenes.SOLICITADO.value,
    accion: () => {
      medicoStore.idCita = null
      // medicoStore.empleado = entidad.paciente_id
      modales?.abrirModalEntidad('DiagnosticoRecetaPage')
    }
  }*/
  const btnResultados = () => {
    modales?.abrirModalEntidad('ResultadosExamenPage')
  }

  const btnCitaMedica = () => {
    medicoStore.idCita = null
    modales?.abrirModalEntidad('DiagnosticoRecetaPage')
  }

  /********
   * Body
   ********/
  const btnSolicitarExamenIndividual: CustomActionTable<Examen> = {
    titulo: 'Solicitar examen',
    icono: 'bi-plus',
    color: 'positive',
    visible: () => tabEstadoExamen.value === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value && !seleccionVariosExamen.value,
    accion: ({ entidad }) => {
      medicoStore.accion = acciones.nuevo
      const solicitudExamen = new SolicitudExamen()
      solicitudExamen.examenes_solicitados = [entidad].map((examen: Examen) => {
        const examenSolicitado = new ExamenSolicitado()
        examenSolicitado.examen = examen.id
        return examenSolicitado
      })

      // console.log(entidad)
      // console.log(solicitudExamen)
      medicoStore.solicitudExamen = solicitudExamen
      modales?.abrirModalEntidad('SolicitudExamenSolicitarPage')
    }
  }

  const btnConsultarEstadoSolicitudExamen: CustomActionTable<SolicitudExamen> = {
    titulo: 'Consultar estado',
    icono: 'bi-eye',
    color: 'primary',
    visible: () => [estadosSolicitudesExamenes.SOLICITADO.value].includes(tabEstadoExamen.value),
    accion: ({ entidad }) => {
      medicoStore.accion = acciones.consultar
      const examenesSolicitados: ExamenSolicitado[] = mapearExamenesSolicitados(entidad.examenes_solicitados)

      const solicitudExamen = new SolicitudExamen()
      solicitudExamen.hydrate(entidad)
      solicitudExamen.examenes_solicitados = examenesSolicitados
      medicoStore.solicitudExamen = solicitudExamen
      console.log(examenesSolicitados)
      console.log(solicitudExamen)
      modales?.abrirModalEntidad('SolicitudExamenSolicitarPage')
    }
  }

  const btnSubirResultadosExamenes: CustomActionTable<SolicitudExamen> = {
    titulo: 'Consultar/Adjuntar resultados',
    icono: 'bi-upload',
    color: 'primary',
    visible: () => [estadosSolicitudesExamenes.SOLICITADO.value].includes(tabEstadoExamen.value),
    accion: ({ entidad }) => {
      medicoStore.accion = acciones.consultar
      const examenesSolicitados: ExamenSolicitado[] = mapearExamenesSolicitados(entidad.examenes_solicitados)

      const solicitudExamen = new SolicitudExamen()
      solicitudExamen.hydrate(entidad)
      solicitudExamen.examenes_solicitados = examenesSolicitados
      medicoStore.solicitudExamen = solicitudExamen

      modales?.abrirModalEntidad('SubirResultadosExamenesPage', { solicitud_examen: entidad })
    }
  }

  /******************
   * Other functions
   ******************/
  async function seleccionarExamen(examenes: ExamenSolicitado[]) {
    examenesSeleccionados.value = examenes
  }

  const limpiarExamenesSolicitados = () => {
    console.log('limpiando examenes...')
    examenesSeleccionados.value = []
    refTablaExamenes.value.clearSelection()
  }

  const mapearExamenesSolicitados = (examenesSolicitados: ExamenSolicitado[]): ExamenSolicitado[] => {
    return examenesSolicitados.map((examenSolicitado: ExamenSolicitado) => {
      const examen = new ExamenSolicitado()
      examen.examen = examenSolicitado.examen
      examen.laboratorio_clinico = examenSolicitado.laboratorio_clinico
      examen.fecha_asistencia = examenSolicitado.fecha_hora_asistencia?.split(' ')[0] || null
      examen.hora_asistencia = examenSolicitado.fecha_hora_asistencia?.split(' ')[1] || null

      return examen
    })
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
    // btnNuevoDiagnostico,
    // Body
    btnSolicitarExamenIndividual,
    btnResultados,
    btnConsultarEstadoSolicitudExamen,
    btnCitaMedica,
    btnSubirResultadosExamenes,
    // Other functions
    seleccionarExamen,
    limpiarExamenesSolicitados,
  }
}
