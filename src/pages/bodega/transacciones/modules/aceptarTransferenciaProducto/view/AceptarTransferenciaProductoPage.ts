//Dependencias
import { configuracionColumnasTransferenciaProducto } from 'gestionTrabajos/transferenciasProductosEmpleados/domain/configuracionColumnasTransferenciaProducto'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, onMounted, ref } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { accionesTabla } from 'config/utils'
import { useQuasar } from 'quasar'

//Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { TransferenciaProductoEmpleadoController } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/infraestructure/TransferenciaProductoEmpleadoController'
import { TransferenciaProductoEmpleado } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/domain/TransferenciaProductoEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionarEgreso } from '../application/ComportamientoModalesGestionarEgreso'
import { estadosTransferenciasProductos, tabOptionsAceptarTransferenciasProductos } from 'config/tareas.utils'

export default defineComponent({
  components: { EssentialTableTabs, ModalEntidad, },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const transaccionStore = useTransaccionEgresoStore()
    const modales = new ComportamientoModalesGestionarEgreso()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaProductoEmpleado, new TransferenciaProductoEmpleadoController())
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    /*************
     * Variables
     *************/
    const tabDefecto = ref(estadosTransferenciasProductos.PENDIENTE)

    /***********
    * Funciones
    ************/
    function filtrarTabs(tab: string) {
      tabDefecto.value = tab
      listar({ estado: tab })
    }

    /*******************************************************************************************
     * Botones de tabla
    ******************************************************************************************/
    const botonVerTransaccion: CustomActionTable = {
      titulo: 'Visualizar para aceptar',
      icono: 'bi-eye',
      color: 'primary',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        transaccionStore.estadoPendiente = entidad.estado_comprobante === 'PENDIENTE' ? true : false
        await transaccionStore.showPreview()
        modales.abrirModalEntidad('VisualizarEgresoPage')
      }
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'positive',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirEgreso()
      }
    }

    function guardado(data: any) {
      if (data == 'aceptado') {
        tabDefecto.value = 'PENDIENTE'
        filtrarTabs(tabDefecto.value)
      }
    }

    /*********
     * Hooks
    *********/
    onMounted(() => filtrarTabs(tabDefecto.value))

    return {
      mixin,
      listado,
      configuracionColumnas: configuracionColumnasTransferenciaProducto,
      guardado,
      tabOptionsAceptarTransferenciasProductos,
      tabDefecto,
      filtrarTabs,
      botonVerTransaccion, accionesTabla, modales,
      botonImprimir,
    }
  }
})
