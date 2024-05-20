// Dependencias
import { configuracionColumnasSolicitudExamen } from '../../solicitudesExamenes/domain/configuracionColumnasSolicitudExamen'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { estadosSolicitudesExamenes, tiposProcesosExamenes } from 'config/utils/medico'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { useExamenes } from '../application/UseExamenes'
import { computed, defineComponent, ref, } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { accionesTabla } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { RegistroEmpleadoExamen } from 'pages/medico/examenes/domain/RegistroEmpleadoExamen'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { Examen } from 'pages/medico/examenes/domain/Examen'

export default defineComponent({
  components: {
    EssentialTable,
    ModalesEntidad,
  },
  props: {
    empleado: {
      type: Object as () => Empleado,
      required: true,
    },
    tipoProceso: {
      type: String,
      required: true,
    },
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true,
    },
  },
  setup(props) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()

    /************
    * Variables
    *************/
    const notificaciones = useNotificaciones()
    const tabEstadoExamen = ref(estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value)
    const tabRegistro = ref()
    const empleado = computed(() => props.empleado)
    const modales = new ComportamientoModalesGestionPaciente()
    const altoTabla = computed(() => {
      switch (tabEstadoExamen.value) {
        case estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value:
          return (examenes.value.length * 48 + 420) + 'px'
        case estadosSolicitudesExamenes.SOLICITADO.value:
          return (solicitudesExamenes.value.length * 48 + 720) + 'px'
      }
    })

    /************
   * Funciones
   ************/
    const {
      examenes,
      solicitudesExamenes,
      registros,
      consultarRegistrosEmpleadoExamen,
      consultarExamenesSinSolicitar,
      consultarSolicitudesExamenes,
      guardarRegistro,
    } = useExamenes()

    const {
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
      examenesSeleccionados,
      // Header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
      btnCancelarSeleccionarVariosExamenes,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      btnConsultarEstadoSolicitudExamen,
      btnCitaMedica,
      btnSubirResultadosExamenes,
      // Other functions
      seleccionarExamen,
      limpiarExamenesSolicitados,
    } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    const agregarRegistro = () => {
      const config: CustomActionPrompt = {
        titulo: 'Motivo',
        mensaje: 'Ingrese una observación.',
        accion: async (motivo) => {
          try {
            if (empleado.value.id) guardarRegistro(motivo, empleado.value.id, props.tipoProceso)
            notificaciones.notificarCorrecto('Registro agregado exitosamente!')
          } catch (error: any) {
            if (isAxiosError(error)) {
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

    // const guardadoCitaMedica = (params: { page: keyof CitaMedicaModales, entidad: ConsultaMedica, hook }) => {
    const actualizarListadoExamenes = (params) => {//{ data, page }) => {
      console.log('ceradno modal jejej')
      console.log(params)
      let index: number, examen: Examen
      const { page } = params
      const { idExamenesSolicitados } = params.data // detalle_resultado_examen

      switch (page) {
        case 'SolicitudExamenSolicitarPage':
          // Quitar examenes solicitados
          idExamenesSolicitados.forEach((id: number) => {
            index = examenes.value.findIndex((examen: Examen) => examen.id === id)
            examenes.value.splice(index, 1)
          })

          limpiarExamenesSolicitados()
          break
        /*default:
          index = examenes.value.findIndex((examen) => examen.id === medicoStore.examenSolicitado?.id)
          examen = examenes.value[index]
          examen.detalle_resultado_examen = detalle_resultado_examen
          examenes.value.splice(index, 1, examen)*/
      }
    }

    const seleccionarRegistro = (registro: RegistroEmpleadoExamen) => {
      // Si las fichas ya fueron llenadas
      medicoStore.idRegistroEmpleadoExamen = registro.id ?? undefined
      medicoStore.idFichaAptitud = registro.ficha_aptitud
      medicoStore.idFichaRetiro = registro.ficha_retiro
      medicoStore.idFichaPreocupacional = registro.ficha_preocupacional
      medicoStore.idFichaPeriodica = registro.ficha_periodica
      medicoStore.idFichaReintegro = registro.ficha_reintegro

      tabRegistro.value = registro.id
      examenes.value = []
      tabEstadoExamen.value = estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
      consultarExamenesSinSolicitar({ empleado_id: empleado.value.id, registro_empleado_examen_id: registro.id })
    }

    const filtrarEstadoExamen = (tab) => {
      tabEstadoExamen.value = tab
      examenes.value = []
      solicitudesExamenes.value = []

      if (tab === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value) {
        consultarExamenesSinSolicitar({ empleado_id: empleado.value.id, registro_empleado_examen_id: tabRegistro.value })
      } else {
        examenesSeleccionados.value = []
        consultarSolicitudesExamenes(tab, tabRegistro.value)
      }
    }

    async function seleccionarTabTipoProceso() {
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.value.id, tipo_proceso_examen: props.tipoProceso })
      const registro = registros.value[0]
      if (registro) seleccionarRegistro(registro)
    }

    const abrirFichaAptitud = () => {
      modales.abrirModalEntidad('FichaAptitudPage')
    }

    const abrirFichaPeriodicaProcupacional = () => modales.abrirModalEntidad('FichaPreocupacionalPage')
    const abrirFichaPeriodica = () => modales.abrirModalEntidad('FichaPeriodicaPage')
    const abrirFichaReintegro = () => modales.abrirModalEntidad('FichaReintegroPage')
    const abrirFichaRetiro = () => modales.abrirModalEntidad('FichaRetiroPage')

    const resetearTabRegistro = () => tabRegistro.value = null

    return {
      // variables
      accionesTabla,
      modales,
      mixin: props.mixin,
      splitterModel: ref(14),
      tabEstadoExamen,
      tabRegistro,
      altoTabla,
      estadosSolicitudesExamenes,
      tipoSeleccion: computed(() => seleccionVariosExamen.value && tabEstadoExamen.value === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value ? 'multiple' : 'none'),
      textoFichaAptitud: computed(() => medicoStore.idFichaAptitud ? 'Consultar ficha de aptitud' : 'Llenar ficha de aptitud'),
      textoFichaPeriodica: computed(() => medicoStore.idFichaPeriodica ? 'Consultar ficha periódica' : 'Llenar ficha periódica'),
      textoFichaPreocupacional: computed(() => medicoStore.idFichaPreocupacional ? 'Consultar ficha preocupacional' : 'Llenar ficha preocupacional'),
      textoFichaReintegro: computed(() => medicoStore.idFichaReintegro ? 'Consultar ficha de reintegro' : 'Llenar ficha de reintegro'),
      textoFichaRetiro: computed(() => medicoStore.idFichaRetiro ? 'Consultar ficha retiro' : 'Llenar ficha retiro'),
      mostrarFichaPreocupacional: computed(() => props.tipoProceso === tiposProcesosExamenes.INGRESO),
      mostrarFichaPeriodica: computed(() => props.tipoProceso === tiposProcesosExamenes.PERIODICO),
      mostrarFichaReintegro: computed(() => props.tipoProceso === tiposProcesosExamenes.REINTEGRO),
      mostrarFichaRetiro: computed(() => props.tipoProceso === tiposProcesosExamenes.RETIRO),
      mostrarResultadosExamenes: computed(() => tabEstadoExamen.value === estadosSolicitudesExamenes.SOLICITADO.value),
      mostrarConsultaMedica: computed(() => tabEstadoExamen.value === estadosSolicitudesExamenes.SOLICITADO.value),
      // columnas
      configuracionColumnasExamenes,
      configuracionColumnasSolicitudExamen,
      agregarRegistro,
      // useExamenes
      examenes,
      solicitudesExamenes,
      registros,
      consultarRegistrosEmpleadoExamen,
      consultarExamenesSinSolicitar,
      consultarSolicitudesExamenes,
      guardarRegistro,
      // funciones
      actualizarListadoExamenes,
      seleccionarTabTipoProceso,
      seleccionarRegistro,
      filtrarEstadoExamen,
      abrirFichaAptitud,
      abrirFichaPeriodicaProcupacional,
      abrirFichaPeriodica,
      abrirFichaReintegro,
      abrirFichaRetiro,
      resetearTabRegistro,
      /*****************************
       * useBotonesSolicitudExamen
       *****************************/
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
      examenesSeleccionados,
      // Header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
      btnCancelarSeleccionarVariosExamenes,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      btnConsultarEstadoSolicitudExamen,
      btnCitaMedica,
      btnSubirResultadosExamenes,
      // Other functions
      seleccionarExamen,
    }
  }
})
