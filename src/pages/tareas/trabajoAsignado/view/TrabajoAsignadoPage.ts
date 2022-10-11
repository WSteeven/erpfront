import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasSubtareas } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/domain/configuracionColumnasSubtareas'
import { defineComponent, ref } from "vue"
import { tabOptions, accionesTabla } from 'config/utils'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useRouter } from 'vue-router'

export default defineComponent({
    components: {
        EssentialTableTabs,
    },
    setup() {
        // const listado = ref([])
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

        const { listado } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()

        const router = useRouter()

        const botonVer: CustomActionTable = {
            titulo: 'Ver',
            accion: ({ entidad }) => {
                router.push({ name: 'subtarea_asignada' })
            },
        }

        const botonIniciar: CustomActionTable = {
            titulo: 'Iniciar',
            accion: ({ entidad }) => {
                //
            },
        }

        function aplicarFiltro(tabSeleccionado) {
            listar({ estado: tabSeleccionado })
        }

        listar()

        return {
            listado,
            configuracionColumnasSubtareas,
            botonIniciar,
            botonVer,
            tabOptions,
            aplicarFiltro,
            accionesTabla,
        }
    }
})