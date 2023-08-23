// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { acciones, accionesTabla, estadosTrabajos, tiposJornadas } from 'config/utils'
import { computed, defineComponent, reactive, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { modosAsignacionTrabajo } from 'config/tareas.utils'

// Componentes
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { formatearFechaSeparador, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { configuracionColumnasSubtarea } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { estadosTickets } from 'config/tickets.utils'
import datalabels from 'chartjs-plugin-datalabels'
import { useSubtareaStore } from 'stores/subtarea'
import { endpoints } from 'config/api'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad },
  setup() {
    ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale, ArcElement, datalabels)
    ChartJS.defaults.plugins.datalabels = {
      display: true,
      align: 'center',
      backgroundColor: '#eee',
      color: '#fff',
      borderRadius: 4,
      opacity: .8,
      font: {
        size: 10,
      },
    };

    const subtareaStore = useSubtareaStore()
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardTareaController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,departamento_id,responsable_departamento',
            estado: 1
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

    const ticketsPorDepartamentoEstadoAsignado = ref([])
    const ticketsPorDepartamentoEstadoReasignado = ref([])
    const ticketsPorDepartamentoEstadoEjecutando = ref([])
    const ticketsPorDepartamentoEstadoPausado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSolucionado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucion = ref([])
    const ticketsPorDepartamentoEstadoCalificado = ref([])

    const cantidadesTicketsSolicitadosPorDepartamentoBar = ref()
    const cantidadesTicketsRecibidosPorDepartamentoBar = ref()
    const ticketsPorDepartamentoEstadoAsignadoBar = ref()
    const ticketsPorDepartamentoEstadoReasignadoBar = ref()
    const ticketsPorDepartamentoEstadoEjecutandoBar = ref()
    const ticketsPorDepartamentoEstadoPausadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar = ref()
    const ticketsPorDepartamentoEstadoCalificadoBar = ref()

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
        position: 'bottom' // Cambia la posición según tus necesidades
      }
    }

    const optionsVertical = {
      responsive: true,
    }

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 32,
          top: 32,
        },
        margin: {
          top: 32,
        }
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          color: function (context) {
            return context.dataset.backgroundColor;
          },
          font: function (context) {
            var w = context.chart.width;
            return {
              size: w < 512 ? 12 : 14,
              weight: 'bold',
            };
          },
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex] + ': ' + value
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

          subtareas.value = result.subtareas

          cantidadTareasActivas.value = result.cantidadTareasActivas
          cantidadTareasFinalizadas.value = result.cantidadTareasFinalizadas
          cantidadSubtareasAgendadas.value = result.cantidadSubtareasAgendadas
          cantidadSubtareasEjecutadas.value = result.cantidadSubtareasEjecutadas
          cantidadSubtareasPausadas.value = result.cantidadSubtareasPausadas
          cantidadSubtareasSuspendidas.value = result.cantidadSubtareasSuspendidas
          cantidadSubtareasCanceladas.value = result.cantidadSubtareasCanceladas
          cantidadSubtareasRealizadas.value = result.cantidadSubtareasRealizadas
          cantidadSubtareasFinalizadas.value = result.cantidadSubtareasFinalizadas

          cantidadesPorEstadosSubtareas.value = result.cantidadesPorEstadosSubtareas
          const labels3 = result.cantidadesPorEstadosSubtareas.map((item) => item.estado)
          const valores3 = result.cantidadesPorEstadosSubtareas.map((item) => item.total_subtareas)
          const colores3 = result.cantidadesPorEstadosSubtareas.map((item) => mapearColor(item.estado))
          cantidadesPorEstadosSubtareasBar.value = mapearDatos(labels3, valores3, 'Cantidades de subtareas por estados', colores3)


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
        case estadosTrabajos.AGENDADO: return '#9fa8da'
        case estadosTrabajos.EJECUTANDO: return '#9fa8da'
        case estadosTrabajos.PAUSADO: return '#78909c'
        case estadosTrabajos.SUSPENDIDO: return '#ffc107'
        case estadosTrabajos.REALIZADO: return '#8bc34a'
        case estadosTrabajos.FINALIZADO: return '#9ba98c'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    function ordenarEmpleadosResponsables() {
      empleadosResponsables.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    return {
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
      ticketsPorDepartamentoEstadoAsignado,
      ticketsPorDepartamentoEstadoReasignado,
      ticketsPorDepartamentoEstadoEjecutando,
      ticketsPorDepartamentoEstadoPausado,
      ticketsPorDepartamentoEstadoFinalizadoSolucionado,
      ticketsPorDepartamentoEstadoFinalizadoSinSolucion,
      ticketsPorDepartamentoEstadoCalificado,
      // Bar
      cantidadesTicketsSolicitadosPorDepartamentoBar,
      cantidadesTicketsRecibidosPorDepartamentoBar,
      cantidadesPorEstadosSubtareasBar,
      ticketsPorDepartamentoEstadoAsignadoBar,
      ticketsPorDepartamentoEstadoReasignadoBar,
      ticketsPorDepartamentoEstadoEjecutandoBar,
      ticketsPorDepartamentoEstadoPausadoBar,
      ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar,
      ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar,
      ticketsPorDepartamentoEstadoCalificadoBar,
      // botones
      botonVer,
      btnSeguimiento,
    }
  },
})
