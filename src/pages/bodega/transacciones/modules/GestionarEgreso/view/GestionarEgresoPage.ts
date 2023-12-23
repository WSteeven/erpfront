//Dependencias
import { configuracionColumnasTransaccionEgreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionEgreso'
import { defineComponent } from 'vue'

//Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { GestionarEgresoController } from '../infraestructure/GestionarEgresoController'
import { tabGestionarEgresos, accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesGestionarEgreso } from '../application/ComportamientoModalesGestionarEgreso'
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useQuasar } from 'quasar';
import { useCargandoStore } from 'stores/cargando';
import { useNotificacionStore } from 'stores/notificacion'

export default defineComponent({
  components: { EssentialTableTabs, ModalEntidad, },
  setup() {
    const mixin = new ContenedorSimpleMixin(Transaccion, new GestionarEgresoController())
    const { entidad: transaccion, disabled, listado } = mixin.useReferencias()

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const transaccionStore = useTransaccionEgresoStore()
    const cargando = new StatusEssentialLoading()
    const modales = new ComportamientoModalesGestionarEgreso()

    /*******************************************************************************************
    * Funciones
    ******************************************************************************************/
    async function filtrarTabs(tabSeleccionado) {
      cargando.activar()
      const result = await transaccionStore.filtrarEgresosComprobantes(tabSeleccionado)
      listado.value = result
      cargando.desactivar()
    }

    function guardado(data: any) {
      if (data == 'aceptado') filtrarTabs('PENDIENTE')
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const botonVerTransaccion: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      color: 'primary',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.showPreview()
        modales.abrirModalEntidad('VisualizarEgresoPage')
      }
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'positive',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id;
        await transaccionStore.imprimirEgreso()
      }
    }


    filtrarTabs('PENDIENTE')


    return {
      mixin, transaccion, disabled, listado,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,
      guardado,

      tabGestionarEgresos, filtrarTabs,
      botonVerTransaccion, accionesTabla, modales,
      botonImprimir,
    }
  }
})
