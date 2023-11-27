import { defineComponent, ref } from "vue";
import { configuracionColumnasItemsPreorden } from "../domain/configuracionColumnasItemsPreordenes";

//Componentes
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import EssentialTable from "components/tables/view/EssentialTable.vue"

import { usePreordenStore } from "stores/comprasProveedores/preorden";

export default defineComponent({
    components: { EssentialSelectableTable, EssentialTable },
    setup(props, { emit }) {
        const preordenStore = usePreordenStore()
        const productosSeleccionados = ref([])
        const refListado = ref()
        const listado = ref([])
        listado.value = preordenStore.listadoItems
        
        function seleccionar() {
            productosSeleccionados.value = refListado.value.selected
            preordenStore.crearPreordenConsolida(productosSeleccionados.value)
            cerrarModal(false)
            emit('guardado')
        }

        function cerrarModal(confirmar = true) {
            emit('cerrar-modal', confirmar)
        }
        return {
            listado,
            configuracionColumnasItemsPreorden,
            seleccionar,
            cerrarModal,
            refListado,
            
        }
    }
})