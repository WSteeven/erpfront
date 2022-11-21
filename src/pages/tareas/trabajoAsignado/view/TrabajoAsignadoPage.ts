// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabTrabajoAsignado, accionesTabla, estadosSubtareas } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import ConfirmarDialog from 'pages/tareas/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { CambiarEstadoSubtarea } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/application/CambiarEstadoSubtarea'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'

export default defineComponent({
    components: {
        EssentialTableTabs,
        ModalesEntidad,
        ConfirmarDialog,
    },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

        const { listado, currentPageListado, offset } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()
        const { confirmar, prompt } = useNotificaciones()

        const mostrarDialogPlantilla = ref(false)

        const store = useTareaStore()
        const authenticationStore = useAuthenticationStore()
        const modales = new ComportamientoModalesTrabajoAsignado()

        const botonVer: CustomActionTable = {
            titulo: 'Visualizar',
            icono: 'bi-eye',
            accion: async ({ entidad }) => {
                store.idSubtareaAsignada = entidad.id
                modales.abrirModalEntidad('SubtareaAsignadaPage')
            },
        }

        const botonIniciar: CustomActionTable = {
            titulo: 'Iniciar',
            icono: 'bi-play',
            color: 'positive',
            visible: ({ entidad }) => entidad.estado === estadosSubtareas.ASIGNADO,
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de iniciar el trabajo?', () => {
                    new CambiarEstadoSubtarea().ejecutar(entidad.id)
                    entidad.estado = estadosSubtareas.EJECUTANDO
                    actualizarElemento(posicion, entidad)
                })
            }
        }

        const botonPausar: CustomActionTable = {
            titulo: 'Pausar',
            icono: 'bi-pause',
            color: 'positive',
            visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO,
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de pausar la subtarea?', () => {
                    prompt('Ingrese el motivo de la pausa', (data) => {
                        new CambiarEstadoSubtarea().pausar(entidad.id, data)
                        entidad.estado = estadosSubtareas.PAUSADO
                        actualizarElemento(posicion, entidad)
                    })
                })
            },
        }

        const botonReanudar: CustomActionTable = {
            titulo: 'Reanudar',
            icono: 'bi-play',
            color: 'positive',
            visible: ({ entidad }) => entidad.estado === estadosSubtareas.PAUSADO,
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de reanudar el trabajo?', () => {
                    new CambiarEstadoSubtarea().reanudar(entidad.id)
                    entidad.estado = estadosSubtareas.EJECUTANDO
                    actualizarElemento(posicion, entidad)
                })
            }
        }

        const botonFormulario: CustomActionTable = {
            titulo: 'Formulario',
            icono: 'bi-journal-text',
            color: 'indigo',
            visible: ({ entidad }) => [estadosSubtareas.EJECUTANDO, estadosSubtareas.REALIZADO].includes(entidad.estado),
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de abrir el formulario?', () => {
                    mostrarDialogPlantilla.value = true
                    modales.abrirModalEntidad('PlantillaGenericaPage')
                })
            }
        }

        function actualizarElemento(posicion: number, entidad: any): void {
            if (posicion >= 0) {
                listado.value.splice(posicion, 1, entidad);
                listado.value = [...listado.value];
            }
        }

        function aplicarFiltro(tabSeleccionado) {
            const grupo_id = authenticationStore.user.grupo_id
            listar({ page: currentPageListado.value++, offset, grupo_id: grupo_id, estado: tabSeleccionado })
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
            botonPausar,
            botonReanudar,
            botonFormulario,
        }
    }
})