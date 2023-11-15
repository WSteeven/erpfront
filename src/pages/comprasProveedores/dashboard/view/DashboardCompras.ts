//Dependencias
import { configuracionColumnasOrdenesCompras } from "../../ordenCompra/domain/configuracionColumnasOrdenCompra";
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
import { obtenerFechaActual } from "shared/utils";
import { accionesTabla } from "config/utils";
import { useNotificaciones } from "shared/notificaciones";
import { optionsPie } from "config/graficoGenerico";
import { filtroOrdenesComprasAprobadas, filtroOrdenesComprasCreadas, filtroOrdenesComprasProveedores } from "../application/FiltrosDashboardOrdenesCompras";


export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
  setup(props) {
    /***********
    * Stores
    ***********/
    const ordenCompraStore = useOrdenCompraStore()
    const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
    // const { entidad: orden, listado, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const { confirmar } = useNotificaciones()
    const dashboard = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      proveedor: '',
      empleado: '',
      tipo: '',
    })
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => dashboard.fecha_inicio && dashboard.fecha_fin)
    const modales = new ComportamientoModalesOrdenesCompras()
    const cantOrdenesProveedor = ref()
    const cantOrdenesCreadas = ref()
    const cantOrdenesPendientes = ref()
    const cantOrdenesAprobadas = ref()
    const cantOrdenesRevisadas = ref()
    const cantOrdenesRealizadas = ref()
    const cantOrdenesPagadas = ref()
    const cantOrdenesAnuladas = ref()
    const opcionesTipos = [
      { label: 'ESTADO', value: 'ESTADO' },
      { label: 'PROVEEDOR', value: 'PROVEEDOR' },
    ]
    const opcionesGrafico = {
      grafico: 'grafico',
      listado: 'listado'
    }
    const identificadorGrafico = {
      creadas: 'CREADAS',
      aprobadas: 'APROBADAS',
      //graficos de proveedores
      proveedores: 'PROVEEDORES',
    }
    const tabs = ref(opcionesGrafico.grafico)

    const graficos = ref()
    const ordenes = ref()
    const labelTabla = ref()
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
      dashboard.fecha_fin = obtenerFechaActual()
    })
    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      tipo: { required },
      // empleado: { required },
    }

    const v$ = useVuelidate(reglas, dashboard)

    const ordenesPorEstado = ref([])
    /***************
     * Botones tabla
     ***************/
    const btnVer: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ordenCompraStore.orden = entidad
        modales.abrirModalEntidad('VisualizarOrdenCompra')
      },
    }
    const btnVerNovedades: CustomActionTable = {
      titulo: 'Novedades',
      color: 'warning',
      icono: 'bi-wrench',
      accion: async ({ entidad, posicion }) => {
        console.log(entidad)
        ordenCompraStore.idOrden = entidad.id
        confirmar('¿Está seguro de abrir el formulario de registro de novedades de la orden de compra?', () => {
          ordenCompraStore.permitirSubir = false
          modales.abrirModalEntidad('SeguimientoNovedadesOrdenesCompras')
        })
      },
      visible: ({ entidad }) => {
        return entidad.novedades > 0
      }
    }

    /***************
     * Funciones
     ***************/
    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          const results = await ordenCompraStore.consultarDashboard(dashboard)
          // console.log(results)
          cantOrdenesCreadas.value = results.cant_ordenes_creadas
          cantOrdenesPendientes.value = results.cant_ordenes_pendientes
          cantOrdenesAprobadas.value = results.cant_ordenes_aprobadas
          cantOrdenesRevisadas.value = results.cant_ordenes_revisadas
          cantOrdenesRealizadas.value = results.cant_ordenes_realizadas
          cantOrdenesPagadas.value = results.cant_ordenes_pagadas
          cantOrdenesAnuladas.value = results.cant_ordenes_anuladas

          cantOrdenesProveedor.value = results.cant_ordenes_proveedores
          ordenes.value = results.todas
          graficos.value = results.graficos
        } catch (error) {
          console.log(error)
        }
      }
    }
    function clickGrafico(data: any, key: string) {
      labelTabla.value = data.label
      console.log('Diste clic en grafico', data, key)
      // console.log('Ordenes para filtrar', ordenes.value)
      switch (key) {
        case identificadorGrafico.creadas:
          ordenesPorEstado.value = filtroOrdenesComprasCreadas(data.label, ordenes)
          break
        case identificadorGrafico.aprobadas:
          ordenesPorEstado.value = filtroOrdenesComprasAprobadas(data.label, ordenes)
          break
        case identificadorGrafico.proveedores:
          ordenesPorEstado.value = filtroOrdenesComprasProveedores(data.label, ordenes)
          break
        default:
          console.log('Entro en default de clic grafico')
      }
      tabs.value = opcionesGrafico.listado
    }


    return {
      configuracionColumnas: configuracionColumnasOrdenesCompras, accionesTabla,
      ordenesPorEstado,
      v$,
      dashboard,
      optionsPie,
      btnVer,
      btnVerNovedades,
      consultar,
      clickGrafico,
      cantOrdenesProveedor,
      cantOrdenesCreadas,
      cantOrdenesPendientes,
      cantOrdenesAprobadas,
      cantOrdenesRevisadas,
      cantOrdenesRealizadas,
      cantOrdenesPagadas,
      cantOrdenesAnuladas,
      opcionesTipos,
      tabs, opcionesGrafico, mostrarTitulosSeccion, identificadorGrafico,
      graficos,
      modales,
      modoUnaColumna: ref(false),
      labelTabla,
    }
  },
})
