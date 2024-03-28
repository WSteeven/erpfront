// Dependencias
// import { configuracionColumnasSolicitudExamen } from '../../solicitudesExamenes/domain/configuracionColumnasSolicitudExamen'
import { estadosSolicitudesExamenes, tabOptionsEstadosExamenes, tiposProcesosExamenes } from 'config/utils/medico'
import { configuracionColumnasEsquemaVacunacion } from '../domain/configuracionColumnasEsquemaVacunacion'
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
// import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { Ref, computed, defineComponent, ref, watch } from 'vue'
import { tabOptionsEstadosEmpleados } from 'config/utils'

// Componentes
// import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'
import PanelTipoProceso from './PanelTipoProceso.vue'

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
import { useTiposProcesosExamenes } from '../application/UseTiposProcesosExamenes'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente, PanelTipoProceso },
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
    const refPanelTipoProcesoIngreso = ref()
    const refPanelTipoProcesoOcupacional = ref()
    const refPanelTipoProcesoReingreso = ref()
    const refPanelTipoProcesoSalida = ref()
    /* const altoTabla = computed(() => {
      switch (tabEstadoExamen.value) {
        case estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value:
          return (examenes.value.length * 48 + 420) + 'px'
        case estadosSolicitudesExamenes.SOLICITADO.value || estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value:
          return (solicitudesExamenes.value.length * 48 + 420) + 'px'
      }
    }) */

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

    const {
      agregarRegistro,
      seleccionarRegistro,
      filtrarEstadoExamen,
      actualizarListadoExamenes
    } = useTiposProcesosExamenes(tabs, tabsRegistro, tabEstadoExamen, empleado)

    const btnEsquemaVacunacion: CustomActionTable<Examen> = {
      titulo: 'Gestionar',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        modales.abrirModalEntidad('EsquemaVacunacionPage')
      }
    }

    const filtrarEmpleados = (tab: number) => {
      listar({ estado: tab })
    }

    const seleccionarTabTipoProcesoIngreso = () => refPanelTipoProcesoIngreso.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoOcupacional = () => refPanelTipoProcesoOcupacional.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoReingreso = () => refPanelTipoProcesoReingreso.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoSalida = () => refPanelTipoProcesoSalida.value.seleccionarTabTipoProceso()
    /* function seleccionarTabTipoProcesoOcupacional() {
      console.log(refPanelTipoProcesoOcupacional.value)
      refPanelTipoProcesoOcupacional.value.seleccionarTabTipoProceso()
    } */

    /*********
     * Hooks
     *********/
    onConsultado(async () => {
      medicoStore.empleado = empleado
      await refPanelTipoProcesoIngreso.value.seleccionarTabTipoProceso()
    })
    /* onConsultado(async () => {
      medicoStore.empleado = empleado
      // await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.id })
      const idRegistro = registros.value[0].id
      if (idRegistro) seleccionarRegistro(idRegistro)
    }) */

    /*******
     * Init
     *******/
    const solicitudExamenPusherEvent = new SolicitudExamenPusherEvent()
    solicitudExamenPusherEvent.start()

    return {
      // ref
      refPanelTipoProcesoIngreso,
      refPanelTipoProcesoOcupacional,
      refPanelTipoProcesoReingreso,
      refPanelTipoProcesoSalida,
      mixin,
      empleado,
      tabs,
      tabsRegistro,
      tabEstadoExamen,
      configuracionColumnas: configuracionColumnasEmpleados,
      columnasEsquemaVacunacion: [...configuracionColumnasEsquemaVacunacion, accionesTabla],
      // configuracionColumnasExamenes,
      // configuracionColumnasSolicitudExamen,
      tabOptionsEstadosExamenes,
      listadoExamenes,
      filtrarEstadoExamen,
      // splitterModel: ref(14),
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
      // altoTabla,
      // funciones
      agregarRegistro,
      seleccionarRegistro,
      actualizarListadoExamenes,
      consultarSolicitudesExamenes,
      estadosSolicitudesExamenes,
      seleccionarTabTipoProcesoIngreso,
      seleccionarTabTipoProcesoOcupacional,
      seleccionarTabTipoProcesoReingreso,
      seleccionarTabTipoProcesoSalida,
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
