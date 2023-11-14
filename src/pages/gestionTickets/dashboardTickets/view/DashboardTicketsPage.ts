// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { accionesTabla, opcionesDepartamentos, tiposJornadas } from 'config/utils'
import { computed, defineComponent, reactive, ref } from 'vue'
import { required, requiredIf } from 'shared/i18n-validators'
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
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { DashboardTicketController } from '../infraestructure/DashboardTicketsController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { estadosTickets } from 'config/tickets.utils'
import { useTicketStore } from 'stores/ticket'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { optionsPie } from 'config/graficoGenerico'

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
    })

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTicketController = new DashboardTicketController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const modales = new ComportamientoModalesTicketAsignado()
    const empleadoResponsableDepartamento = ref()
    const esResponsableDepartamento = ref(false)
    const ticketsEmpleadoResponsable = ref([])
    const tabsTickets = ref('creados')
    let departamento

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
    const ticketsPorDepartamentoEstadoReasignado = ref([])
    const ticketsPorDepartamentoEstadoEjecutando = ref([])
    const ticketsPorDepartamentoEstadoPausado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSolucionado = ref([])
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucion = ref([])
    const ticketsPorDepartamentoEstadoCalificado = ref([])

    const cantidadesTicketsSolicitadosPorDepartamentoBar = ref()
    const cantidadesTicketsRecibidosPorDepartamentoBar = ref()
    const ticketsPorEstadoBar = ref()
    const ticketsPorDepartamentoEstadoAsignadoBar = ref()
    const ticketsPorDepartamentoEstadoReasignadoBar = ref()
    const ticketsPorDepartamentoEstadoEjecutandoBar = ref()
    const ticketsPorDepartamentoEstadoPausadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar = ref()
    const ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar = ref()
    const ticketsPorDepartamentoEstadoCalificadoBar = ref()

    // const creados = ref([])

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

    /*******
     * Init
     *******/
    filtro.departamento_empleado = opcionesFiltroDepartamentoEmpleado.porEmpleado


    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { requiredIf: requiredIf(() => filtro.departamento_empleado === opcionesFiltroDepartamentoEmpleado.porEmpleado) },
      departamento: { requiredIf: requiredIf(() => filtro.departamento_empleado === opcionesFiltroDepartamentoEmpleado.porDepartamento) },
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
    const empleados = ref([])
    const empleadosResponsables = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    const {
      departamentos,
      filtrarDepartamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    filtro.fecha_fin = obtenerFechaActual()

    async function consultar() {

      if (await v$.value.$validate()) {
        try {

          const empleadoSeleccionado: Empleado = empleados.value.filter((emp: Empleado) => emp.id === filtro.empleado)[0]

          esResponsableDepartamento.value = empleadoSeleccionado.responsable_departamento
          departamento = empleadoSeleccionado.departamento_id
          cargando.activar()

          const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado, departamento_responsable_id: departamento })
          // await obtenerResponsables()

          // creados.value = result.creados

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
          cantTicketsCanceladosPorMi.value = result.cantTicketsCanceladosPorMi
          cantTicketsPausados.value = result.cantTicketsPausados
          cantTicketsFinalizadosSolucionados.value = result.cantTicketsFinalizadosSolucionados
          cantTicketsFinalizadosSinSolucion.value = result.cantTicketsFinalizadosSinSolucion
          cantTicketsCalificadosResponsable.value = result.cantTicketsCalificadosResponsable
          cantTicketsCalificadosSolicitante.value = result.cantTicketsCalificadosSolicitante

          // Grafico empleado consultado
          ticketsPorEstado.value = result.ticketsPorEstado
          const graficoTicketsPorEstado = contarTicketsEmpleado(result.ticketsPorEstado)
          console.log(graficoTicketsPorEstado)
          const labels3 = graficoTicketsPorEstado.map((item) => item.estado)
          const valores3 = graficoTicketsPorEstado.map((item) => item.total_tickets)
          const colores3 = graficoTicketsPorEstado.map((item) => mapearColor(item.estado))
          ticketsPorEstadoBar.value = mapearDatos(labels3, valores3, 'Cantidad de tickets', colores3)

          console.log('1')

          cantidadesTicketsSolicitadosPorDepartamento.value = result.ticketsCreadosADepartamentos
          const graficoTicketsCreadosDepartamento = contarTicketsDepartamento(result.ticketsCreadosADepartamentos)
          const labels = graficoTicketsCreadosDepartamento.map((item) => item.departamento_responsable)
          const valores = graficoTicketsCreadosDepartamento.map((item) => item.total_tickets)
          const colores1 = graficoTicketsCreadosDepartamento.map((item) => mapearColorDepartamentos(item.departamento_responsable))
          cantidadesTicketsSolicitadosPorDepartamentoBar.value = mapearDatos(labels, valores, 'Cantidad de tickets creados a los departamentos', colores1)

          console.log('2')

          cantidadesTicketsRecibidosPorDepartamento.value = result.ticketsRecibidosPorDepartamentos
          const graficoTicketsRecibidosDepartamento = contarTicketsDepartamentoSolicitante(result.ticketsRecibidosPorDepartamentos)
          const labels2 = graficoTicketsRecibidosDepartamento.map((item) => item.departamento_solicitante)
          const valores2 = graficoTicketsRecibidosDepartamento.map((item) => item.total_tickets)
          const colores2 = graficoTicketsRecibidosDepartamento.map((item) => mapearColorDepartamentos(item.departamento_solicitante))
          cantidadesTicketsRecibidosPorDepartamentoBar.value = mapearDatos(labels2, valores2, 'Cantidad de tickets recibidos por los departamentos', colores2)

          console.log('3')

          // Graficos estadisticos del empleado
          ticketsPorDepartamentoEstadoAsignado.value = await result.ticketsPorDepartamentoEstadoAsignado
          const graficoTicketsPorDepartamentoEstadoAsignado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoAsignado) // <--
          const labels4 = graficoTicketsPorDepartamentoEstadoAsignado.map((item) => item.responsable)
          const valores4 = graficoTicketsPorDepartamentoEstadoAsignado.map((item) => item.total_tickets)
          const colores4 = graficoTicketsPorDepartamentoEstadoAsignado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoAsignadoBar.value = mapearDatos(labels4, valores4, 'Cantidad de tickets del departamento con filtro por estado', colores4)

          console.log('4')

          ticketsPorDepartamentoEstadoReasignado.value = result.ticketsPorDepartamentoEstadoReasignado
          const graficoTicketsPorDepartamentoEstadoReasignado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoReasignado)
          const labels5 = graficoTicketsPorDepartamentoEstadoReasignado.map((item) => item.responsable)
          const valores5 = graficoTicketsPorDepartamentoEstadoReasignado.map((item) => item.total_tickets)
          const colores5 = graficoTicketsPorDepartamentoEstadoReasignado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoReasignadoBar.value = mapearDatos(labels5, valores5, 'Cantidad de tickets del departamento con filtro por estado', colores5)

          console.log('5')

          ticketsPorDepartamentoEstadoEjecutando.value = result.ticketsPorDepartamentoEstadoEjecutando
          const graficoTicketsPorDepartamentoEstadoEjecutando = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoEjecutando)
          const labels6 = graficoTicketsPorDepartamentoEstadoEjecutando.map((item) => item.responsable)
          const valores6 = graficoTicketsPorDepartamentoEstadoEjecutando.map((item) => item.total_tickets)
          const colores6 = graficoTicketsPorDepartamentoEstadoEjecutando.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoEjecutandoBar.value = mapearDatos(labels6, valores6, 'Cantidad de tickets del departamento con filtro por estado', colores6)

          console.log('6')

          ticketsPorDepartamentoEstadoPausado.value = result.ticketsPorDepartamentoEstadoPausado
          const graficoTicketsPorDepartamentoEstadoPausado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoPausado)
          const labels7 = graficoTicketsPorDepartamentoEstadoPausado.map((item) => item.responsable)
          const valores7 = graficoTicketsPorDepartamentoEstadoPausado.map((item) => item.total_tickets)
          const colores7 = graficoTicketsPorDepartamentoEstadoPausado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoPausadoBar.value = mapearDatos(labels7, valores7, 'Cantidad de tickets del departamento con filtro por estado', colores7)

          console.log('7')

          ticketsPorDepartamentoEstadoFinalizadoSolucionado.value = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado
          const graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoFinalizadoSolucionado)
          const labels8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.responsable)
          const valores8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.total_tickets)
          const colores8 = graficoTicketsPorDepartamentoEstadoFinalizadoSolucionado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar.value = mapearDatos(labels8, valores8, 'Cantidad de tickets del departamento con filtro por estado', colores8)

          console.log('8')

          ticketsPorDepartamentoEstadoFinalizadoSinSolucion.value = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion
          const graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion = contarTicketsResponsable(result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion)
          const labels9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.responsable)
          const valores9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.total_tickets)
          const colores9 = graficoTicketsPorDepartamentoEstadoFinalizadoSinSolucion.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar.value = mapearDatos(labels9, valores9, 'Cantidad de tickets del departamento con filtro por estado', colores9)

          console.log('9')

          ticketsPorDepartamentoEstadoCalificado.value = result.ticketsPorDepartamentoEstadoCalificado
          const labels10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.responsable)
          const valores10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.total_tickets)
          const colores10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoCalificadoBar.value = mapearDatos(labels10, valores10, 'Cantidad de tickets del departamento con filtro por estado', colores10)

          // Tiempos
          // const tiemposTicketsFinalizadosPorDepartamento = tiemposTicketsFinalizadosPorDepartamento

          console.log('10')
        } catch (e) {
          console.log(e)
        } finally {

          cargando.desactivar()
        }
      }
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

    function mapearColorDepartamentos(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case opcionesDepartamentos.xtrim_cuenca: return '#9fa8da'
        case opcionesDepartamentos.medico: return '#78909c'
        case opcionesDepartamentos.activos_fijos: return '#ffc107'
        case opcionesDepartamentos.gerencia: return '#616161'
        case opcionesDepartamentos.proyectos: return '#8bc34a'
        case opcionesDepartamentos.recursos_humanos: return '#bcafe7'
        case opcionesDepartamentos.tecnico: return '#987795'
        case opcionesDepartamentos.contabilidad: return '#96c4e7'
        case opcionesDepartamentos.informatica: return '#c4becb'
        case opcionesDepartamentos.bodega: return '#eb548c'
        case opcionesDepartamentos.sso: return '#ab8ba7'
        case opcionesDepartamentos.vehiculos: return '#a98d7c'
        case opcionesDepartamentos.comercial: return '#aaa698'
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

    const promedioTiemposLine = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          backgroundColor: '#0879dc',
          label: 'hola',
          data: [10, 34, 23, 2, 11, 52, 33, 42, 7, 3],
        },
      ],
    }

    return {
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
      // Listados
      cantidadesTicketsSolicitadosPorDepartamento,
      cantidadesTicketsRecibidosPorDepartamento,
      ticketsPorEstado,
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
      ticketsPorEstadoBar,
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
      ticketsPorEstadoListado,
    }
  },
})
