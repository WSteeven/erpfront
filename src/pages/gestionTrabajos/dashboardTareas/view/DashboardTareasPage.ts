// Dependencias
import { obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { acciones, accionesTabla, estadosTrabajos, rolesSistema } from 'config/utils'
import { computed, defineComponent, reactive, ref } from 'vue'
import { optionsLine, optionsPie } from 'config/graficoGenerico'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { required, requiredIf } from 'shared/i18n-validators'
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
import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { graficarPorGrupoUseCase } from '../applicacion/GraficarPorGrupoUseCase'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { graficarPorCoordinadorUseCase } from '../applicacion/GraficarPorCoordinadorUseCase'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, ModalesEntidad, GraficoGenerico },
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
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

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
            rol: [rolesSistema.coordinador, rolesSistema.coordinadorBackup, rolesSistema.jefe_tecnico],
          }
        },
      })
    })



    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTareaController = new DashboardTareaController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const tipoFiltroSubordinados = ref(modosAsignacionTrabajo.por_grupo)

    // Cantidades
    /*const subtareas: Ref<Subtarea[]> = ref([])
    const subtareasGrupo: Ref<Subtarea[]> = ref([])
    const subtareasEmpleado: Ref<Subtarea[]> = ref([])
    const subtareasSubordinados: Ref<Subtarea[]> = ref([])
    const subtareasEmpleadoSubordinado: Ref<Subtarea[]> = ref([])

    const cantidadTareasActivas = ref()
    const cantidadTareasFinalizadas = ref()
    const cantidadSubtareasAgendadas = ref()
    const cantidadSubtareasEjecutadas = ref()
    const cantidadSubtareasPausadas = ref()
    const cantidadSubtareasSuspendidas = ref()
    const cantidadSubtareasCanceladas = ref()
    const cantidadSubtareasRealizadas = ref()
    const cantidadSubtareasFinalizadas = ref()
    const totalSubtareas = computed(() => {
      return cantidadSubtareasAgendadas.value
        + cantidadSubtareasEjecutadas.value
        + cantidadSubtareasPausadas.value
        + cantidadSubtareasSuspendidas.value
        + cantidadSubtareasCanceladas.value
        + cantidadSubtareasRealizadas.value
        + cantidadSubtareasFinalizadas.value
    })*/

    /*const cantidadesPorEstadosSubtareas = ref([])
    const cantidadesPorEstadosSubtareasBar = ref()

    // Por grupo
    const agendados: Ref<any> = ref([])
    const ejecutados: Ref<any> = ref([])
    const pausados: Ref<any> = ref([])
    const suspendidos: Ref<any> = ref([])
    const cancelados: Ref<any> = ref([])
    const realizados: Ref<any> = ref([])
    const finalizados: Ref<any> = ref([])

    const agendadosBar = ref()
    const ejecutadosBar = ref()
    const pausadosBar = ref()
    const suspendidosBar = ref()
    const canceladosBar = ref()
    const realizadosBar = ref()
    const finalizadosBar = ref()

    // Por empleado
    const agendadosEmpleado: Ref<any> = ref([])
    const ejecutadosEmpleado: Ref<any> = ref([])
    const pausadosEmpleado: Ref<any> = ref([])
    const suspendidosEmpleado: Ref<any> = ref([])
    const canceladosEmpleado: Ref<any> = ref([])
    const realizadosEmpleado: Ref<any> = ref([])
    const finalizadosEmpleado: Ref<any> = ref([])

    const agendadosEmpleadoBar = ref()
    const ejecutadosEmpleadoBar = ref()
    const pausadosEmpleadoBar = ref()
    const suspendidosEmpleadoBar = ref()
    const canceladosEmpleadoBar = ref()
    const realizadosEmpleadoBar = ref()
    const finalizadosEmpleadoBar = ref() */

    // Tabs
    const opcionesSubordinado = {
      subordinadosGrafico: 'subordinadosGrafico',
      subordinadosListado: 'subordinadosListado',
      subordinadosEmpleadoListado: 'subordinadosEmpleadoListado',
    }

    const opcionesCoordinadorConsultado = {
      coordinadorConsultadoGrafico: 'coordinadorConsultadoGrafico',
      coordinadorConsultadoListado: 'coordinadorConsultadoListado',
    }

    const opcionesGrupo = {
      grupoGrafico: 'grupoGrafico',
      grupoListado: 'grupoListado',
    }

    const tabsCoordinadorConsultado = ref(opcionesCoordinadorConsultado.coordinadorConsultadoGrafico)
    const tabsSubordinados = ref(opcionesSubordinado.subordinadosGrafico)
    const tabsGrupo = ref(opcionesGrupo.grupoGrafico)

    const opcionesFiltroGrupoEmpleado = {
      porGrupo: 'POR GRUPO',
      porEmpleado: 'POR EMPLEADO',
    }

    const mostrarSeccionGrupo = computed(() => filtro.grupo_empleado === opcionesFiltroGrupoEmpleado.porGrupo)
    const mostrarSeccionEmpleado = computed(() => filtro.grupo_empleado === opcionesFiltroGrupoEmpleado.porEmpleado)

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
      grupo: { requiredIf: requiredIf(() => mostrarSeccionGrupo.value) },
    }

    const v$ = useVuelidate(reglas, filtro)

    /**********
    * Modales
    **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()
    const { execute, graficos, seleccionarEstado, listadoFiltrado, resetearDatos } = graficarPorGrupoUseCase(dashboardTareaController, filtro)
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
      mostrarCantidades,
    } = graficarPorCoordinadorUseCase(dashboardTareaController, filtro, modalesSubtarea)

    const { btnSeguimiento } = useBotonesTablaSubtarea(subtareas, modalesSubtarea)
    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    /*********
   * Filtros
   **********/
    const {
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTarea(listadosAuxiliares)

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
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
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
        tabsCoordinadorConsultado.value = opcionesCoordinadorConsultado.coordinadorConsultadoListado
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
    }
  },
})
