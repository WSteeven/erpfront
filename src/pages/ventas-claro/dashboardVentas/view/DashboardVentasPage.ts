// Dependencias
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { accionesTabla, maskFecha, tiposJornadas } from 'config/utils'
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

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import {
  generarColorAzulPastelClaro,
  obtenerFechaActual,
  ordernarListaString,
} from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { Venta } from 'pages/ventas-claro/ventas/domain/Venta'
import { DashboardVentasController } from '../infraestructure/DashboardVentasController'
import { FiltroDashboardVentas } from '../domain/FiltroDashboardVentas'
import { Vendedor } from 'pages/ventas-claro/vendedores/domain/Vendedor'
import { ComportamientoModalesVentasClaro } from 'pages/ventas-claro/ventas/application/ComportamientoModalesVentasClaro'
import { optionsLine, optionsPie } from 'config/graficoGenerico'
import { configuracionColumnasVentas } from 'pages/ventas-claro/ventas/domain/configuracionColumnasVentas'
import { useVentaStore } from 'stores/ventasClaro/venta'
import { VendedorVentasController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorVentasController'

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

    const group = ref('general')
    const options = [
      {
        label: 'General',
        value: 'general'
      },
      {
        label: 'Por Empleado',
        value: 'empleado'
      },
    ]
    const filtro = reactive(new FiltroDashboardVentas())
    const dashboardVentasController = new DashboardVentasController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(
      () => filtro.fecha_inicio && filtro.fecha_fin && filtro.vendedor
    )
    const modales = new ComportamientoModalesVentasClaro()
    const tabsVentas = ref('creados')
    // Cantidades
    const cantVentasCreados = ref()
    const cantVentasInstaladas = ref()
    const cantVentasPendientes = ref()
    const cantVentasRechazadas = ref()
    const ventasPorEstado: any = ref([])
    const ventasPorMesListado: any = ref([])

    const ventasPorPlanes = ref([])
    const ventasTiemposLine = ref([])
    const ventasPorMesBar = ref([])
    const ventasPorEstadoBar = ref()
    const ventasPorPlanesoBar = ref()

    const opcionesVendedor = {
      vendedorGrafico: 'vendedorGrafico',
      vendedorListado: 'vendedorListado',
    }
    const opcionesVendedorLineaTiempo = {
      vendedorLineaTiempo: 'vendedorLineaTiempo',
      vendedorListadoMes: 'vendedorListadoMes',
    }

    const categoriaGraficosVendedor = {
      ESTADO_ACTUAL: 'ESTADO_ACTUAL',
      VENTAS_POR_PLANES: 'VENTAS_POR_PLANES',
    }
    const tabsVendedor = ref(opcionesVendedor.vendedorGrafico)
    const tabsVendedorLinea = ref(
      opcionesVendedorLineaTiempo.vendedorLineaTiempo
    )

    /*******
   * Init
    *******/
    cargarVista(async () => {
      await obtenerListados({
        vendedores: {
          controller: new VendedorVentasController(),
          params: {
            // campos: 'empleado_id',
          },
        },
      })
      vendedores.value = listadosAuxiliares.vendedores
      filtro.tipo = group.value
    })

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      vendedor: { requiredIf: requiredIf(group.value == 'empleado') },
    }

    const v$ = useVuelidate(reglas, filtro)
    const ventaStore = useVentaStore()
    /***************
     * Botones tabla
     ***************/
    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ventaStore.filaVenta = entidad
        modales.abrirModalEntidad('DetalleCompletoVentas')
      },
    }

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
          (v) => v.empleado_info.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    filtro.fecha_fin = obtenerFechaActual('YYYY-MM-DD')

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          const { result } = await dashboardVentasController.listar(filtro
            // {
            //   fecha_inicio: filtro.fecha_inicio,
            //   fecha_fin: filtro.fecha_fin,
            //   vendedor_id: filtro.vendedor,
            // }
            )
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
          ventasPorMesBar.value = result.ventasPorMes
          //Grafico vendedor por planes
          ventasPorPlanesoBar.value = result.ventasPorPlanesoBar
          ventasTiemposLine.value = result.ventasTiemposLine
        } catch (e) {
          console.log(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function ordenarVendedores() {
      vendedores.value.sort((a: Vendedor, b: Vendedor) =>
        ordernarListaString(a.empleado_info!, b.empleado_info!)
      )
    }

    const ventasPorEstadoListado = ref([])
    function clickGraficoVentasVendedor(
      data,
      categoriaGrafico: keyof typeof categoriaGraficosVendedor
    ) {
      const { label } = data
      if (label) {
        switch (categoriaGrafico) {
          case categoriaGraficosVendedor.ESTADO_ACTUAL:
            ventasPorEstadoListado.value = ventasPorEstado.value.filter(
              (venta: Venta) => venta.estado_activacion === label
            )
            break
          case categoriaGraficosVendedor.VENTAS_POR_PLANES:
            ventasPorEstadoListado.value = ventasPorPlanes.value.filter(
              (venta: Venta) => venta.plan === label.toUpperCase()
            )
            break
        }
        tabsVendedor.value = opcionesVendedor.vendedorListado
      }
    }
    function clickGraficoVentasMes(data) {
      const { label } = data
      if (label) {
        ventasPorMesListado.value = ventasPorMesBar.value.filter(
          (venta: Venta) => venta.mes === label
        )
        tabsVendedorLinea.value = opcionesVendedorLineaTiempo.vendedorListadoMes
      }
    }

    return {
      // creados,
      tabsVendedor,
      tabsVendedorLinea,
      opcionesVendedor,
      opcionesVendedorLineaTiempo,
      categoriaGraficosVendedor,
      clickGraficoVentasVendedor,
      clickGraficoVentasMes,
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
      maskFecha,
      v$,
      mixin,
      listar,
      listado,
      filtro,
      listadosAuxiliares,
      optionsPie,
      optionsLine,
      mostrarTitulosSeccion,
      accionesTabla,
      modales,
      ventasTiemposLine,
      // Configuracion columnas
      configuracionColumnasVentas,
      // Consultar
      consultar,
      botonVer,
      // Listados
      ventasPorEstado,
      // Bar
      ventasPorEstadoBar,
      ventasPorPlanesoBar,

      // botones
      ventasPorEstadoListado,
      ventasPorMesListado,
      group,
      options,

    }
  },
})
