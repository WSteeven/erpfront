// Dependencias
import { configuracionColumnasSubtareas } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/domain/configuracionColumnasSubtareas'
import { tabOptions, accionesTabla, tiposTrabajosEstaticos } from 'config/utils'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ControlAvance from 'pages/tareas/subtareas/modules/controlAvance/view/ControlAvanceContent.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'

export default defineComponent({
    components: {
        EssentialTableTabs,
    },
    setup() {
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
                // console.log(entidad.tipo_trabajo)
                switch (entidad.tipo_trabajo) {
                    case tiposTrabajosEstaticos.hincado:
                        router.push({ name: 'control_avance' })
                        break
                    case tiposTrabajosEstaticos.tendido:
                        router.push({ name: 'control_avance' })
                        break
                    default:
                        router.push({ name: 'control_avance' })
                }
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