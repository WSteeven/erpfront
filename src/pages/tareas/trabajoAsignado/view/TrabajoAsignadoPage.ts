// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabOptions, accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
//import { useRouter } from 'vue-router'

// Componentes
import ConfirmarDialog from 'pages/tareas/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { useTareaStore } from 'stores/tarea'

export default defineComponent({
    components: {
        EssentialTableTabs,
        ModalesEntidad,
        ConfirmarDialog,
    },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

        const { listado } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()

        const mostrarDialogPlantilla = ref(false)

        const modales = new ComportamientoModalesTrabajoAsignado()

        const botonVer: CustomActionTable = {
            titulo: 'Visualizar',
            accion: ({ entidad }) => {
                // tareaStore.consultarSubtarea(entidad.id)
                modales.abrirModalEntidad('SubtareaAsignadaPage')
                // router.push({ name: 'subtarea_asignada' })
            },
        }

        const botonIniciar: CustomActionTable = {
            titulo: 'Iniciar/Continuar',
            accion: () => mostrarDialogPlantilla.value = true
        }

        function aplicarFiltro(tabSeleccionado) {
            listar({ estado: tabSeleccionado })
        }

        listar()

        const listadoModales = modales.getModales()

        function plantillaSeleccionada(plantilla: keyof typeof listadoModales) {
            mostrarDialogPlantilla.value = false
            modales.abrirModalEntidad(plantilla)
        }

        return {
            listado,
            configuracionColumnasSubtareas,
            botonIniciar,
            botonVer,
            tabOptions,
            aplicarFiltro,
            accionesTabla,
            modales,
            mostrarDialogPlantilla,
            plantillaSeleccionada,
        }
    }
})