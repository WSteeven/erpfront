// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { accionesTabla, tiposJornadas } from 'config/utils'
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

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import {
  generarColorAzulPastelClaro,
  obtenerFechaActual,
  ordernarListaString,
} from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { VendedoresController } from 'pages/ventas-claro/vendedores/infrestructure/VendedoresController'
import { Ventas } from 'pages/ventas-claro/ventas/domain/Ventas'
import { DashboardVentasController } from '../infraestructure/DashboardVentasController'
import { FiltroDashboardVentas } from '../domain/FiltroDashboardVentas'
import { Vendedores } from 'pages/ventas-claro/vendedores/domain/Vendedores'
import { ComportamientoModalesVentas } from 'pages/ventas-claro/ventas/application/ComportamientoModalesVentas'
import { optionsPie } from 'config/graficoGenerico'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
    SelectorImagen,
    TableView,
    Bar,
    Pie,
    ModalesEntidad,
    GraficoGenerico,
  },
  setup() {
    /***********
     * Stores
     ***********/
    // const ventaStore = ventaStore()

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
            campos: 'id',
          },
        },
      })
      vendedores.value = listadosAuxiliares.vendedores
    })

    const filtro = reactive(new FiltroDashboardVentas())
    const dashboardVentasController = new DashboardVentasController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(
      () => filtro.fecha_inicio && filtro.fecha_fin && filtro.vendedor
    )
    const modales = new ComportamientoModalesVentas()
    const vendedorResponsableDepartamento = ref()
    const esResponsableDepartamento = ref(false)
    const ventasVendedorResponsable = ref([])
    const tabsVentas = ref('creados')
    let departamento

    // Cantidades
    const cantVentasCreados = ref()
    const cantVentasInstaladas = ref()
    const cantVentasPendientes = ref()
    const cantVentasRechazadas = ref()
    const ventasPorEstado: any = ref([])
    const ventasPorPlanes = ref([])

    const ventasPorEstadoBar = ref()
    const ventasPorPlanesoBar = ref()

    // const creados = ref([])

    const opcionesDepartamento = {
      departamentoGrafico: 'departamentoGrafico',
      departamentoListado: 'departamentoListado',
    }

    const opcionesVendedor = {
      vendedorGrafico: 'vendedorGrafico',
      vendedorListado: 'vendedorListado',
    }

    const categoriaGraficosVendedor = {
      ESTADO_ACTUAL: 'ESTADO_ACTUAL',
      CREADOS_A_DEPARTAMENTOS: 'CREADOS_A_DEPARTAMENTOS',
      ASIGNADOS_POR_DEPARTAMENTOS: 'ASIGNADOS_POR_DEPARTAMENTOS',
    }

    const tabsDepartamento = ref(opcionesDepartamento.departamentoGrafico)
    const tabsVendedor = ref(opcionesVendedor.vendedorGrafico)



    /*******
     * Init
     *******/

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      vendedor: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /***************
     * Botones tabla
     ***************/
    //const { btnSeguimiento } = useBotonesTablaVentas(mixin, modales)
    // setFiltrarVentas(filtrarTrabajoAsignado)

    /* const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ventaStore.filaVentas = entidad
        modales.abrirModalEntidad('DetalleCompletoVentas')
      },
    }*/

    /*********
     * Filtros
     **********/
    const vendedores = ref([])
    const vendedoresResponsables = ref([])
    function filtrarVendedores(val, update) {
      if (val === '')
        update(() => (vendedores.value = listadosAuxiliares.vendedores))

      update(() => {
        const needle = val.toLowerCase()
        vendedores.value = listadosAuxiliares.vendedores.filter(
          (v) => v.mpleado_info.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    filtro.fecha_fin = obtenerFechaActual()

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          const { result } = await dashboardVentasController.listar({
            fecha_inicio: filtro.fecha_inicio,
            fecha_fin: filtro.fecha_fin,
            vendedor_id: filtro.vendedor,
          })
          // await obtenerResponsables()
          // creados.value = result.creados
          cantVentasCreados.value = result.cantidad_ventas
          cantVentasInstaladas.value = result.cantidad_ventas_instaladas
          cantVentasPendientes.value = result.cantidad_ventas_por_instalar
          cantVentasRechazadas.value = result.cantidad_ventas_por_rechazadas
          // Grafico vendedor consultado
          ventasPorEstado.value = result.ventasPorEstado
          //Grafico vendedor por planes
          ventasPorPlanes.value = result.ventasPorPlanes
          ventasPorEstadoBar.value = result.ventasPorEstadoBar
          //Grafico vendedor por planes
          ventasPorPlanesoBar.value = result.ventasPorPlanesoBar
        } catch (e) {
          console.log(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function ordenarVendedores() {
      vendedores.value.sort((a: Vendedores, b: Vendedores) =>
        ordernarListaString(a.empleado_info!, b.empleado_info!)
      )
    }

    const ventasPorEstadoListado = ref([])
    /*   function clickGraficoVentasVendedor(data, categoriaGrafico: keyof typeof categoriaGraficosVendedor) {
      const { label } = data
      if (label) {
        switch (categoriaGrafico) {
          case categoriaGraficosVendedor.ESTADO_ACTUAL:
            ventasPorEstadoListado.value = ventasPorEstado.value.filter((venta: Ventas) => venta.estado === label)
            // tabsVendedor.value = opcionesVendedor.vendedorListado
            break
          case categoriaGraficosVendedor.CREADOS_A_DEPARTAMENTOS:
            ventasPorEstadoListado.value = cantidadesVentasSolicitadosPorDepartamento.value.filter((venta: Ventas) => venta.departamento_responsable === label)
            // tabsVendedor.value = opcionesVendedor.vendedorListado
            break
          case categoriaGraficosVendedor.ASIGNADOS_POR_DEPARTAMENTOS:
            ventasPorEstadoListado.value = cantidadesVentasRecibidosPorDepartamento.value.filter((venta: Ventas) => venta.departamento_solicitante === label)
            break
        }
        tabsVendedor.value = opcionesVendedor.vendedorListado
      }
    }*/

    /*  function clickGraficoVentasDepartamento(data, estado: keyof typeof estadosVentas) {
      const { label } = data
      if (label) {
        switch (estado) {
          case estadosVentas.ASIGNADO:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoAsignado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.EJECUTANDO:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoEjecutando.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.PAUSADO:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoPausado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.REASIGNADO:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoReasignado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.FINALIZADO_SOLUCIONADO:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoFinalizadoSolucionado.value.filter((venta: Ventas) => venta.responsable === label)
            break
          case estadosVentas.FINALIZADO_SIN_SOLUCION:
            ventasVendedorResponsable.value = ventasPorDepartamentoEstadoFinalizadoSinSolucion.value.filter((venta: Ventas) => venta.responsable === label)
            break
        }
        tabsDepartamento.value = opcionesDepartamento.departamentoListado
      }
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
      tabsVendedor,
      opcionesDepartamento,
      opcionesVendedor,
      categoriaGraficosVendedor,
      //clickGraficoVentasVendedor,
      // clickGraficoVentasDepartamento,
      modoUnaColumna: ref(false),
      tabsVentas,
      ordenarVendedores,
      filtrarVendedores,
      vendedores,
      vendedoresResponsables,
      cantVentasCreados,
      cantVentasInstaladas,
      cantVentasPendientes,
      cantVentasRechazadas,
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
      vendedorResponsableDepartamento,
      ventasVendedorResponsable,
      esResponsableDepartamento,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultar,
      // Listados
      ventasPorEstado,
      // Bar
      ventasPorEstadoBar,
      ventasPorPlanesoBar,

      // botones
      ventasPorEstadoListado,
    }
  },
})
