// Dependencias
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { formatearFechaSeparador, generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { acciones, accionesTabla, estadosTrabajos, tiposJornadas } from 'config/utils'
import { Ref, computed, defineComponent, reactive, ref } from 'vue'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { configuracionColumnasSubtarea } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { estadosTickets } from 'config/tickets.utils'
import { useSubtareaStore } from 'stores/subtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
  setup() {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
     ********/
    // mixin reporte subtareas realizadas
    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardTareaController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    // mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado: subtareasResponsable } = mixinSubtarea.useReferencias()
    // const { listar: listarSubtareas } = mixinSubtarea.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
            // rol: rolesSistema.coordinador + ', ' + rolesSistema.coordinadorBackup,
          }
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
      })

      grupos.value = listadosAuxiliares.grupos
    })

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTareaController = new DashboardTareaController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const empleadoResponsable = ref()
    const esResponsableDepartamento = ref(false)
    const ticketsEmpleadoResponsable = ref([])
    const tipoFiltroSubordinados = ref(modosAsignacionTrabajo.por_grupo)
    const grupo = ref()

    // Cantidades
    const subtareas = ref([])

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
    })

    const cantidadesPorEstadosSubtareas = ref([])
    const cantidadesPorEstadosSubtareasBar = ref()

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

    // Tabs
    const tabsCoordinadorConsultado = ref('coordinadorConsultadoGrafico')

    filtro.fecha_fin = obtenerFechaActual()

    const options = {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      },
      legend: {
        display: true,
        position: 'bottom',
      }
    }

    const optionsVertical = {
      responsive: true,
    }

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 32,
      },
      elements: {
        arc: {
          borderWidth: 0,
        }
      },
      plugins: {
        legend: {
          position: 'right',
        },
        datalabels: {
          align: 'end',
          anchor: 'end',
          color: '#fff',
          backgroundColor: function (context) {
            return context.dataset.backgroundColor
          },
          font: function (context) {
            var w = context.chart.width
            return {
              size: w < 512 ? 10 : 12,
            }
          },
          formatter: function (value, context) {
            return value ? context.chart.data.labels[context.dataIndex] + ': (' + value + ')' : null
          }
        }
      },
    }

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /**********
    * Modales
    **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()
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
    } = useFiltrosListadosTarea(listadosAuxiliares)

    const empleados = ref([])
    const empleadosResponsables = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    function filtrarEmpleadosResponsables(val, update) {
      if (val === '') update(() => empleadosResponsables.value = listadosAuxiliares.empleadosResp.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleadosResponsables.value = listadosAuxiliares.empleadosResp.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    async function consultar() {

      if (await v$.value.$validate()) {
        try {

          cargando.activar()

          const { result } = await dashboardTareaController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado })
          await obtenerResponsables()

          subtareas.value = result.subtareasCoordinador

          // Cantidades
          cantidadTareasActivas.value = result.cantidadTareasActivas
          cantidadTareasFinalizadas.value = result.cantidadTareasFinalizadas
          cantidadSubtareasAgendadas.value = result.cantidadSubtareasAgendadas
          cantidadSubtareasEjecutadas.value = result.cantidadSubtareasEjecutadas
          cantidadSubtareasPausadas.value = result.cantidadSubtareasPausadas
          cantidadSubtareasSuspendidas.value = result.cantidadSubtareasSuspendidas
          cantidadSubtareasCanceladas.value = result.cantidadSubtareasCanceladas
          cantidadSubtareasRealizadas.value = result.cantidadSubtareasRealizadas
          cantidadSubtareasFinalizadas.value = result.cantidadSubtareasFinalizadas

          // Graficos del coordinador consultado
          cantidadesPorEstadosSubtareas.value = result.cantidadesPorEstadosSubtareas
          const labels3 = result.cantidadesPorEstadosSubtareas.map((item) => item.estado)
          const valores3 = result.cantidadesPorEstadosSubtareas.map((item) => item.total_subtareas)
          const colores3 = result.cantidadesPorEstadosSubtareas.map((item) => mapearColor(item.estado))
          cantidadesPorEstadosSubtareasBar.value = mapearDatos(labels3, valores3, 'Cantidad de subtareas', colores3)

          // Graficos por grupo
          const subtareasPorGrupo = result.cantidadesSubtareasPorGrupo
          agendados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.AGENDADO)
          const labelsAgendado = agendados.value.map((item) => item.nombre)
          const valoresAgendado = agendados.value.map((item) => item.total_subtareas)
          const coloresAgendado = agendados.value.map(() => generarColorAzulPastelClaro())
          agendadosBar.value = mapearDatos(labelsAgendado, valoresAgendado, 'Cantidad de subtareas', coloresAgendado)

          ejecutados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.EJECUTANDO)
          const labelsEjecutando = ejecutados.value.map((item) => item.nombre)
          const valoresEjecutando = ejecutados.value.map((item) => item.total_subtareas)
          const coloresEjecutando = ejecutados.value.map(() => generarColorAzulPastelClaro())
          ejecutadosBar.value = mapearDatos(labelsEjecutando, valoresEjecutando, 'Cantidad de subtareas', coloresEjecutando)

          pausados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.PAUSADO)
          const labelsPausado = pausados.value.map((item) => item.nombre)
          const valoresPausado = pausados.value.map((item) => item.total_subtareas)
          const coloresPausado = pausados.value.map(() => generarColorAzulPastelClaro())
          pausadosBar.value = mapearDatos(labelsPausado, valoresPausado, 'Cantidad de subtareas', coloresPausado)

          suspendidos.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.SUSPENDIDO)
          const labelsSuspendido = suspendidos.value.map((item) => item.nombre)
          const valoresSuspendido = suspendidos.value.map((item) => item.total_subtareas)
          const coloresSuspendido = suspendidos.value.map(() => generarColorAzulPastelClaro())
          suspendidosBar.value = mapearDatos(labelsSuspendido, valoresSuspendido, 'Cantidad de subtareas', coloresSuspendido)

          cancelados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.CANCELADO)
          const labelsCancelado = cancelados.value.map((item) => item.nombre)
          const valoresCancelado = cancelados.value.map((item) => item.total_subtareas)
          const coloresCancelado = cancelados.value.map(() => generarColorAzulPastelClaro())
          canceladosBar.value = mapearDatos(labelsCancelado, valoresCancelado, 'Cantidad de subtareas', coloresCancelado)

          realizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.REALIZADO)
          const labelsRealizado = realizados.value.map((item) => item.nombre)
          const valoresRealizado = realizados.value.map((item) => item.total_subtareas)
          const coloresRealizado = realizados.value.map(() => generarColorAzulPastelClaro())
          realizadosBar.value = mapearDatos(labelsRealizado, valoresRealizado, 'Cantidad de subtareas', coloresRealizado)

          finalizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.FINALIZADO)
          const labelsFinalizado = finalizados.value.map((item) => item.nombre)
          const valoresFinalizado = finalizados.value.map((item) => item.total_subtareas)
          const coloresFinalizado = finalizados.value.map(() => generarColorAzulPastelClaro())
          finalizadosBar.value = mapearDatos(labelsFinalizado, valoresFinalizado, 'Cantidad de subtareas', coloresFinalizado)

        } catch (e) {
          console.log(e)
        } finally {

          cargando.desactivar()
        }
      }
    }

    async function obtenerResponsables() {
      cargarVista(async () => {
        await obtenerListados({
          empleadosResp: {
            controller: new EmpleadoController(),
            params: { jefe_id: filtro.empleado, campos: 'id,nombres,apellidos' },
          },
        })
        empleadosResponsables.value = listadosAuxiliares.empleadosResp
      })
    }

    function mapearDatos(labels: [], valores: [], titulo: string, colores?: []) {
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: colores ?? '#666f88',
            label: titulo,
            data: valores,
          },
        ],
      }
    }

    function mapearColor(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case estadosTrabajos.AGENDADO: return '#f9de8d'
        case estadosTrabajos.EJECUTANDO: return '#ffc107'
        case estadosTrabajos.PAUSADO: return '#78909c'
        case estadosTrabajos.SUSPENDIDO: return '#ec5c64'
        case estadosTrabajos.REALIZADO: return '#9ba98c'
        case estadosTrabajos.FINALIZADO: return '#8bc34a'
        case estadosTrabajos.CANCELADO: return '#c31d25'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    function ordenarEmpleadosResponsables() {
      empleadosResponsables.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    function filtrarSubtareasGrupoPorEstado(subtareasGrupo: any[], estado: string) {
      return subtareasGrupo.filter((item) =>
        item.estado === estado
      )
    }

    async function filtrarSubtareasResponsable(responsable_id: number) {
      if (filtro.fecha_inicio && filtro.fecha_fin) {
        cargando.activar()

        const fechaInicio = formatearFechaSeparador(filtro.fecha_inicio, '/')
        const fechaFin = formatearFechaSeparador(filtro.fecha_fin, '/', { days: 1 })
        const consultaFecha = 'created_at[start]=' + fechaInicio + '&created_at[end]=' + fechaFin

        const consultaParametros = tipoFiltroSubordinados.value === modosAsignacionTrabajo.por_empleado ? 'responsable_id=' + responsable_id : 'grupo_id=' + responsable_id
        // const params = 'coordinador_id=' + filtro.empleado

        const axios = AxiosHttpRepository.getInstance()
        const respuesta: any = await axios.get(axios.getEndpoint(endpoints.subtareas) + '?' + consultaParametros + '&' + consultaFecha)
        subtareasResponsable.value = respuesta.data.results.filter((subtarea: Subtarea) => subtarea.coordinador_id === filtro.empleado)

        cargando.desactivar()
      }
      //
    }

    const subtareasFiltradas = ref([])
    function clickCantidadesPorEstadoSubtareas(data) {
      const { label } = data
      if (label) {
        subtareasFiltradas.value = subtareas.value.filter((subtarea: Subtarea) => subtarea.estado === label)
        tabsCoordinadorConsultado.value = 'coordinadorConsultadoListado'
      }
    }

    return {
      tabsCoordinadorConsultado,
      subtareasFiltradas,
      clickCantidadesPorEstadoSubtareas,
      agendados,
      ejecutados,
      pausados,
      suspendidos,
      cancelados,
      realizados,
      finalizados,
      agendadosBar,
      ejecutadosBar,
      pausadosBar,
      suspendidosBar,
      canceladosBar,
      realizadosBar,
      finalizadosBar,
      // -
      filtrarSubtareasResponsable,
      subtareasResponsable,
      grupos,
      filtrarGrupos,
      grupo,
      modosAsignacionTrabajo,
      tipoFiltroSubordinados,
      ordenarEmpleados,
      ordenarEmpleadosResponsables,
      filtrarEmpleados,
      filtrarEmpleadosResponsables,
      empleados,
      empleadosResponsables,
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
      cantidadSubtareasEjecutadas,
      configuracionColumnasTicket,
      v$,
      mixin,
      listar,
      listado,
      filtro,
      listadosAuxiliares,
      tiposJornadas,
      options,
      optionsVertical,
      optionsPie,
      mostrarTitulosSeccion,
      accionesTabla,
      // modales,
      empleadoResponsable,
      ticketsEmpleadoResponsable,
      esResponsableDepartamento,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultar,
      // Listados
      cantidadesPorEstadosSubtareas,
      // Bar
      cantidadesPorEstadosSubtareasBar,
      // botones
      botonVer,
      btnSeguimiento,
    }
  },
})
