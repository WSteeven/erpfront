// Dependencias
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { optionsPie, optionsLine } from 'config/graficoGenerico'
import { required, requiredIf } from 'shared/i18n-validators'
import { accionesTabla, maskFecha, tiposJornadas } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { estadosTickets } from 'config/tickets.utils'
import { useTicketStore } from 'stores/ticket'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'

// Logica y controladores
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { DashboardTicketController } from '../infraestructure/DashboardTicketsController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
  setup() {
    /***********
    * Stores
    ***********/
    const ticketStore = useTicketStore()

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
            estado: 1,
          }
        },
        departamentos: new DepartamentoController(),
      })

      departamentos.value = listadosAuxiliares.departamentos
    })

    const { promptItems } = useNotificaciones()

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTicketController = new DashboardTicketController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && (filtro.empleado || filtro.departamento))
    const modales = new ComportamientoModalesTicketAsignado()
    const empleadoResponsableDepartamento = ref()
    const esResponsableDepartamento = ref(false)
    const ticketsEmpleadoResponsable = ref([])
    const tabsTickets = ref('creados')

    // Cantidades
    const ticketsConSolucion = ref([])
    const cantTicketsCreados = ref()
    const cantTicketsCreadosParaMi = ref()
    const cantTicketsCreadosInternos = ref()
    const cantTicketsCreadosADepartamentos = ref()
    const cantTicketsRecibidos = ref()
    const cantTicketsReasignados = ref()
    const cantTicketsAsignados = ref()
    const cantTicketsEjecutados = ref()
    const cantTicketsCancelados = ref()
    const cantTicketsRechazados = ref()
    const cantTicketsCanceladosPorMi = ref()
    const cantTicketsPausados = ref()
    const cantTicketsCalificadosResponsable = ref()
    const cantTicketsCalificadosSolicitante = ref()
    const cantTicketsFinalizadosSolucionados = ref()
    const cantTicketsFinalizadosSinSolucion = ref()
    const cantidadesTicketsSolicitadosPorDepartamento = ref([])
    const cantidadesTicketsRecibidosPorDepartamento = ref([])
    const ticketsPorEstado: any = ref([])
    const ticketsPorDepartamentoEstadoAsignado = ref([])
    const ticketsPorDepartamentoEstadoRechazado = ref([])
    const ticketsPorDepartamentoEstadoReasignado = ref([])
    const ticketsPorDepartamentoEstadoEjecutando = ref([])
    const ticketsPorDepartamentoEstadoPausado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSolucionado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucion = ref([])
    const ticketsPorDepartamentoEstadoCalificado = ref([])

    // Listados tiempos
    const listados = reactive({
      ticketsPorDepartamentoEstadoFinalizadoSolucionado: [],
      tiempoPromedio: null,
      totalTicketsFinalizados: null,
      // tiemposTicketsFinalizadosPorDepartamento: [],
    })

    // Graficos
    const cantidadesTicketsSolicitadosPorDepartamentoBar = ref()
    const cantidadesTicketsRecibidosPorDepartamentoBar = ref()
    const ticketsPorEstadoBar = ref()
    const ticketsPorDepartamentoEstadoAsignadoBar = ref()
    const ticketsPorDepartamentoEstadoRechazadoBar = ref()
    const ticketsPorDepartamentoEstadoReasignadoBar = ref()
    const ticketsPorDepartamentoEstadoEjecutandoBar = ref()
    const ticketsPorDepartamentoEstadoPausadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar = ref()
    const ticketsPorDepartamentoEstadoCalificadoBar = ref()

    // -- Graficos tiempos
    const promedioTiemposLine = ref()

    const opcionesDepartamento = {
      departamentoGrafico: 'departamentoGrafico',
      departamentoListado: 'departamentoListado',
    }

    const opcionesEmpleado = {
      empleadoGrafico: 'empleadoGrafico',
      empleadoListado: 'empleadoListado',
    }

    const categoriaGraficosEmpleado = {
      ESTADO_ACTUAL: 'ESTADO_ACTUAL',
      CREADOS_A_DEPARTAMENTOS: 'CREADOS_A_DEPARTAMENTOS',
      ASIGNADOS_POR_DEPARTAMENTOS: 'ASIGNADOS_POR_DEPARTAMENTOS',
    }

    const opcionesFiltroDepartamentoEmpleado = {
      porDepartamento: 'POR DEPARTAMENTO',
      porEmpleado: 'POR EMPLEADO',
    }

    const tabsDepartamento = ref(opcionesDepartamento.departamentoGrafico)
    const tabsEmpleado = ref(opcionesEmpleado.empleadoGrafico)

    const mostrarSeccionDepartamento = computed(() => filtro.departamento_empleado === opcionesFiltroDepartamentoEmpleado.porDepartamento)
    const mostrarSeccionEmpleado = computed(() => filtro.departamento_empleado === opcionesFiltroDepartamentoEmpleado.porEmpleado)

    /*******
     * Init
     *******/
    filtro.departamento_empleado = opcionesFiltroDepartamentoEmpleado.porEmpleado
    // console.log(optionsLine)


    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { requiredIf: requiredIf(() => mostrarSeccionEmpleado.value) },
      departamento: { requiredIf: requiredIf(() => mostrarSeccionDepartamento.value) },
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
        modales.abrirModalEntidad('DetalleCompletoTicket')
      },
    }

    /*********
   * Filtros
   **********/
    const empleadosResponsables = ref([])


    const {empleados, filtrarEmpleados,
      departamentos,
      filtrarDepartamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    filtro.fecha_fin = obtenerFechaActual(maskFecha)

    /****************
     * Observadores
     ****************/
    watchEffect(() => {
      switch (filtro.departamento_empleado) {
        case opcionesFiltroDepartamentoEmpleado.porEmpleado:
          filtro.departamento = null
          break
        case opcionesFiltroDepartamentoEmpleado.porDepartamento:
          filtro.empleado = null
          break
      }
    })

    /*************
     * Funciones
     *************/
    const reporteExcel = async () => {
      listar({
        export: 'xlsx',
        titulo: `reporte_tickets_${filtro.fecha_inicio}-${filtro.fecha_fin}`,
        'created_at[start]': filtro.fecha_inicio,
        'created_at[end]': filtro.fecha_fin,
        'responsable_id': filtro.empleado,
        'departamento_id': filtro.departamento,
        'f_params[orderBy][field]': 'id',
        'f_params[orderBy][type]': 'DESC',
      })
    }

    async function consultar() {

      if (await v$.value.$validate()) {
        try {

          /* const empleadoSeleccionado: Empleado = empleados.value.filter((emp: Empleado) => emp.id === filtro.empleado)[0]

          esResponsableDepartamento.value = empleadoSeleccionado.responsable_departamento
          departamento = empleadoSeleccionado.departamento_id
          filtro.departamento = empleadoSeleccionado.departamento_id */
          cargando.activar()

          const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado }) //, departamento_responsable_id: departamento })

          ticketsConSolucion.value = result.tiemposTicketsFinalizados
          cantTicketsCreados.value = result.cantTicketsCreados
          cantTicketsCreadosParaMi.value = result.cantTicketsCreadosParaMi
          cantTicketsCreadosInternos.value = result.cantTicketsCreadosInternos
          cantTicketsCreadosADepartamentos.value = result.cantTicketsCreadosADepartamentos
          cantTicketsRecibidos.value = result.cantTicketsRecibidos
          cantTicketsReasignados.value = result.cantTicketsReasignados
          cantTicketsAsignados.value = result.cantTicketsAsignados
          cantTicketsEjecutados.value = result.cantTicketsEjecutados
          cantTicketsCancelados.value = result.cantTicketsCancelados
          cantTicketsRechazados.value = result.cantTicketsRechazados
          cantTicketsCanceladosPorMi.value = result.cantTicketsCanceladosPorMi
          cantTicketsPausados.value = result.cantTicketsPausados
          cantTicketsFinalizadosSolucionados.value = result.cantTicketsFinalizadosSolucionados
          cantTicketsFinalizadosSinSolucion.value = result.cantTicketsFinalizadosSinSolucion
          cantTicketsCalificadosResponsable.value = result.cantTicketsCalificadosResponsable
          cantTicketsCalificadosSolicitante.value = result.cantTicketsCalificadosSolicitante

          // Grafico empleado consultado
          ticketsPorEstado.value = result.ticketsPorEstado
          const graficoTicketsPorEstado = contarTicketsEmpleado(result.ticketsPorEstado)
          // console.log(graficoTicketsPorEstado)
          const labels3 = graficoTicketsPorEstado.map((item) => item.estado)
          const valores3 = graficoTicketsPorEstado.map((item) => item.total_tickets)
          const colores3 = graficoTicketsPorEstado.map((item) => mapearColor(item.estado))
          ticketsPorEstadoBar.value = mapearDatos(labels3, valores3, 'Cantidad de tickets', colores3)

          cantidadesTicketsSolicitadosPorDepartamento.value = result.ticketsCreadosADepartamentos
          const graficoTicketsCreadosDepartamento = contarTicketsDepartamento(result.ticketsCreadosADepartamentos)
          const labels = graficoTicketsCreadosDepartamento.map((item) => item.departamento_responsable)
          const valores = graficoTicketsCreadosDepartamento.map((item) => item.total_tickets)
          const colores1 = graficoTicketsCreadosDepartamento.map((item) => generarColorAzulPastelClaro()) //mapearColorDepartamentos(item.departamento_responsable))
          cantidadesTicketsSolicitadosPorDepartamentoBar.value = mapearDatos(labels, valores, 'Cantidad de tickets creados a los departamentos', colores1)

          cantidadesTicketsRecibidosPorDepartamento.value = result.ticketsRecibidosPorDepartamentos
          const graficoTicketsRecibidosDepartamento = contarTicketsDepartamentoSolicitante(result.ticketsRecibidosPorDepartamentos)
          const labels2 = graficoTicketsRecibidosDepartamento.map((item) => item.departamento_solicitante)
          const valores2 = graficoTicketsRecibidosDepartamento.map((item) => item.total_tickets)
          const colores2 = graficoTicketsRecibidosDepartamento.map((item) => generarColorAzulPastelClaro()) //mapearColorDepartamentos(item.departamento_solicitante))
          cantidadesTicketsRecibidosPorDepartamentoBar.value = mapearDatos(labels2, valores2, 'Cantidad de tickets recibidos por los departamentos', colores2)

          // Tiempos
          // const tiemposTicketsFinalizadosPorDepartamento = tiemposTicketsFinalizadosPorDepartamento
          // listados.tiemposTicketsFinalizadosPorDepartamento = result.tiemposTicketsFinalizadosPorDepartamento
          console.log('10')
        } catch (e) {
          console.log(e)
        } finally {

          cargando.desactivar()
        }
      }
    }

    async function consultarDepartamento() {
      if (await v$.value.$validate()) {
        cargando.activar()

        try {

          const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, departamento_responsable_id: filtro.departamento })
          // console.log(result)

          // Grafico de pastel
          // Graficos estadisticos del empleado
          ticketsPorDepartamentoEstadoAsignado.value = await result.ticketsPorDepartamentoEstadoAsignado
          const graficoTicketsPorDepartamentoEstadoAsignado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoAsignado) // <--
          const labels4 = graficoTicketsPorDepartamentoEstadoAsignado.map((item) => item.responsable)
          const valores4 = graficoTicketsPorDepartamentoEstadoAsignado.map((item) => item.total_tickets)
          const colores4 = graficoTicketsPorDepartamentoEstadoAsignado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoAsignadoBar.value = mapearDatos(labels4, valores4, 'Cantidad de tickets del departamento con filtro por estado', colores4)

          ticketsPorDepartamentoEstadoRechazado.value = await result.ticketsPorDepartamentoEstadoRechazado
          const graficoTicketsPorDepartamentoEstadoRechazado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoRechazado) // <--
          const labels12 = graficoTicketsPorDepartamentoEstadoRechazado.map((item) => item.responsable)
          const valores12 = graficoTicketsPorDepartamentoEstadoRechazado.map((item) => item.total_tickets)
          const colores12 = graficoTicketsPorDepartamentoEstadoRechazado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoRechazadoBar.value = mapearDatos(labels12, valores12, 'Cantidad de tickets del departamento con filtro por estado', colores12)

          ticketsPorDepartamentoEstadoReasignado.value = result.ticketsPorDepartamentoEstadoReasignado
          const graficoTicketsPorDepartamentoEstadoReasignado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoReasignado)
          const labels5 = graficoTicketsPorDepartamentoEstadoReasignado.map((item) => item.responsable)
          const valores5 = graficoTicketsPorDepartamentoEstadoReasignado.map((item) => item.total_tickets)
          const colores5 = graficoTicketsPorDepartamentoEstadoReasignado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoReasignadoBar.value = mapearDatos(labels5, valores5, 'Cantidad de tickets del departamento con filtro por estado', colores5)

          ticketsPorDepartamentoEstadoEjecutando.value = result.ticketsPorDepartamentoEstadoEjecutando
          const graficoTicketsPorDepartamentoEstadoEjecutando = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoEjecutando)
          const labels6 = graficoTicketsPorDepartamentoEstadoEjecutando.map((item) => item.responsable)
          const valores6 = graficoTicketsPorDepartamentoEstadoEjecutando.map((item) => item.total_tickets)
          const colores6 = graficoTicketsPorDepartamentoEstadoEjecutando.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoEjecutandoBar.value = mapearDatos(labels6, valores6, 'Cantidad de tickets del departamento con filtro por estado', colores6)

          ticketsPorDepartamentoEstadoPausado.value = result.ticketsPorDepartamentoEstadoPausado
          const graficoTicketsPorDepartamentoEstadoPausado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoPausado)
          const labels7 = graficoTicketsPorDepartamentoEstadoPausado.map((item) => item.responsable)
          const valores7 = graficoTicketsPorDepartamentoEstadoPausado.map((item) => item.total_tickets)
          const colores7 = graficoTicketsPorDepartamentoEstadoPausado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoPausadoBar.value = mapearDatos(labels7, valores7, 'Cantidad de tickets del departamento con filtro por estado', colores7)

          listados.ticketsPorDepartamentoEstadoFinalizadoSolucionado = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado
          ticketsPorDepartamentoEstadoFinalizadoSolucionado.value = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado
          const graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoFinalizadoSolucionado)
          const labels8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.responsable)
          const valores8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.total_tickets)
          const colores8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar.value = mapearDatos(labels8, valores8, 'Cantidad de tickets del departamento con filtro por estado', colores8)

          ticketsPorDepartamentoEstadoFinalizadoSinSolucion.value = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion
          const graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion)
          const labels9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.responsable)
          const valores9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.total_tickets)
          const colores9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar.value = mapearDatos(labels9, valores9, 'Cantidad de tickets del departamento con filtro por estado', colores9)

          ticketsPorDepartamentoEstadoCalificado.value = result.ticketsPorDepartamentoEstadoCalificado
          const labels10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.responsable)
          const valores10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.total_tickets)
          const colores10 = result.ticketsPorDepartamentoEstadoCalificado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoCalificadoBar.value = mapearDatos(labels10, valores10, 'Cantidad de tickets del departamento con filtro por estado', colores10)

          // Linea de tiempo
          listados.ticketsPorDepartamentoEstadoFinalizadoSolucionado = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado
          const labels11 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.codigo)
          const valores11 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.tiempo_hasta_finalizar_horas)
          const colores11 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => generarColorAzulPastelClaro())
          promedioTiemposLine.value = mapearDatos(labels11, valores11, 'Tiempo ocupado (h)', colores11)

          listados.tiempoPromedio = result.tiempoPromedio
          listados.totalTicketsFinalizados = result.totalTicketsFinalizados

        } catch (e) {
          console.log(e)
        } finally {

          cargando.desactivar()
        }
      }
    }

    function consultarDesdeFechas() {
      if (mostrarSeccionEmpleado.value) consultar()
      if (mostrarSeccionDepartamento.value) consultarDepartamento()
    }

    function mapearDatos(labels: string[], valores: string[], titulo: string, colores: any[]) {
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: colores,
            label: titulo,
            data: valores,
          },
        ],
      }
    }

    function mapearColor(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case estadosTickets.ASIGNADO: return '#9fa8da'
        case estadosTickets.PENDIENTE: return '#9fa8da'
        case estadosTickets.REASIGNADO: return '#78909c'
        case estadosTickets.EJECUTANDO: return '#ffc107'
        case estadosTickets.PAUSADO: return '#616161'
        case estadosTickets.FINALIZADO_SOLUCIONADO: return '#8bc34a'
        case estadosTickets.FINALIZADO_SIN_SOLUCION: return '#9ba98c'
        case estadosTickets.FINALIZADO: return '#8bc34a'
        case estadosTickets.CANCELADO: return '#c31d25'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    const ticketsPorEstadoListado = ref([])
    function clickGraficoTicketsEmpleado(data, categoriaGrafico: keyof typeof categoriaGraficosEmpleado) {
      const { label } = data
      if (label) {
        switch (categoriaGrafico) {
          case categoriaGraficosEmpleado.ESTADO_ACTUAL:
            ticketsPorEstadoListado.value = ticketsPorEstado.value.filter((ticket: Ticket) => ticket.estado === label)
            // tabsEmpleado.value = opcionesEmpleado.empleadoListado
            break
          case categoriaGraficosEmpleado.CREADOS_A_DEPARTAMENTOS:
            ticketsPorEstadoListado.value = cantidadesTicketsSolicitadosPorDepartamento.value.filter((ticket: Ticket) => ticket.departamento_responsable === label)
            // tabsEmpleado.value = opcionesEmpleado.empleadoListado
            break
          case categoriaGraficosEmpleado.ASIGNADOS_POR_DEPARTAMENTOS:
            ticketsPorEstadoListado.value = cantidadesTicketsRecibidosPorDepartamento.value.filter((ticket: Ticket) => ticket.departamento_solicitante === label)
            break
        }
        tabsEmpleado.value = opcionesEmpleado.empleadoListado
      }
    }

    function clickGraficoTicketsDepartamento(data, estado: keyof typeof estadosTickets) {
      const { label } = data
      if (label) {
        switch (estado) {
          case estadosTickets.ASIGNADO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoAsignado.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.RECHAZADO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoRechazado.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.EJECUTANDO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoEjecutando.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.PAUSADO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoPausado.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.REASIGNADO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoReasignado.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.FINALIZADO_SOLUCIONADO:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoFinalizadoSolucionado.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
          case estadosTickets.FINALIZADO_SIN_SOLUCION:
            ticketsEmpleadoResponsable.value = ticketsPorDepartamentoEstadoFinalizadoSinSolucion.value.filter((ticket: Ticket) => ticket.responsable === label)
            break
        }
        tabsDepartamento.value = opcionesDepartamento.departamentoListado
      }
    }

    function clickGraficoLineaTiempo(data) {
      if (!data.label) return

      const config: CustomActionPrompt = reactive({
        mensaje: 'Seleccione una opción',
        accion: async (opcion) => {
          ticketStore.filaTicket = listados.ticketsPorDepartamentoEstadoFinalizadoSolucionado.filter((ticket: Ticket) => ticket.codigo === data.label)[0]
          switch (opcion) {
            case 'MAS_DETALLES':
              modales.abrirModalEntidad('DetalleCompletoTicket')
              break
            case 'SEGUIMIENTO':
              modales.abrirModalEntidad('SeguimientoTicketPage')
              break
          }
        },
        tipo: 'radio',
        items: [
          {
            label: 'Más detalles',
            value: 'MAS_DETALLES',
          },
          {
            label: 'Seguimiento',
            value: 'SEGUIMIENTO',
          }
        ]
      })
      promptItems(config)
    }

    function contarTicketsEmpleado(tickets: Ticket[]): any[] {
      const conteo = tickets.reduce((acumulador: any, ticket) => {
        const estado = ticket.estado

        const elementoExistente: any = acumulador.find((item: any) => item.estado === estado)

        if (!elementoExistente) acumulador.push({ estado, total_tickets: 1 })
        else elementoExistente.total_tickets++

        return acumulador
      }, [])

      return conteo
    }

    function contarTicketsDepartamento(tickets: Ticket[]): any[] {
      const conteo = tickets.reduce((acumulador: any, ticket) => {
        const departamento_responsable = ticket.departamento_responsable

        if (departamento_responsable) {
          const elementoExistente: any = acumulador.find((item: any) => item.departamento_responsable === departamento_responsable)

          if (!elementoExistente) acumulador.push({ departamento_responsable, total_tickets: 1 })
          else elementoExistente.total_tickets++
        }

        return acumulador
      }, [])

      return conteo
    }

    function contarTicketsDepartamentoSolicitante(tickets: Ticket[]): any[] {
      const conteo = tickets.reduce((acumulador: any, ticket) => {
        const departamento_solicitante = ticket.departamento_solicitante

        const elementoExistente: any = acumulador.find((item: any) => item.departamento_solicitante === departamento_solicitante)

        if (!elementoExistente) acumulador.push({ departamento_solicitante, total_tickets: 1 })
        else elementoExistente.total_tickets++

        return acumulador
      }, [])

      return conteo
    }

    function contarTicketsResponsable(tickets: Ticket[]): any[] {
      const conteo = tickets.reduce((acumulador: any, ticket) => {
        const responsable = ticket.responsable

        const elementoExistente: any = acumulador.find((item: any) => item.responsable === responsable)

        if (!elementoExistente) acumulador.push({ responsable, total_tickets: 1 })
        else elementoExistente.total_tickets++

        return acumulador
      }, [])

      return conteo
    }

    function saludar() {
      console.log('hola')
    }

    return {
      saludar,
      promedioTiemposLine,
      // creados,
      tabsDepartamento,
      tabsEmpleado,
      opcionesDepartamento,
      opcionesEmpleado,
      opcionesFiltroDepartamentoEmpleado,
      categoriaGraficosEmpleado,
      clickGraficoTicketsEmpleado,
      clickGraficoTicketsDepartamento,
      clickGraficoLineaTiempo,
      modoUnaColumna: ref(false),
      tabsTickets,
      ordenarEmpleados,
      filtrarEmpleados,
      estadosTickets,
      empleados,
      empleadosResponsables,
      ticketsConSolucion,
      cantTicketsCreados,
      cantTicketsCreadosParaMi,
      cantTicketsCreadosInternos,
      cantTicketsCreadosADepartamentos,
      cantTicketsRecibidos,
      cantTicketsReasignados,
      cantTicketsAsignados,
      cantTicketsCalificadosResponsable,
      cantTicketsCalificadosSolicitante,
      cantTicketsEjecutados,
      cantTicketsCancelados,
      cantTicketsRechazados,
      cantTicketsCanceladosPorMi,
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
      optionsPie,
      optionsLine,
      mostrarTitulosSeccion,
      accionesTabla,
      modales,
      empleadoResponsableDepartamento,
      ticketsEmpleadoResponsable,
      esResponsableDepartamento,
      filtrarDepartamentos,
      departamentos,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultar,
      consultarDepartamento,
      // Listados
      cantidadesTicketsSolicitadosPorDepartamento,
      cantidadesTicketsRecibidosPorDepartamento,
      ticketsPorEstado,
      ticketsPorDepartamentoEstadoAsignado,
      ticketsPorDepartamentoEstadoRechazado,
      ticketsPorDepartamentoEstadoReasignado,
      ticketsPorDepartamentoEstadoEjecutando,
      ticketsPorDepartamentoEstadoPausado,
      ticketsPorDepartamentoEstadoFinalizadoSolucionado,
      ticketsPorDepartamentoEstadoFinalizadoSinSolucion,
      ticketsPorDepartamentoEstadoCalificado,
      // Bar
      cantidadesTicketsSolicitadosPorDepartamentoBar,
      cantidadesTicketsRecibidosPorDepartamentoBar,
      ticketsPorEstadoBar,
      ticketsPorDepartamentoEstadoAsignadoBar,
      ticketsPorDepartamentoEstadoRechazadoBar,
      ticketsPorDepartamentoEstadoReasignadoBar,
      ticketsPorDepartamentoEstadoEjecutandoBar,
      ticketsPorDepartamentoEstadoPausadoBar,
      ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar,
      ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar,
      ticketsPorDepartamentoEstadoCalificadoBar,
      // botones
      botonVer,
      btnSeguimiento,
      ticketsPorEstadoListado,
      listados,
      consultarDesdeFechas,
      mostrarSeccionDepartamento,
      mostrarSeccionEmpleado,
      reporteExcel,
      maskFecha,
    }
  }
})
