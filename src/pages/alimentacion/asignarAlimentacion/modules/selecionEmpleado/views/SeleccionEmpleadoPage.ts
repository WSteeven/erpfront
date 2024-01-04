import { defineComponent, ref } from "vue";

//Componentes
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import EssentialTable from "components/tables/view/EssentialTable.vue"

import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { configuracionColumnasSeleccionEmpleados } from "../domain/configuracionColumnasSeleccionEmpleados";
import { useAsignacionAlimentacionStore } from "stores/recursosHumanos/asignacionAlimentacion";

export default defineComponent({
    components: { EssentialSelectableTable, EssentialTable },
    emits:['cerrar-modal', 'guardado'],
    setup(props, { emit }) {
        const asignacionAlimentacionStore = useAsignacionAlimentacionStore()
        const empleadosSeleccionados = ref([])
        const refListado = ref()
        const listado = ref([])
        listado.value = asignacionAlimentacionStore.listadoItems

        function seleccionar() {
            empleadosSeleccionados.value = refListado.value.selected
            console.log(asignacionAlimentacionStore.valor_asignar);

           // asignacionAlimentacionStore.crearPreordenConsolida(empleadosSeleccionados.value)
            cerrarModal(false)
            emit('guardado',empleadosSeleccionados.value)
        }

        function cerrarModal(confirmar = true) {
            emit('cerrar-modal', confirmar)
        }
        return {
            listado,
            configuracionColumnasSeleccionEmpleados,
            seleccionar,
            cerrarModal,
            refListado,

        }
    }
})
