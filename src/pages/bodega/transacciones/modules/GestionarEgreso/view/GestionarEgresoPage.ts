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

export default defineComponent({
  components: { EssentialTableTabs, ModalEntidad, },
  setup() {
    const mixin = new ContenedorSimpleMixin(Transaccion, new GestionarEgresoController())
    const { entidad: transaccion, disabled, listado } = mixin.useReferencias()
    const statusLoading = new StatusEssentialLoading()

    const transaccionStore = useTransaccionEgresoStore()
    async function filtrarTabs(tabSeleccionado) {
      statusLoading.activar()
      const result = await transaccionStore.filtrarEgresosComprobantes(tabSeleccionado)
      listado.value = result
    }

    filtrarTabs('PENDIENTE')

    const modales = new ComportamientoModalesGestionarEgreso()
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


    return {
      mixin, transaccion, disabled, listado,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,

      tabGestionarEgresos, filtrarTabs,
      botonVerTransaccion, accionesTabla, modales,
      botonImprimir,
    }
  }
})
