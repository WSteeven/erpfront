// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { accionesTabla, departamentos, tiposJornadas } from 'config/utils'
import { computed, defineComponent, reactive, ref } from 'vue'
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
import { ComportamientoModalesVentasAsignado } from 'pages/gestionVentas/ventasAsignados/application/ComportamientoModalesVentasAsignado'
import { configuracionColumnasVentas } from 'pages/gestionVentas/ventas/domain/configuracionColumnasVentas'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useBotonesTablaVentas } from 'pages/gestionVentas/ventas/application/BotonesTablaVentas'
import { generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { DashboardVentasController } from '../infraestructure/DashboardVentasController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardVentas } from '../domain/FiltroReporteMaterial'
import { estadosVentas } from 'config/ventas.utils'
import { useVentasStore } from 'stores/venta'
import { VendedoresController } from 'pages/ventas-claro/vendedores/infrestructure/VendedoresController'
import { Ventas } from 'pages/ventas-claro/ventas/domain/Ventas'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
  setup() {
    /***********
    * Stores
    ***********/
    const ventaStore = useVentasStore()

    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardVentasController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        vendedores: {
          controller: new VendedoresController(),
          params: {
            campos: 'id'
          }
        },
      })
    })

    const filtro = reactive(new FiltroDashboardVentas())
    const dashboardVentasController = new DashboardVentasController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const modales = new ComportamientoModalesVentasAsignado()
    const empleadoResponsableDepartamento = ref()
    const esResponsableDepartamento = ref(false)
    const ventasEmpleadoResponsable = ref([])
    const tabsVentas = ref('creados')
    let departamento

    // Cantidades
    const cantVentasCreados = ref()
    const cantVentasInstaladas = ref()
    const cantVentasPendientas = ref()
    const cantVentasRechazadas = ref()
    const ventasPorEstado: any = ref([])
    const ventasPorDepartamentoEstadoInstalado = ref([])
    const ventasPorDepartamentoEstadoPendientes = ref([])
    const ventasPorDepartamentoEstadoRechazadas = ref([])


    const ventasPorEstadoBar = ref()
    const ventasPorDepartamentoEstadoInstaladoBar = ref()
    const ventasPorDepartamentoEstadoPendienteBar = ref()
    const ventasPorDepartamentoEstadoRechazadoBar = ref()


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

    const tabsDepartamento = ref(opcionesDepartamento.departamentoGrafico)
    const tabsEmpleado = ref(opcionesEmpleado.empleadoGrafico)

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
          borderRadius: 16,
          padding: 6,
          backgroundColor: function (context) {
            return context.dataset.backgroundColor
          },
          font: function (context) {
            const w = context.chart.width
            return {
              size: w < 512 ? 10 : 12,
            }
          },
          formatter: function (value, context) {
            return value ? context.chart.data.labels[context.dataIndex] + ' (' + value + ')' : null
          }
        }
      },
    }

    /*******
     * Init
     *******/


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
    const { btnSeguimiento } = useBotonesTablaVentas(mixin, modales)
    // setFiltrarVentas(filtrarTrabajoAsignado)

    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ventaStore.filaVentas = entidad
        modales.abrirModalEntidad('DetalleCompletoVentas')
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
          cargando.activar()

          const { result } = await dashboardVentasController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado })
          // await obtenerResponsables()

          // creados.value = result.creados

          cantVentasCreados.value = result.cantidad_ventas
          cantVentasInstaladas.value = result.cantidad_ventas_instaladas
          cantVentasPendientas.value = result.cantidad_ventas_por_instalar
          cantVentasRechazadas.value = result.cantidad_ventas_por_rechazada

          // Grafico empleado consultado
          ventasPorEstado.value = result.ventasPorEstado
          const graficoVentasPorEstado = contarVentasEmpleado(result.ventasPorEstado)
          const labels3 = graficoVentasPorEstado.map((item) => item.estado)
          const valores3 = graficoVentasPorEstado.map((item) => item.total_ventas)
          const colores3 = graficoVentasPorEstado.map((item) => mapearColor(item.estado_activ))
          ventasPorEstadoBar.value = mapearDatos(labels3, valores3, 'Cantidad de ventas', colores3)

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

    function mapearColor(estadoVentas: keyof typeof estadosVentas) {
      switch (estadoVentas) {
        case estadosVentas.ASIGNADO: return '#9fa8da'
        case estadosVentas.PENDIENTE: return '#9fa8da'
        case estadosVentas.REASIGNADO: return '#78909c'
        case estadosVentas.EJECUTANDO: return '#ffc107'
        case estadosVentas.PAUSADO: return '#616161'
        case estadosVentas.FINALIZADO_SOLUCIONADO: return '#8bc34a'
        case estadosVentas.FINALIZADO_SIN_SOLUCION: return '#9ba98c'
        case estadosVentas.FINALIZADO: return '#8bc34a'
        case estadosVentas.CANCELADO: return '#c31d25'
      }
    }

    function mapearColorDepartamentos(estadoVentas: keyof typeof estadosVentas) {
      switch (estadoVentas) {
        case departamentos.xtrim_cuenca: return '#9fa8da'
        case departamentos.medico: return '#78909c'
        case departamentos.activos_fijos: return '#ffc107'
        case departamentos.gerencia: return '#616161'
        case departamentos.proyectos: return '#8bc34a'
        case departamentos.recursos_humanos: return '#bcafe7'
        case departamentos.tecnico: return '#987795'
        case departamentos.contabilidad: return '#96c4e7'
        case departamentos.informatica: return '#c4becb'
        case departamentos.bodega: return '#eb548c'
        case departamentos.sso: return '#ab8ba7'
        case departamentos.vehiculos: return '#a98d7c'
        case departamentos.comercial: return '#aaa698'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    const ventasPorEstadoListado = ref([])
 /*   function clickGraficoVentasEmpleado(data, categoriaGrafico: keyof typeof categoriaGraficosEmpleado) {
      const { label } = data
      if (label) {
        switch (categoriaGrafico) {
          case categoriaGraficosEmpleado.ESTADO_ACTUAL:
            ventasPorEstadoListado.value = ventasPorEstado.value.filter((venta: Ventas) => venta.estado === label)
            // tabsEmpleado.value = opcionesEmpleado.empleadoListado
            break
          case categoriaGraficosEmpleado.CREADOS_A_DEPARTAMENTOS:
            ventasPorEstadoListado.value = cantidadesVentasSolicitadosPorDepartamento.value.filter((venta: Ventas) => venta.departamento_responsable === label)
            // tabsEmpleado.value = opcionesEmpleado.empleadoListado
            break
          case categoriaGraficosEmpleado.ASIGNADOS_POR_DEPARTAMENTOS:
            ventasPorEstadoListado.value = cantidadesVentasRecibidosPorDepartamento.value.filter((venta: Ventas) => venta.departamento_solicitante === label)
            break
        }
        tabsEmpleado.value = opcionesEmpleado.empleadoListado
      }
    }*/

  /*  function clickGraficoVentasDepartamento(data, estado: keyof typeof estadosVentas) {
      const { label } = data
      if (label) {
        switch (estado) {
          case estadosVentas.ASIGNADO:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoAsignado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.EJECUTANDO:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoEjecutando.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.PAUSADO:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoPausado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.REASIGNADO:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoReasignado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.FINALIZADO_SOLUCIONADO:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoFinalizadoSolucionado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.FINALIZADO_SIN_SOLUCION:
            ventasEmpleadoResponsable.value = ventasPorDepartamentoEstadoFinalizadoSinSolucion.value.filter((venta: Ventas) => venta.responsable === label)
            break
        }
        tabsDepartamento.value = opcionesDepartamento.departamentoListado
      }
    }*/


    function contarVentasEmpleado(ventas: Ventas[]): any[] {
      const conteo = ventas.reduce((acumulador: any, venta) => {
        const estado = venta.estado_activ

        const elementoExistente: any = acumulador.find((item: any) => item.estado === estado)

        if (!elementoExistente) acumulador.push({ estado, total_ventas: 1 })
        else elementoExistente.total_ventas++

        return acumulador
      }, [])

      return conteo
    }

 /*   function contarVentasDepartamento(ventas: Ventas[]): any[] {
      const conteo = ventas.reduce((acumulador: any, venta) => {
        const departamento_responsable = venta.departamento_responsable

        if (departamento_responsable) {
          const elementoExistente: any = acumulador.find((item: any) => item.departamento_responsable === departamento_responsable)

          if (!elementoExistente) acumulador.push({ departamento_responsable, total_ventas: 1 })
          else elementoExistente.total_ventas++
        }

        return acumulador
      }, [])

      return conteo
    }*/

   /* function contarVentasDepartamentoSolicitante(ventas: Ventas[]): any[] {
      const conteo = ventas.reduce((acumulador: any, venta) => {
        const departamento_solicitante = venta.departamento_solicitante

        const elementoExistente: any = acumulador.find((item: any) => item.departamento_solicitante === departamento_solicitante)

        if (!elementoExistente) acumulador.push({ departamento_solicitante, total_ventas: 1 })
        else elementoExistente.total_ventas++

        return acumulador
      }, [])

      return conteo
    }*/

    /*function contarVentasResponsable(ventas: Ventas[]): any[] {
      const conteo = ventas.reduce((acumulador: any, venta) => {
        const responsable = venta.responsable

        const elementoExistente: any = acumulador.find((item: any) => item.responsable === responsable)

        if (!elementoExistente) acumulador.push({ responsable, total_ventas: 1 })
        else elementoExistente.total_ventas++

        return acumulador
      }, [])

      return conteo
    }*/

    return {
      // creados,
      tabsDepartamento,
      tabsEmpleado,
      opcionesDepartamento,
      opcionesEmpleado,
      categoriaGraficosEmpleado,
      //clickGraficoVentasEmpleado,
     // clickGraficoVentasDepartamento,
      modoUnaColumna: ref(false),
      tabsVentas,
      ordenarEmpleados,
      filtrarEmpleados,
      estadosVentas,
      empleados,
      empleadosResponsables,
     // ventasConSolucion,
      cantVentasCreados,
    /*  cantVentasCreadosParaMi,
      cantVentasCreadosInternos,
      cantVentasCreadosADepartamentos,
      cantVentasRecibidos,
      cantVentasReasignados,
      cantVentasAsignados,
      cantVentasCalificadosResponsable,
      cantVentasCalificadosSolicitante,
      cantVentasEjecutados,
      cantVentasCancelados,
      cantVentasCanceladosPorMi,
      cantVentasPausados,
      cantVentasFinalizadosSolucionados,
      cantVentasFinalizadosSinSolucion,*/
      configuracionColumnasVentas,
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
      ventasEmpleadoResponsable,
      esResponsableDepartamento,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultar,
      // Listados
     /* cantidadesVentasSolicitadosPorDepartamento,
      cantidadesVentasRecibidosPorDepartamento,
      ventasPorEstado,
      ventasPorDepartamentoEstadoAsignado,
      ventasPorDepartamentoEstadoReasignado,
      ventasPorDepartamentoEstadoEjecutando,
      ventasPorDepartamentoEstadoPausado,
      ventasPorDepartamentoEstadoFinalizadoSolucionado,
      ventasPorDepartamentoEstadoFinalizadoSinSolucion,
      ventasPorDepartamentoEstadoCalificado,
      // Bar
      cantidadesVentasSolicitadosPorDepartamentoBar,
      cantidadesVentasRecibidosPorDepartamentoBar,
      ventasPorEstadoBar,
      ventasPorDepartamentoEstadoAsignadoBar,
      ventasPorDepartamentoEstadoReasignadoBar,
      ventasPorDepartamentoEstadoEjecutandoBar,
      ventasPorDepartamentoEstadoPausadoBar,
      ventasPorDepartamentoEstadoFinalizadoSolucionadoBar,
      ventasPorDepartamentoEstadoFinalizadoSinSolucionBar,
      ventasPorDepartamentoEstadoCalificadoBar,*/
      // botones
      botonVer,
      btnSeguimiento,
      ventasPorEstadoListado,
    }
  },
})
