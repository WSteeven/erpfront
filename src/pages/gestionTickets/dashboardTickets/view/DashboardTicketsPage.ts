// Dependencias
import { configuracionColumnasDashboardTicket } from '../domain/configuracionColumnasDashboardTicket'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { required } from '@vuelidate/validators'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TableView from 'components/tables/view/TableView.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { DashboardTicketController } from '../infraestructure/DashboardTicketsController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { estadosTickets } from 'config/tickets.utils'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie },
  setup() {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardTicketController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
      })
    })

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTicketController = new DashboardTicketController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)

    const ticketsConSolucion = ref([])
    const cantTicketsCreados = ref()
    const cantTicketsRecibidos = ref()
    const cantTicketsFinalizadosSolucionados = ref()
    const cantTicketsFinalizadosSinSolucion = ref()

    const cantidadesTicketsSolicitadosPorDepartamento = ref([])
    const cantidadesTicketsRecibidosPorDepartamento = ref([])
    const ticketsPorEstado = ref([])

    const cantidadesTicketsSolicitadosPorDepartamentoBar = ref()
    const cantidadesTicketsRecibidosPorDepartamentoBar = ref()
    const ticketsPorEstadoBar = ref()

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

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /*********
   * Filtros
   **********/
    const empleados = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    filtro.fecha_inicio = obtenerFechaActual()//.substring(3)

    async function consultar() {
      if (await v$.value.$validate()) {

        cargando.activar()
        const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado })
        // console.log(result)
        ticketsConSolucion.value = result.tiemposTicketsFinalizados
        cantTicketsCreados.value = result.cantTicketsCreados
        cantTicketsRecibidos.value = result.cantTicketsRecibidos
        cantTicketsFinalizadosSolucionados.value = result.cantTicketsFinalizadosSolucionados
        cantTicketsFinalizadosSinSolucion.value = result.cantTicketsFinalizadosSinSolucion

        cantidadesTicketsSolicitadosPorDepartamento.value = result.cantidadesTicketsSolicitadosPorDepartamento
        const labels = result.cantidadesTicketsSolicitadosPorDepartamento.map((item) => item.nombre)
        const valores = result.cantidadesTicketsSolicitadosPorDepartamento.map((item) => item.total)
        cantidadesTicketsSolicitadosPorDepartamentoBar.value = mapearDatos(labels, valores, 'Cantidades de tickets solicitados por departamento')

        cantidadesTicketsRecibidosPorDepartamento.value = result.cantidadesTicketsRecibidosPorDepartamento
        const labels2 = result.cantidadesTicketsRecibidosPorDepartamento.map((item) => item.nombre)
        const valores2 = result.cantidadesTicketsRecibidosPorDepartamento.map((item) => item.total)
        cantidadesTicketsRecibidosPorDepartamentoBar.value = mapearDatos(labels2, valores2, 'Cantidades de tickets recibidos por departamento')

        ticketsPorEstado.value = result.ticketsPorEstado
        const labels3 = result.ticketsPorEstado.map((item) => item.estado)
        const valores3 = result.ticketsPorEstado.map((item) => item.total_tickets)
        const colores = result.ticketsPorEstado.map((item) => mapearColor(item.estado))
        ticketsPorEstadoBar.value = mapearDatos(labels3, valores3, 'Cantidades de tickets por estados', colores)
        cargando.desactivar()
      }
    }

    function transposeMatrix(matrix) {
      return matrix[0].map((_, index) => matrix.map(row => row[index]));
    }

    function mapearDatos(labels: [], valores: [], titulo: string, colores?: []) {
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: colores ?? '#666f88',
            label: titulo,
            data: valores,
          }
        ]
      }
    }

    function mapearDatosMultiple(labels: string[], labelsColumns: any, valores: any[][]) {
      return {
        labels: labels,
        datasets: valores.map((item, index) => mapearDatosMultiplesColumnas(labelsColumns[index], item))
      }
    }

    function mapearDatosMultiplesColumnas(labelsColumns: any, data: any[]) {
      return {
        label: labelsColumns.label,
        backgroundColor: labelsColumns.color,
        data,
      }
    }

    function mapearColor(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case estadosTickets.ASIGNADO: return '#78909c'
        case estadosTickets.EJECUTANDO: return '#ffc107'
        case estadosTickets.PAUSADO: return '#616161'
        case estadosTickets.FINALIZADO_SOLUCIONADO: return '#8bc34a'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    return {
      ordenarEmpleados,
      filtrarEmpleados,
      empleados,
      configuracionColumnasDashboardTicket,
      ticketsConSolucion,
      cantTicketsCreados,
      cantTicketsRecibidos,
      cantTicketsFinalizadosSolucionados,
      cantTicketsFinalizadosSinSolucion,
      v$,
      mixin,
      listar,
      listado,
      filtro,
      listadosAuxiliares,
      tiposJornadas,
      options,
      optionsVertical,
      mostrarTitulosSeccion,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultar,
      // Listados
      cantidadesTicketsSolicitadosPorDepartamento,
      cantidadesTicketsRecibidosPorDepartamento,
      ticketsPorEstado,
      // Bar
      cantidadesTicketsSolicitadosPorDepartamentoBar,
      cantidadesTicketsRecibidosPorDepartamentoBar,
      ticketsPorEstadoBar,
    }
  },
})
