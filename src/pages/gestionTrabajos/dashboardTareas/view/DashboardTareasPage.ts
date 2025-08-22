// Dependencias
import {
  acciones,
  accionesTabla,
  estadosTrabajos,
  rolesSistema
} from 'config/utils'
import { obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { optionsLine, optionsPie } from 'config/graficoGenerico'
import { computed, defineComponent, reactive, ref } from 'vue'
import { required, requiredIf } from 'shared/i18n-validators'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { useSubtareaStore } from 'stores/subtarea'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { configuracionColumnasSubtarea } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { graficarPorCoordinadorUseCase } from '../applicacion/GraficarPorCoordinadorUseCase'
import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { graficarPorGrupoUseCase } from '../applicacion/GraficarPorGrupoUseCase'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import ErrorComponent from 'components/ErrorComponent.vue';
import NoOptionComponent from 'components/NoOptionComponent.vue';

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayout,
    EssentialTable,
    SelectorImagen,
    TableView,
    ModalesEntidad,
    GraficoGenerico
  },
  setup() {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()
    // const trabajoAsignadoStore = useTrabajoAsignadoStore()

    /********
     * Mixin
     ********/
    // mixin reporte subtareas realizadas
    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardTareaController()
    )

    const { listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    // mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(
      Subtarea,
      new SubtareaController()
    )

    cargarVista(async () => {
      await obtenerListados({
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
            rol: [
              rolesSistema.coordinador,
              rolesSistema.coordinadorBackup,
              rolesSistema.jefe_tecnico
            ]
          }
        }
      })
    })
    const SISTEMA = 'SISTEMA'
    const APPENATE = 'ESTADISTICAS'

    const tiposDashboard: OptionGroup[] = [
      { label: SISTEMA, value: SISTEMA },
      { label: APPENATE, value: APPENATE }
    ]
    const tipoDashboard = ref(SISTEMA)
    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTareaController = new DashboardTareaController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(
      () => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado
    )
    const tipoFiltroSubordinados = ref(modosAsignacionTrabajo.por_grupo)
    const mostrarInactivos = ref(false)
    const mostrarPowerBI = ref(false)

    async function checkMostrarInactivos(val) {
      filtro.empleado = null
      resetearDatosDashboardCoordinador()
      listadosAuxiliares.empleados = await cargando.cargarConsulta(
        async () =>
          (
            await new EmpleadoController().listar({ estado: val ? 0 : 1 })
          ).result
      )
      empleados.value = listadosAuxiliares.empleados
    }

    async function checkmostrarPowerBI(val) {
      if (val) console.log('se muestra el power BI')
    }

    // Tabs
    const opcionesSubordinado = {
      subordinadosGrafico: 'subordinadosGrafico',
      subordinadosListado: 'subordinadosListado',
      subordinadosEmpleadoListado: 'subordinadosEmpleadoListado'
    }

    const opcionesCoordinadorConsultado = {
      coordinadorConsultadoGrafico: 'coordinadorConsultadoGrafico',
      coordinadorConsultadoListado: 'coordinadorConsultadoListado'
    }

    const opcionesGrupo = {
      grupoGrafico: 'grupoGrafico',
      grupoListado: 'grupoListado'
    }

    const tabsCoordinadorConsultado = ref(
      opcionesCoordinadorConsultado.coordinadorConsultadoGrafico
    )
    const tabsSubordinados = ref(opcionesSubordinado.subordinadosGrafico)
    const tabsGrupo = ref(opcionesGrupo.grupoGrafico)

    const opcionesFiltroGrupoEmpleado = {
      porGrupo: 'POR GRUPO',
      porEmpleado: 'POR EMPLEADO'
    }

    const mostrarSeccionGrupo = computed(
      () => filtro.grupo_empleado === opcionesFiltroGrupoEmpleado.porGrupo
    )
    const mostrarSeccionEmpleado = computed(
      () => filtro.grupo_empleado === opcionesFiltroGrupoEmpleado.porEmpleado
    )

    /*******
     * Init
     *******/
    filtro.fecha_fin = obtenerFechaActual()
    filtro.grupo_empleado = opcionesFiltroGrupoEmpleado.porEmpleado

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { requiredIf: requiredIf(() => mostrarSeccionEmpleado.value) },
      grupo: { requiredIf: requiredIf(() => mostrarSeccionGrupo.value) }
    }

    const v$ = useVuelidate(reglas, filtro)

    /**********
     * Modales
     **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()
    const {
      execute,
      graficos,
      seleccionarEstado,
      listadoFiltrado,
      resetearDatos
    } = graficarPorGrupoUseCase(dashboardTareaController, filtro)
    const {
      consultarDashboardCoordinador,
      resetearDatosDashboardCoordinador,
      seleccionarGraficoLineaTiempo,
      seleccionarCantidadesPorEstadoSubtareas,
      seleccionarCantidadesSubtareasSubordinados,
      seleccionarGraficoEmpleadoSubordinado,
      // DEMAS
      agendadosEmpleado,
      ejecutadosEmpleado,
      pausadosEmpleado,
      suspendidosEmpleado,
      canceladosEmpleado,
      realizadosEmpleado,
      finalizadosEmpleado,
      agendados,
      ejecutados,
      pausados,
      suspendidos,
      cancelados,
      realizados,
      finalizados,
      graficoLineaTiempoSubtareasFinalizadasCoordinador,
      graficoLineaTiempoSubtareasRealizadasCoordinador,
      cantidadSubtareasEjecutadas,
      cantidadesPorEstadosSubtareas,
      cantidadesPorEstadosSubtareasBar,
      subtareasFiltradas,
      subtareasSubordinados,
      subtareasEmpleadoSubordinado,
      subtareas,
      cantidadTareasActivas,
      cantidadTareasFinalizadas,
      cantidadSubtareasAgendadas,
      cantidadSubtareasPausadas,
      cantidadSubtareasSuspendidas,
      cantidadSubtareasCanceladas,
      cantidadSubtareasRealizadas,
      cantidadSubtareasFinalizadas,
      totalSubtareas,
      graficosCoordinadorSubordinadosPorGrupo,
      graficosCoordinadorSubordinadosPorCoordinador,
      mostrarCantidades
    } = graficarPorCoordinadorUseCase(
      dashboardTareaController,
      filtro,
      modalesSubtarea
    )

    const { btnSeguimiento } = useBotonesTablaSubtarea(
      subtareas,
      modalesSubtarea
    )
    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      }
    }

    /*********
     * Filtros
     **********/
    const { grupos, filtrarGrupos, empleados, filtrarEmpleados } =
      useFiltrosListadosTarea(listadosAuxiliares)

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          tabsGrupo.value = opcionesGrupo.grupoGrafico
          resetearDatosDashboardCoordinador()
          await consultarDashboardCoordinador()
        } catch (e) {
          console.log(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    async function consultarGrupo() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          tabsGrupo.value = opcionesGrupo.grupoGrafico
          resetearDatos()
          await execute()
        } catch (e) {
          console.log(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function limpiarDatosConsultados() {
      resetearDatos()
      resetearDatosDashboardCoordinador()
      filtro.empleado = null
      filtro.grupo = null
    }

    function consultarDesdeFechas() {
      if (mostrarSeccionEmpleado.value) consultar()
      if (mostrarSeccionGrupo.value) consultarGrupo()
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) =>
        ordernarListaString(a.apellidos!, b.apellidos!)
      )
    }

    function clickGraficoLineaTiempo(data) {
      seleccionarGraficoLineaTiempo(data)
    }

    function clickGraficoEstadosGrupo(data) {
      tabsGrupo.value = opcionesGrupo.grupoListado
      seleccionarEstado(data.label)
    }

    function clickCantidadesPorEstadoSubtareas(data) {
      const { label } = data
      if (label) {
        tabsCoordinadorConsultado.value =
          opcionesCoordinadorConsultado.coordinadorConsultadoListado
        seleccionarCantidadesPorEstadoSubtareas(data)
      }
    }

    function clickCantidadesSubtareasSubordinados(data, estado) {
      const { label } = data
      if (label) {
        tabsSubordinados.value = opcionesSubordinado.subordinadosListado
        seleccionarCantidadesSubtareasSubordinados(data, estado)
      }
    }

    function clickGraficoEmpleadoSubordinado(data, estado) {
      const { label } = data
      if (label) {
        tabsSubordinados.value = opcionesSubordinado.subordinadosEmpleadoListado
        seleccionarGraficoEmpleadoSubordinado(data, estado)
      }
    }

    return {
      modoUnaColumna: ref(false),
      // Por empleado
      agendadosEmpleado,
      ejecutadosEmpleado,
      pausadosEmpleado,
      suspendidosEmpleado,
      canceladosEmpleado,
      realizadosEmpleado,
      finalizadosEmpleado,
      // Por grupo
      agendados,
      ejecutados,
      pausados,
      suspendidos,
      cancelados,
      realizados,
      finalizados,
      // Graficos
      estadosTrabajos,
      opcionesSubordinado,
      opcionesCoordinadorConsultado,
      opcionesGrupo,
      tabsCoordinadorConsultado,
      tabsSubordinados,
      tabsGrupo,
      clickCantidadesPorEstadoSubtareas,
      clickCantidadesSubtareasSubordinados,
      clickGraficoEmpleadoSubordinado,
      // otro
      modosAsignacionTrabajo,
      tipoFiltroSubordinados,
      ordenarEmpleados,
      subtareasFiltradas,
      subtareasSubordinados,
      subtareasEmpleadoSubordinado,
      subtareas,
      cantidadTareasActivas,
      cantidadTareasFinalizadas,
      cantidadSubtareasAgendadas,
      cantidadSubtareasPausadas,
      cantidadSubtareasSuspendidas,
      cantidadSubtareasCanceladas,
      cantidadSubtareasRealizadas,
      cantidadSubtareasFinalizadas,
      totalSubtareas,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      modalesSubtarea,
      mixinSubtarea,
      //--
      v$,
      filtro,
      optionsPie,
      mostrarTitulosSeccion,
      optionsLine,
      consultar,
      graficoLineaTiempoSubtareasFinalizadasCoordinador,
      graficoLineaTiempoSubtareasRealizadasCoordinador,
      cantidadSubtareasEjecutadas,
      cantidadesPorEstadosSubtareas,
      cantidadesPorEstadosSubtareasBar,
      // botones
      botonVer,
      btnSeguimiento,
      clickGraficoLineaTiempo,
      opcionesFiltroGrupoEmpleado,
      consultarGrupo,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      mostrarSeccionGrupo,
      mostrarSeccionEmpleado,
      consultarDesdeFechas,
      graficos,
      listadoFiltrado,
      clickGraficoEstadosGrupo,
      limpiarDatosConsultados,
      graficosCoordinadorSubordinadosPorGrupo,
      graficosCoordinadorSubordinadosPorCoordinador,
      mostrarCantidades,
      mostrarInactivos,
      checkMostrarInactivos,
      mostrarPowerBI,
      checkmostrarPowerBI,
      tipoDashboard,
      tiposDashboard,
      SISTEMA,
      APPENATE
    }
  }
})
