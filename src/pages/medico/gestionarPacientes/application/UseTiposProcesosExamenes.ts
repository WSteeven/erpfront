// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Ref, ref } from 'vue'

// Logica y controladores
import { RegistroEmpleadoExamenController } from 'pages/medico/examenes/infraestructure/RegistroEmpleadoExamenController'
import { SolicitudExamenController } from 'pages/medico/solicitudesExamenes/infraestructure/SolicitudExamenController'
import { RegistroEmpleadoExamen } from 'pages/medico/examenes/domain/RegistroEmpleadoExamen'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { isApiError, notificarMensajesError } from 'shared/utils'
import { useExamenes } from './UseExamenes'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { estadosSolicitudesExamenes } from 'config/utils/medico'
import { useMedicoStore } from 'stores/medico'
import { useBotonesSolicitudExamen } from './UseBotonesSolicitudExamen'

export function useTiposProcesosExamenes(tabTipoProceso: Ref<string>, tabRegistro: Ref<number>, tabEstadoExamen: Ref<string>, empleado: Empleado) {
  /*********
     * Stores
     *********/
  const medicoStore = useMedicoStore()

  /***************
   * Controllers
   ***************/


  /************
   * Variables
   ************/
  const notificaciones = useNotificaciones()


  /************
   * Funciones
   ************/
  const {
    examenes: examenesIngreso,
    solicitudesExamenes: solicitudesExamenesIngreso,
    registros: registrosIngreso,
    consultarRegistrosEmpleadoExamen: consultarRegistrosEmpleadoExamenIngreso,
    consultarExamenesSinSolicitar: consultarExamenesSinSolicitarIngreso,
    consultarSolicitudesExamenes: consultarSolicitudesExamenesIngreso,
    guardarRegistro: guardarRegistroIngreso,
  } = useExamenes()

  const {
    examenes: examenesOcupacional,
    solicitudesExamenes: solicitudesExamenesOcupacional,
    registros: registrosOcupacional,
    consultarRegistrosEmpleadoExamen: consultarRegistrosEmpleadoExamenOcupacional,
    consultarExamenesSinSolicitar: consultarExamenesSinSolicitarOcupacional,
    consultarSolicitudesExamenes: consultarSolicitudesExamenesOcupacional,
    guardarRegistro: guardarRegistroOcupacional,
  } = useExamenes()

  /* const {
    examenes,
    solicitudesExamenes,
    registros,
    consultarRegistrosEmpleadoExamen,
    consultarExamenesSinSolicitar,
    consultarSolicitudesExamenes,
    guardarRegistro,
  } = useExamenes()*/

  const {
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
    // Other functions
    seleccionarExamen,
    limpiarExamenesSolicitados,
  } = useBotonesSolicitudExamen(tabEstadoExamen)

  const agregarRegistro = () => {
    const config: CustomActionPrompt = {
      titulo: 'Motivo',
      mensaje: 'Ingrese una observación.',
      accion: async (motivo) => {
        try {
          if (empleado.id) guardarRegistro(motivo, empleado.id, tabTipoProceso.value)
          notificaciones.notificarCorrecto('Registro agregado exitosamente!')
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

    notificaciones.prompt(config)
  }

  const seleccionarRegistro = (registro: number) => {
    medicoStore.idRegistroEmpleadoExamen = registro
    examenes.value = []
    tabEstadoExamen.value = estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
    tabRegistro.value = registro
    consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: registro })
  }

  const actualizarListadoExamenes = ({ data, page }) => {
    let index: number, examen: Examen
    const { detalle_resultado_examen, idExamenesSolicitados } = data

    switch (page) {
      case 'SolicitudExamenSolicitarPage':
        // Quitar examenes solicitados
        idExamenesSolicitados.forEach((id: number) => {
          index = examenes.value.findIndex((examen: Examen) => examen.id === id)
          examenes.value.splice(index, 1)
        })

        limpiarExamenesSolicitados()
        break
      default:
        index = examenes.value.findIndex((examen) => examen.id === medicoStore.examenSolicitado?.id)
        examen = examenes.value[index]
        examen.detalle_resultado_examen = detalle_resultado_examen
        examenes.value.splice(index, 1, examen)
    }
  }

  const filtrarEstadoExamen = (tab) => {
    tabEstadoExamen.value = tab
    examenes.value = []
    solicitudesExamenes.value = []

    if (tab === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value) {
      consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: tabRegistro.value })
    } else {
      examenesSeleccionados.value = []
      consultarSolicitudesExamenes(tab, tabRegistro.value)
    }
  }

  return {
    // variables
    agregarRegistro,
    seleccionarRegistro,
    filtrarEstadoExamen,
    actualizarListadoExamenes,
    // Ingreso
    examenesIngreso,
    solicitudesExamenesIngreso,
    registrosIngreso,
    consultarRegistrosEmpleadoExamenIngreso,
    consultarExamenesSinSolicitarIngreso,
    consultarSolicitudesExamenesIngreso,
    guardarRegistroIngreso,
    // Ocupacional
    examenesOcupacional,
    solicitudesExamenesOcupacional,
    registrosOcupacional,
    consultarRegistrosEmpleadoExamenOcupacional,
    consultarExamenesSinSolicitarOcupacional,
    consultarSolicitudesExamenesOcupacional,
    guardarRegistroOcupacional,
  }
}
