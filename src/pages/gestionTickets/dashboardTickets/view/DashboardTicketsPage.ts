// Dependencias
import { configuracionColumnasDashboardTicket } from '../domain/configuracionColumnasDashboardTicket'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { required } from '@vuelidate/validators'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { accionesTabla, departamentos, tiposJornadas } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TableView from 'components/tables/view/TableView.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

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
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTicketStore } from 'stores/ticket'
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad },
  setup() {
    /***********
    * Stores
    ***********/
    const ticketStore = useTicketStore()

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
            campos: 'id,nombres,apellidos,departamento_id,responsable_departamento',
            estado: 1
          }
        },
      })
    })

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTicketController = new DashboardTicketController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const modales = new ComportamientoModalesTicketAsignado()
    const empleadoResponsableDepartamento = ref()
    const esResponsableDepartamento = ref(false)

    const ticketsConSolucion = ref([])
    const cantTicketsCreados = ref()
    const cantTicketsRecibidos = ref()
    const cantTicketsReasignados = ref()
    const cantTicketsAsignados = ref()
    const cantTicketsEjecutados = ref()
    const cantTicketsPausados = ref()
    const cantTicketsCalificadosResponsable = ref()
    const cantTicketsCalificadosSolicitante = ref()
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

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom', // Cambia la posición según tus necesidades
      },
    }

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /***************
     * Botones tabla
     ***************/
    const { btnSeguimiento } = useBotonesTablaTicket(mixin, modales)
    // setFiltrarTickets(filtrarTrabajoAsignado)

    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ticketStore.filaTicket = entidad
        modales.abrirModalEntidad('DetalleTicketAsignadoPage')
      },
    }

    /*********
   * Filtros
   **********/
    const empleados = ref([])
    const empleadosResponsables = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    filtro.fecha_fin = obtenerFechaActual()//.substring(3)

    async function consultar() {

      if (await v$.value.$validate()) {
        const empleadoSeleccionado: Empleado = empleados.value.filter((emp: Empleado) => emp.id === filtro.empleado)[0]
        console.log(empleadoSeleccionado.departamento_id)
        esResponsableDepartamento.value = empleadoSeleccionado.responsable_departamento
        departamento = empleadoSeleccionado.departamento_id
        cargando.activar()
        const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado })
        await obtenerResponsables()
        // console.log(result)
        ticketsConSolucion.value = result.tiemposTicketsFinalizados
        cantTicketsCreados.value = result.cantTicketsCreados
        cantTicketsRecibidos.value = result.cantTicketsRecibidos
        cantTicketsReasignados.value = result.cantTicketsReasignados
        cantTicketsAsignados.value = result.cantTicketsAsignados
        cantTicketsEjecutados.value = result.cantTicketsEjecutados
        cantTicketsPausados.value = result.cantTicketsPausados
        cantTicketsFinalizadosSolucionados.value = result.cantTicketsFinalizadosSolucionados
        cantTicketsFinalizadosSinSolucion.value = result.cantTicketsFinalizadosSinSolucion
        cantTicketsCalificadosResponsable.value = result.cantTicketsCalificadosResponsable
        cantTicketsCalificadosSolicitante.value = result.cantTicketsCalificadosSolicitante

        cantidadesTicketsSolicitadosPorDepartamento.value = result.cantidadesTicketsSolicitadosPorDepartamento
        const labels = result.cantidadesTicketsSolicitadosPorDepartamento.map((item) => item.nombre)
        const valores = result.cantidadesTicketsSolicitadosPorDepartamento.map((item) => item.total)
        const colores1 = result.cantidadesTicketsSolicitadosPorDepartamento.map((item) => mapearColorDepartamentos(item.nombre))
        cantidadesTicketsSolicitadosPorDepartamentoBar.value = mapearDatos(labels, valores, 'Cantidades de tickets creados a los departamentos', colores1)

        cantidadesTicketsRecibidosPorDepartamento.value = result.cantidadesTicketsRecibidosPorDepartamento
        const labels2 = result.cantidadesTicketsRecibidosPorDepartamento.map((item) => item.nombre)
        const valores2 = result.cantidadesTicketsRecibidosPorDepartamento.map((item) => item.total)
        const colores2 = result.cantidadesTicketsRecibidosPorDepartamento.map((item) => mapearColorDepartamentos(item.nombre))
        cantidadesTicketsRecibidosPorDepartamentoBar.value = mapearDatos(labels2, valores2, 'Cantidades de tickets recibidos por los departamentos', colores2)

        ticketsPorEstado.value = result.ticketsPorEstado
        const labels3 = result.ticketsPorEstado.map((item) => item.estado)
        const valores3 = result.ticketsPorEstado.map((item) => item.total_tickets)
        const colores3 = result.ticketsPorEstado.map((item) => mapearColor(item.estado))
        ticketsPorEstadoBar.value = mapearDatos(labels3, valores3, 'Cantidades de tickets por estados', colores3)

        if (filtro.empleado) {
          empleadoResponsableDepartamento.value = filtro.empleado
          obtenerTicketsEmpleadoResponsable(filtro.empleado)
        }
        cargando.desactivar()
      }
    }

    const ticketsEmpleadoResponsable = ref([])
    let departamento
    async function obtenerTicketsEmpleadoResponsable(responsable_id: number) {
      const controller = new TicketController()
      ticketsEmpleadoResponsable.value = (await controller.listar({ responsable_id })).result
    }

    async function obtenerResponsables() {
      cargarVista(async () => {
        await obtenerListados({
          empleadosResp: {
            controller: new EmpleadoController(),
            params: { departamento_id: departamento, campos: 'id,nombres,apellidos' },
          },
        })
        empleadosResponsables.value = listadosAuxiliares.empleadosResp
      })
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
        case estadosTickets.ASIGNADO: return '#9fa8da'
        case estadosTickets.REASIGNADO: return '#78909c'
        case estadosTickets.EJECUTANDO: return '#ffc107'
        case estadosTickets.PAUSADO: return '#616161'
        case estadosTickets.FINALIZADO_SOLUCIONADO: return '#8bc34a'
        case estadosTickets.FINALIZADO_SIN_SOLUCION: return '#9ba98c'
      }
    }

    function mapearColorDepartamentos(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case departamentos.xtrim_cuenca: return '#9fa8da'
        case departamentos.medico: return '#78909c'
        case departamentos.activos_fijos: return '#ffc107'
        case departamentos.gerencia: return '#616161'
        case departamentos.proyectos: return '#8bc34a'
        case departamentos.recursos_humanos: return '#9ba98c'
        case departamentos.tecnico: return '#1de48d'
        case departamentos.contabilidad: return '#db4cb2'
        case departamentos.informatica: return '#1ac9e6'
        case departamentos.bodega: return '#eb548c'
        case departamentos.sso: return '#eabd3b'
        case departamentos.vehiculos: return '#e7e34e'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    return {
      ordenarEmpleados,
      filtrarEmpleados,
      empleados,
      empleadosResponsables,
      configuracionColumnasDashboardTicket,
      ticketsConSolucion,
      cantTicketsCreados,
      cantTicketsRecibidos,
      cantTicketsReasignados,
      cantTicketsAsignados,
      cantTicketsCalificadosResponsable,
      cantTicketsCalificadosSolicitante,
      cantTicketsEjecutados,
      cantTicketsPausados,
      cantTicketsFinalizadosSolucionados,
      cantTicketsFinalizadosSinSolucion,
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
      modales,
      empleadoResponsableDepartamento,
      obtenerTicketsEmpleadoResponsable,
      ticketsEmpleadoResponsable,
      esResponsableDepartamento,
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
      // botones
      botonVer,
      btnSeguimiento,
    }
  },
})
