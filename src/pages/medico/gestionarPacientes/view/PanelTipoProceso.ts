// Dependencias
import { configuracionColumnasSolicitudExamen } from '../../solicitudesExamenes/domain/configuracionColumnasSolicitudExamen'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { estadosSolicitudesExamenes } from 'config/utils/medico'
import { computed, defineComponent, ref, watch } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { useExamenes } from '../application/UseExamenes'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { accionesTabla } from 'config/utils'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { useMedicoStore } from 'stores/medico'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

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

    // const { onConsultado } = props.mixin.useHooks()

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
        case estadosSolicitudesExamenes.SOLICITADO.value || estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value:
          return (solicitudesExamenes.value.length * 48 + 420) + 'px'
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

    const seleccionarRegistro = (registro: number) => {
      medicoStore.idRegistroEmpleadoExamen = registro
      tabRegistro.value = registro
      examenes.value = []
      tabEstadoExamen.value = estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
      consultarExamenesSinSolicitar({ empleado_id: empleado.value.id, registro_empleado_examen_id: registro })
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

    /********
     * Hooks
     ********/
    /* const onConsultado = async () => {
      console.log('consultado...')
      medicoStore.empleado = empleado.value
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.value.id })
      const idRegistro = registros.value[0].id
      if (idRegistro) seleccionarRegistro(idRegistro)
    } */

    async function seleccionarTabTipoProceso() {
      console.log('consultado...')

      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.value.id, tipo_proceso_examen: props.tipoProceso })
      const idRegistro = registros.value[0].id
      if (idRegistro) seleccionarRegistro(idRegistro)
    }

    /************
     * Observers
     ************/
    /* watch(empleado, async () => {
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.value.id, tipo_proceso_examen: props.tipoProceso })
    })*/

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
      // Other functions
      seleccionarExamen,
    }
  }
})
