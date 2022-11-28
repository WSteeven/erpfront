// Dependencias
import { configuracionColumnasControlMaterialSubtarea } from '../domain/configuracionColumnasControlMaterialSubtarea'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ControlMaterialSubtarea } from '../domain/ControlMaterialSubtarea'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const materiales = ref([])

        const agregarMaterial: CustomActionTable = {
            titulo: 'Seleccionar material',
            accion: () => {
                //
            },
        }

        function eliminarMaterial() {
            //
        }

        function guardar() {
            //
        }

        return {
            configuracionColumnasControlMaterialSubtarea,
            materiales,
            agregarMaterial,
            eliminarMaterial,
            ControlMaterialSubtarea,
            guardar,
        }
    }
})