//dependencies
import { defineComponent } from "vue";
import { configuracionColumnasProductosSeleccionadosDespachado } from "../domain/configuracionColumnasProductosSeleccionadosDespachado";

//Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";

//logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Pedido } from "../domain/Pedido";
import { PedidoController } from "../infraestructura/PedidoController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { usePedidoStore } from "stores/pedido";
import { configuracionColumnasPedidos } from "../domain/configuracionColumnasPedidos";

export default defineComponent({
    components: { TabLayout, EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Pedido, new PedidoController())
        const { entidad: pedido } = mixin.useReferencias()
        const { notificarError } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const pedidoStore = usePedidoStore()

        if (pedidoStore.pedido) {
            console.log('if->', pedidoStore.pedido)
            pedido.hydrate(pedidoStore.pedido)
        } else {
            console.log('else->', pedidoStore.pedido)
        }

        configuracionColumnasProductosSeleccionadosDespachado.splice(6,1)
        return {
            pedido, mixin,
            configuracionColumnas: configuracionColumnasPedidos,
            configuracionColumnasProductosSeleccionadosDespachado,


        }
    }
})