// Dependencias
import {
  estadosSolicitudesExamenes,
  tabOptionsEstadosExamenes,
  tiposProcesosExamenes
} from 'config/utils/medico'
import { configuracionColumnasEsquemaVacunacion } from '../domain/configuracionColumnasEsquemaVacunacion'
import { SolicitudExamenPusherEvent } from 'src/pusherEvents/medico/SolicitudExamenPusherEvent'
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { accionesTabla, tabOptionsEstadosEmpleados } from 'config/utils'
import { computed, defineComponent, ref } from 'vue'
import { useMedicoStore } from 'stores/medico'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'
import PanelTipoProceso from './PanelTipoProceso.vue'

// Logica y controladores
import { EsquemaVacunaController } from '../modules/esquemaVacunacion/infraestructure/EsquemaVacunaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { useBotonesEsquemaVacuna } from '../application/UseBotonesEsquemaVacuna'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { useNotificaciones } from 'shared/notificaciones'
import { useExamenes } from '../application/UseExamenes'
import { EsquemaVacuna } from '../modules/esquemaVacunacion/domain/EsquemaVacuna'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

export default defineComponent({
  components: {
    GestorArchivos,
    TabLayoutFilterTabs2,
    SelectorImagen,
    ModalesEntidad,
    EssentialTable,
    DetallePaciente,
    PanelTipoProceso
  },
  setup() {
    /***
     * Variables
     */
    const refGestorFichaMedica = ref()

    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado, listadosAuxiliares } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()
    const notificaciones = useNotificaciones()

    cargarVista(async () =>
      obtenerListados({
        esquemasVacunas: [] /*{
        controller: new EsquemaVacunaController(),
        params: { paciente_id: medicoStore.empleado?.id },
      }, */
      })
    )

    /************
     * Variables
     ************/
    // FILTRAR ESQUEMA POR EMPLEADO SELECCINADO
    const listadoExamenes = ref([])

    const tabs = ref(tiposProcesosExamenes.INGRESO)
    const tabEstadoExamen = ref(
      estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
    )
    const tabsRegistro = ref()
    const refPanelTipoProcesoIngreso = ref()
    const refPanelTipoProcesoOcupacional = ref()
    const refPanelTipoProcesoReingreso = ref()
    const refPanelTipoProcesoSalida = ref()
    const esquemaVacunaController = new EsquemaVacunaController()

    const modales = new ComportamientoModalesGestionPaciente()

    /*************
     * Funciones
     *************/
    const { btnAgregarVacunaAplicada, btnEditarVacunaAplicada } =
      useBotonesEsquemaVacuna(modales, listadosAuxiliares)

    const {
      examenes,
      solicitudesExamenes,
      registros,
      consultarSolicitudesExamenes
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
      seleccionarExamen
    } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    /* const {
      agregarRegistro,
      seleccionarRegistro,
      filtrarEstadoExamen,
      actualizarListadoExamenes
    } = useTiposProcesosExamenes(tabs, tabsRegistro, tabEstadoExamen, empleado)*/

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

    const seleccionarTabTipoProcesoIngreso = () =>
      refPanelTipoProcesoIngreso.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoOcupacional = () =>
      refPanelTipoProcesoOcupacional.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoReingreso = () =>
      refPanelTipoProcesoReingreso.value.seleccionarTabTipoProceso()
    const seleccionarTabTipoProcesoSalida = () =>
      refPanelTipoProcesoSalida.value.seleccionarTabTipoProceso()

    const insertarListados = ({ esquemaVacuna, page }) => {
      console.log('indertar...')
      // listadosAuxiliares.esquemasVacunas.unshift(esquemaVacuna)
      const index = listadosAuxiliares.esquemasVacunas.findIndex(
        (esquema: EsquemaVacuna) =>
          esquema.tipo_vacuna_id === esquemaVacuna.tipo_vacuna_id
      )
      if (index >= 0)
        listadosAuxiliares.esquemasVacunas.splice(index, 1, esquemaVacuna)
      else listadosAuxiliares.esquemasVacunas.push(esquemaVacuna)
    }

    const actualizarListados = ({ esquemaVacuna, page }) => {
      console.log('modificado actualizar....')
      const index = listadosAuxiliares.esquemasVacunas.findIndex(
        (esquema: EsquemaVacuna) => esquema.id === esquemaVacuna.id
      )
      console.log(index)
      listadosAuxiliares.esquemasVacunas.splice(index, 1, esquemaVacuna)
    }

    const obtenerEsquemaVacunaPaciente = async (idEmpleado: number) => {
      const { result } = await esquemaVacunaController.listar({
        paciente_id: idEmpleado,
        agrupar: true
      })
      listadosAuxiliares.esquemasVacunas = result
    }

    /*********
     * Hooks
     *********/
    onConsultado(async entidad => {
      medicoStore.empleado = empleado
      console.log(empleado)
      await obtenerEsquemaVacunaPaciente(entidad.id)
      await refPanelTipoProcesoIngreso.value.seleccionarTabTipoProceso()
      refPanelTipoProcesoIngreso.value.resetearTabRegistro()
      refPanelTipoProcesoOcupacional.value.resetearTabRegistro()
      refPanelTipoProcesoReingreso.value.resetearTabRegistro()
      refPanelTipoProcesoSalida.value.resetearTabRegistro()
    })

    /*******
     * Init
     *******/
    const solicitudExamenPusherEvent = new SolicitudExamenPusherEvent()
    solicitudExamenPusherEvent.start()

    return {
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
      columnasEsquemaVacunacion: [
        ...configuracionColumnasEsquemaVacunacion,
        accionesTabla
      ],
      tabOptionsEstadosExamenes,
      listadoExamenes,
      // filtrarEstadoExamen,
      accionesTabla,
      modales,
      examenes,
      registros,
      solicitudesExamenes,
      tiposProcesosExamenes,
      tipoSeleccion: computed(() =>
        seleccionVariosExamen.value &&
        tabEstadoExamen.value ===
          estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
          ? 'multiple'
          : 'none'
      ),
      tabOptionsEstadosEmpleados,
      filtrarEmpleados,
      listadosAuxiliares,
      // funciones
      /* agregarRegistro,
      seleccionarRegistro,
      actualizarListadoExamenes,*/
      consultarSolicitudesExamenes,
      estadosSolicitudesExamenes,
      seleccionarTabTipoProcesoIngreso,
      seleccionarTabTipoProcesoOcupacional,
      seleccionarTabTipoProcesoReingreso,
      seleccionarTabTipoProcesoSalida,
      actualizarListados,
      insertarListados,
      btnAgregarVacunaAplicada,
      btnEditarVacunaAplicada,
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
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      btnConsultarEstadoSolicitudExamen,
      btnCitaMedica,
      // Other functions
      seleccionarExamen,
      btnEsquemaVacunacion,
      refGestorFichaMedica,
    }
  }
})
