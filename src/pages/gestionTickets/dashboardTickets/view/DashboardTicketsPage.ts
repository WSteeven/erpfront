// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { required } from 'shared/i18n-validators'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { accionesTabla, departamentos, tiposJornadas } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TableView from 'components/tables/view/TableView.vue'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { formatearFechaSeparador, generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { DashboardTicketController } from '../infraestructure/DashboardTicketsController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { estadosTickets } from 'config/tickets.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTicketStore } from 'stores/ticket'
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import datalabels from 'chartjs-plugin-datalabels'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad },
  setup() {
    /***********
    * Stores
    ***********/
    const ticketStore = useTicketStore()

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
    const ticketsEmpleadoResponsable = ref([])
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
    const ticketsPorEstado = ref([])
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

    filtro.fecha_fin = obtenerFechaActual()

    async function consultar() {

      if (await v$.value.$validate()) {
        try {

          const empleadoSeleccionado: Empleado = empleados.value.filter((emp: Empleado) => emp.id === filtro.empleado)[0]

          esResponsableDepartamento.value = empleadoSeleccionado.responsable_departamento
          departamento = empleadoSeleccionado.departamento_id
          cargando.activar()

          const { result } = await dashboardTicketController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado, departamento_responsable_id: departamento })
          await obtenerResponsables()

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

          /**************
           * Mapear Pies
           **************/
          const labels4 = result.ticketsPorDepartamentoEstadoAsignado.map((item) => item.responsable)
          const valores4 = result.ticketsPorDepartamentoEstadoAsignado.map((item) => item.total_tickets)
          const colores4 = result.ticketsPorDepartamentoEstadoAsignado.map(() => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoAsignadoBar.value = mapearDatos(labels4, valores4, 'Cantidades de tickets del departamento con filtro por estado', colores4)
          ticketsPorDepartamentoEstadoAsignado.value = await result.ticketsPorDepartamentoEstadoAsignado

          const labels5 = result.ticketsPorDepartamentoEstadoReasignado.map((item) => item.responsable)
          const valores5 = result.ticketsPorDepartamentoEstadoReasignado.map((item) => item.total_tickets)
          const colores5 = result.ticketsPorDepartamentoEstadoReasignado.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoReasignadoBar.value = mapearDatos(labels5, valores5, 'Cantidades de tickets del departamento con filtro por estado', colores5)
          ticketsPorDepartamentoEstadoReasignado.value = result.ticketsPorDepartamentoEstadoReasignado

          const labels6 = result.ticketsPorDepartamentoEstadoEjecutando.map((item) => item.responsable)
          const valores6 = result.ticketsPorDepartamentoEstadoEjecutando.map((item) => item.total_tickets)
          const colores6 = result.ticketsPorDepartamentoEstadoEjecutando.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoEjecutandoBar.value = mapearDatos(labels6, valores6, 'Cantidades de tickets del departamento con filtro por estado', colores6)
          ticketsPorDepartamentoEstadoEjecutando.value = result.ticketsPorDepartamentoEstadoEjecutando

          const labels7 = result.ticketsPorDepartamentoEstadoPausado.map((item) => item.responsable)
          const valores7 = result.ticketsPorDepartamentoEstadoPausado.map((item) => item.total_tickets)
          const colores7 = result.ticketsPorDepartamentoEstadoPausado.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoPausadoBar.value = mapearDatos(labels7, valores7, 'Cantidades de tickets del departamento con filtro por estado', colores7)
          ticketsPorDepartamentoEstadoPausado.value = result.ticketsPorDepartamentoEstadoPausado

          const labels8 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.responsable)
          const valores8 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => item.total_tickets)
          const colores8 = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar.value = mapearDatos(labels8, valores8, 'Cantidades de tickets del departamento con filtro por estado', colores8)
          ticketsPorDepartamentoEstadoFinalizadoSolucionado.value = result.ticketsPorDepartamentoEstadoFinalizadoSolucionado

          const labels9 = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.responsable)
          const valores9 = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => item.total_tickets)
          const colores9 = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar.value = mapearDatos(labels9, valores9, 'Cantidades de tickets del departamento con filtro por estado', colores9)
          ticketsPorDepartamentoEstadoFinalizadoSinSolucion.value = result.ticketsPorDepartamentoEstadoFinalizadoSinSolucion

          const labels10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.responsable)
          const valores10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => item.total_tickets)
          const colores10 = result.ticketsPorDepartamentoEstadoCalificado.map((item) => generarColorAzulPastelClaro())
          ticketsPorDepartamentoEstadoCalificadoBar.value = mapearDatos(labels10, valores10, 'Cantidades de tickets del departamento con filtro por estado', colores10)
          ticketsPorDepartamentoEstadoCalificado.value = result.ticketsPorDepartamentoEstadoCalificado

          if (filtro.empleado) {
            empleadoResponsableDepartamento.value = filtro.empleado
            obtenerTicketsEmpleadoResponsable(filtro.empleado)
          }

        } catch (e) {
          console.log(e)
        } finally {

          cargando.desactivar()
        }
      }
    }

    async function obtenerTicketsEmpleadoResponsable(responsable_id: number) {
      // const controller = new TicketController()
      // ticketsEmpleadoResponsable.value = (await controller.listar({ responsable_id })).result
      if (filtro.fecha_inicio && filtro.fecha_fin) {
        const fechaInicio = formatearFechaSeparador(filtro.fecha_inicio, '/')
        const fechaFin = formatearFechaSeparador(filtro.fecha_fin, '/', { days: 1 })
        const consultaFecha = 'created_at[start]=' + fechaInicio + '&created_at[end]=' + fechaFin
        const consultaParametros = 'responsable_id=' + responsable_id
        const axios = AxiosHttpRepository.getInstance()
        const respuesta: any = await axios.get(axios.getEndpoint(endpoints.tickets) + '?' + consultaParametros + '&' + consultaFecha)
        ticketsEmpleadoResponsable.value = respuesta.data.results
      }
      //
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
        case estadosTickets.ASIGNADO: return '#9fa8da'
        case estadosTickets.PENDIENTE: return '#9fa8da'
        case estadosTickets.REASIGNADO: return '#78909c'
        case estadosTickets.EJECUTANDO: return '#ffc107'
        case estadosTickets.PAUSADO: return '#616161'
        case estadosTickets.FINALIZADO_SOLUCIONADO: return '#8bc34a'
        case estadosTickets.FINALIZADO_SIN_SOLUCION: return '#9ba98c'
        case estadosTickets.FINALIZADO: return '#8bc34a'
        case estadosTickets.CANCELADO: return '#c31d25'
        // case estadosTickets.CALIFICADO: return '#98bf23'
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
        case departamentos.informatica: return '#9fa8da'
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
    }
  },
})
