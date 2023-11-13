//Dependencias
import { computed, defineComponent, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from 'shared/i18n-validators'
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { ComportamientoModalesOrdenesCompras } from "../application/ComportamientoModalesOrdenesCompras";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'

//Logica y controladores
import { OrdenCompra } from "pages/comprasProveedores/ordenCompra/domain/OrdenCompra";
import { OrdenCompraController } from "pages/comprasProveedores/ordenCompra/infraestructure/OrdenCompraController";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useOrdenCompraStore } from "stores/comprasProveedores/ordenCompra";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { estadosOrdenesCompras } from "config/utils_compras_proveedores";


export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
  setup(props) {
    /***********
    * Stores
    ***********/
    const ordenCompraStore = useOrdenCompraStore()
    const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
    const { entidad: orden, listado, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const dashboard = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      proveedor: '',
      empleado: '',
    })
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => dashboard.fecha_inicio && dashboard.fecha_fin && dashboard.empleado)
    const modales = new ComportamientoModalesOrdenesCompras()

    const empleados = ref([])
    const proveedores = ref([])
    cargarVista(async () => {
      await obtenerListados({
        // proveedores: new ProveedorController(),
        // empleados: {
        //   controller: new EmpleadoController(),
        //   params: {
        //     campos: 'id,nombres,apellidos,departamento_id,responsable_departamento',
        //     estado: 1,
        //   }
        // },
      })
    })
    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      // empleado: { required },
    }

    const v$ = useVuelidate(reglas, dashboard)

    const ordenesPorEstado = ref([])
    const ordenesPorEstadoBar = ref([])
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
            var w = context.chart.width
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
    /***************
     * Botones tabla
     ***************/
    const btnVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ordenCompraStore.orden = entidad
        modales.abrirModalEntidad('VisualizarOrdenCompra')
      },
    }

    /***************
     * Funciones
     ***************/
    const cantOrdenesCreadas = ref()
    const cantOrdenesPendientes = ref()
    const cantOrdenesAprobadas = ref()
    const cantOrdenesRevisadas = ref()
    const cantOrdenesRealizadas = ref()
    const cantOrdenesPagadas = ref()
    const cantOrdenesAnuladas = ref()
    const opcionesGrafico = {
      grafico: 'grafico',
      listado: 'listado'
    }
    const tabs = ref(opcionesGrafico.grafico)

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          const results = await ordenCompraStore.consultarDashboard(dashboard)
          console.log(results)
          cantOrdenesCreadas.value = results.cant_ordenes_creadas
          cantOrdenesPendientes.value = results.cant_ordenes_pendientes
          cantOrdenesAprobadas.value = results.cant_ordenes_aprobadas
          cantOrdenesRevisadas.value = results.cant_ordenes_revisadas
          cantOrdenesRealizadas.value = results.cant_ordenes_realizadas
          cantOrdenesPagadas.value = results.cant_ordenes_pagadas
          cantOrdenesAnuladas.value = results.cant_ordenes_anuladas
          ordenesPorEstado.value = results
          const labels = ordenesPorEstado.value.map((item: OrdenCompra) => item.forma)
          const valores = ordenesPorEstado.value.length
          const colores = ordenesPorEstado.value.map((item: OrdenCompra) => mapearColor(item.forma!))
          ordenesPorEstadoBar.value = mapearDatos(labels!, valores, 'Cantidad de Oc', colores)
        } catch (error) {
          console.log(error)
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
    function mapearColor(estadoOC: keyof typeof estadosOrdenesCompras) {
      switch (estadoOC) {
        case estadosOrdenesCompras.PENDIENTE: return '#9fa8da'
        case estadosOrdenesCompras.APROBADO: return '#9fa8da'
        case estadosOrdenesCompras.REVISADA: return '#78909c'
        case estadosOrdenesCompras.REALIZADA: return '#ffc107'
        case estadosOrdenesCompras.PAGADA: return '#616161'
        case estadosOrdenesCompras.ANULADA: return '#8bc34a'
      }
    }
    function clickGrafico() {
      console.log('Diste clic en grafico')
    }


    return {
      ordenesPorEstado, ordenesPorEstadoBar,
      v$,
      dashboard,
      btnVer,
      consultar,
      clickGrafico,
      cantOrdenesCreadas,
      cantOrdenesPendientes,
      cantOrdenesAprobadas,
      cantOrdenesRevisadas,
      cantOrdenesRealizadas,
      cantOrdenesPagadas,
      cantOrdenesAnuladas,
      tabs, opcionesGrafico,
      

    }
  },
})
