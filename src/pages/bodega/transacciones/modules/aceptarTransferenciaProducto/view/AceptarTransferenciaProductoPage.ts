// Dependencias
import { configuracionColumnasTransferenciaProducto } from 'gestionTrabajos/transferenciasProductosEmpleados/domain/configuracionColumnasTransferenciaProducto'
import { estadosTransferenciasProductos, tabOptionsAceptarTransferenciasProductos } from 'config/tareas.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, onMounted, ref } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { accionesTabla } from 'config/utils'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { TransferenciaProductoEmpleadoController } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/infraestructure/TransferenciaProductoEmpleadoController'
import { TransferenciaProductoEmpleado } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/domain/TransferenciaProductoEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionarEgreso } from '../application/ComportamientoModalesGestionarEgreso'

export default defineComponent({
  name: 'aceptar_transferencia_producto',
  components: { EssentialTableTabs, ModalEntidad, },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const transaccionStore = useTransaccionEgresoStore()
    const modales = new ComportamientoModalesGestionarEgreso()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaProductoEmpleado, new TransferenciaProductoEmpleadoController())
    const { entidad: transferencia, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    /*************
     * Variables
     *************/
    const tabDefecto = ref(estadosTransferenciasProductos.VALIDADO)

    /***********
    * Funciones
    ************/
    function filtrarTabs(tab: string) {
      tabDefecto.value = tab
      listar({ autorizacion_id: tab, empleado_destino_id: authenticationStore.user.id, filtrar: true })
    }

    /*******************************************************************************************
     * Botones de tabla
    ******************************************************************************************/
    const botonVerTransaccion: CustomActionTable = {
      titulo: 'Visualizar para aceptar',
      icono: 'bi-eye',
      color: 'primary',
      accion: async ({ entidad }) => {
        transferencia.id = entidad.id
        modales.abrirModalEntidad('VisualizarTransferenciaProductoPage', { mixin })
      }
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'positive',
      icono: 'bi-printer',
      accion: async ({ entidad }) => listar({ export: 'pdf', id: entidad.id, titulo: 'Tranferencia #' + entidad.id })
    }

    function guardado(data: any) {
      if (data == 'aceptado') {
        tabDefecto.value = estadosTransferenciasProductos.VALIDADO
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
