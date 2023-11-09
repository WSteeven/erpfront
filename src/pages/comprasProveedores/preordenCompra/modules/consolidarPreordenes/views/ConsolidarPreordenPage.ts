import { defineComponent, onMounted, ref } from "vue";

//Componentes
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { configuracionColumnasDetallesProductos } from "pages/comprasProveedores/preordenCompra/domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemsPreorden } from "../domain/configuracionColumnasItemsPreordenes";

export default defineComponent({
    components: { EssentialSelectableTable },
    setup() {
        const preordenStore = usePreordenStore()
        const productosSeleccionados = ref([])
        const refListado = ref()
        function seleccionarProducto(items) {
            console.log(items)
            productosSeleccionados.value = items
        }
        onMounted(()=>{
            console.log(preordenStore.listadoItems)
        })
        return {
            preordenStore,
            listado: preordenStore.listadoItems,
            configuracionColumnasItemsPreorden,
            seleccionarProducto,
            productosSeleccionados,
            refListado,
        }
    }
})