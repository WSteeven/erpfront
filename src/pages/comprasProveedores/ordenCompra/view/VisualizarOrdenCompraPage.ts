//Dependencias
import { computed, defineComponent, reactive, ref } from "vue";
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";

// Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { useOrdenCompraStore } from "stores/comprasProveedores/ordenCompra";
import { OrdenCompra } from "../domain/OrdenCompra";
import { useAuthenticationStore } from "stores/authentication";
import { OrdenCompraController } from "../infraestructure/OrdenCompraController";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";

export default defineComponent({
  components: { TabLayout, EssentialTable },
  emits: ["cerrar-modal"],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController());
    const store = useAuthenticationStore();
    const ordenCompraStore = useOrdenCompraStore();
    const orden = reactive(new OrdenCompra());
    orden.hydrate(ordenCompraStore.orden);
    //variables
    const subtotal = computed(() =>
      orden.listadoProductos
        .reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0)
        .toFixed(2)
    );
    const iva = computed(() =>
      orden.listadoProductos
        .reduce((prev, curr) => prev + parseFloat(curr.iva), 0)
        .toFixed(2)
    );
    const descuento = computed(() =>
      orden.listadoProductos
        .reduce((prev, curr) => prev + parseFloat(curr.descuento), 0)
        .toFixed(2)
    );
    const total = computed(() =>
      orden.listadoProductos
        .reduce((prev, curr) => prev + parseFloat(curr.total), 0)
        .toFixed(2)
    );

    return {
      mixin,
      configuracionColumnas: configuracionColumnasOrdenesCompras,
      configuracionColumnasItemOrdenCompra,
      store,
      orden,
      subtotal,
      total,
      descuento,
      iva,
    };
  },
});
