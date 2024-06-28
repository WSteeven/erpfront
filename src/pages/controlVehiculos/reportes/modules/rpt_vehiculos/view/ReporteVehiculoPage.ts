//Dependencies
import { defineComponent, reactive, ref } from "vue"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"

//Logic and controllers
import { maskFecha } from "config/utils"

export default defineComponent({
    components: { EssentialTable },
    setup() {

        const reporte = reactive({
            fecha_inicio: null,
            fecha_fin: null,
        })
        const listado = ref([])

        return {
            reporte,

            //listados
            listado
        }
    }
})