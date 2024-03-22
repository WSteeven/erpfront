// Dependencias
import { configuracionColumnasSolicitudExamen } from '../../solicitudesExamenes/domain/configuracionColumnasSolicitudExamen'
import { estadosSolicitudesExamenes, tabOptionsEstadosExamenes, tiposProcesosExamenes } from 'config/utils/medico'
import { configuracionColumnasEsquemaVacunacion } from '../domain/configuracionColumnasEsquemaVacunacion'
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { Ref, computed, defineComponent, ref, watch } from 'vue'
import { tabOptionsEstadosEmpleados } from 'config/utils'

// Componentes
// import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { useNotificaciones } from 'shared/notificaciones'
import { useExamenes } from '../application/UseExamenes'
import { EsquemaVacuna } from '../domain/EsquemaVacuna'
import { useMedicoStore } from 'stores/medico'
import { accionesTabla } from 'config/utils'
import { SolicitudExamenPusherEvent } from 'src/pusherEvents/medico/SolicitudExamenPusherEvent'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente },
  setup() {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()
    const { listar } = mixin.useComportamiento()
    const notificaciones = useNotificaciones()

    /************
     * Variables
     ************/
    const listadoExamenes = ref([])

    const tabs = ref(tiposProcesosExamenes.INGRESO)
    const tabEstadoExamen = ref(estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value)
    const tabsRegistro = ref()
    const altoTabla = computed(() => {
      switch (tabEstadoExamen.value) {
        case estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value:
          return (examenes.value.length * 48 + 420) + 'px'
        case estadosSolicitudesExamenes.SOLICITADO.value || estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value:
          return (solicitudesExamenes.value.length * 48 + 420) + 'px'
      }
    })

    const esquemaVacunaciones: Ref<any[]> = ref([
      {
        'tipo_vacuna': 'Covid',
        'dosis_aplicadas': 3,
      },
      {
        'tipo_vacuna': 'Fiebre amarilla',
        'dosis_aplicadas': 1,
      },
      {
        'tipo_vacuna': 'Difteria',
        'dosis_aplicadas': 1,
      },
      {
        'tipo_vacuna': 'Hepatitis A o B, AB',
        'dosis_aplicadas': 1,
      },
      {
        'tipo_vacuna': 'Tétanos',
        'dosis_aplicadas': 1,
      },
      {
        'tipo_vacuna': 'Influenza',
        'dosis_aplicadas': 0,
      },
    ])

    const modales = new ComportamientoModalesGestionPaciente()

    /*************
     * Funciones
     *************/
    const {
      examenes,
      solicitudesExamenes,
      registros,
      consultarRegistrosEmpleadoExamen,
      consultarExamenesSinSolicitar,
      consultarSolicitudesExamenes,
      guardarRegistro
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
      // btnNuevoDiagnostico,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      btnConsultarEstadoSolicitudExamen,
      btnCitaMedica,
      // Other functions
      seleccionarExamen,
      limpiarExamenesSolicitados,
    } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    const btnEsquemaVacunacion: CustomActionTable<Examen> = {
      titulo: 'Gestionar',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        modales.abrirModalEntidad('EsquemaVacunacionPage')
      }
    }

    const agregarRegistro = () => {
      const config: CustomActionPrompt = {
        titulo: 'Motivo',
        mensaje: 'Ingrese una observación.',
        accion: async (motivo) => {
          try {
            if (empleado.id) guardarRegistro(motivo, empleado.id, tabs.value)
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

    const seleccionarRegistro = (registro: number) => {
      medicoStore.idRegistroEmpleadoExamen = registro
      examenes.value = []
      tabEstadoExamen.value = estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
      tabsRegistro.value = registro
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

    const filtrarEmpleados = (tab: number) => {
      listar({ estado: tab })
    }

    const filtrarEstadoExamen = (tab) => {
      tabEstadoExamen.value = tab
      examenes.value = []
      solicitudesExamenes.value = []

      if (tab === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value) {
        consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: tabsRegistro.value })
      } else {
        examenesSeleccionados.value = []
        consultarSolicitudesExamenes(tab, tabsRegistro.value)
      }
    }

    /*********
     * Hooks
     *********/
    onConsultado(async () => {
      medicoStore.empleado = empleado
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.id })
      const idRegistro = registros.value[0].id
      if (idRegistro) seleccionarRegistro(idRegistro)
    })

    /*******
     * Init
     *******/
    const solicitudExamenPusherEvent = new SolicitudExamenPusherEvent()
    solicitudExamenPusherEvent.start()

    return {
      mixin,
      empleado,
      tabs,
      tabsRegistro,
      tabEstadoExamen,
      configuracionColumnas: configuracionColumnasEmpleados,
      columnasEsquemaVacunacion: [...configuracionColumnasEsquemaVacunacion, accionesTabla],
      configuracionColumnasExamenes,
      configuracionColumnasSolicitudExamen,
      tabOptionsEstadosExamenes,
      listadoExamenes,
      filtrarEstadoExamen,
      splitterModel: ref(14),
      accionesTabla,
      modales,
      examenes,
      registros,
      solicitudesExamenes,
      tiposProcesosExamenes,
      tipoSeleccion: computed(() => seleccionVariosExamen.value && tabEstadoExamen.value === estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value ? 'multiple' : 'none'),
      esquemaVacunaciones,
      tabOptionsEstadosEmpleados,
      filtrarEmpleados,
      altoTabla,
      // funciones
      agregarRegistro,
      seleccionarRegistro,
      actualizarListadoExamenes,
      consultarSolicitudesExamenes,
      estadosSolicitudesExamenes,
      /*******************
       * Botones examenes
       *******************/
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
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
      // btnSolicitarExamenesSeleccionados2,
      btnEsquemaVacunacion,
    }
  },
})
