// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabTrabajoAsignado, accionesTabla, estadosSubtareas } from 'config/utils'
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
import { useNotificaciones } from 'shared/notificaciones'

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
        const { confirmar } = useNotificaciones()

        const mostrarDialogPlantilla = ref(false)

        const store = useTareaStore()
        const modales = new ComportamientoModalesTrabajoAsignado()

        const botonVer: CustomActionTable = {
            titulo: 'Visualizar',
            icono: 'bi-eye',
            accion: async ({ entidad }) => {
                await store.consultarSubtareaTecnico(entidad.id)
                modales.abrirModalEntidad('SubtareaAsignadaPage')
            },
        }

        const botonIniciar: CustomActionTable = {
            titulo: 'Iniciar',
            icono: 'bi-play',
            color: 'positive',
            visible: (entidad) => entidad.estado === estadosSubtareas.ASIGNADO,
            accion: () => {
                confirmar('¿Está seguro de iniciar el trabajo?', () =>
                    // mostrarDialogPlantilla.value = true
                    modales.abrirModalEntidad('PlantillaGenericaPage')
                )
            }
        }

        const botonContinuar: CustomActionTable = {
            titulo: 'Pausar/Continuar',
            icono: 'bi-play-circle',
            color: 'indigo',
            visible: (entidad) => entidad.estado === estadosSubtareas.EJECUTANDO,
            accion: () => mostrarDialogPlantilla.value = true
        }

        function aplicarFiltro(tabSeleccionado) {
            listar({ estado: tabSeleccionado })
        }

        aplicarFiltro('ASIGNADO')

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
            tabTrabajoAsignado,
            aplicarFiltro,
            accionesTabla,
            modales,
            mostrarDialogPlantilla,
            plantillaSeleccionada,
            botonContinuar,
        }
    }
})