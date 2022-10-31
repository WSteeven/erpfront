// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { tabOptions, accionesTabla } from 'config/utils'
import { useTareaStore } from 'stores/tarea'
import { defineComponent } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'

export default defineComponent({
  components: { EssentialTableTabs, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const { notificarAdvertencia, confirmar } = useNotificaciones()

    const tareaStore = useTareaStore()
    if (tareaStore.tarea.id) listar({ tarea_id: tareaStore.tarea.id })

    const configuracionColumnas = [
      ...configuracionColumnasSubtareas,
      accionesTabla,
    ]

    const modales = new ComportamientoModalesSubtareaContent()

    const botonEditarSubtarea: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      // visible: ({ entidad }) => entidad.estado === '',
      accion: async ({ entidad }) => {
        await tareaStore.consultarSubtarea(entidad.id)
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

    const verControlAvance: CustomActionTable = {
      titulo: 'Ver avance',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        modales.abrirModalEntidad('GestionarAvancesPage')
      },
    }

    const botonFinalizar: CustomActionTable = {
      titulo: 'Realizado',
      color: 'positive',
      visible: (entidad) => entidad.estado !== 'REALIZADO' && entidad.estado !== 'CREADO',
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de marcar como realizada la tarea?', () => console.log('Proceder'))
      },
    }

    const botonCancelar: CustomActionTable = {
      titulo: 'Cancelado',
      color: 'negative',
      visible: (entidad) => entidad.estado !== 'REALIZADO' && entidad.estado !== 'EJECUTANDO',
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de cancelar la tarea?', () => console.log('Proceder'))
      },
    }

    const botonAsignar: CustomActionTable = {
      titulo: 'Asignar',
      color: 'indigo',
      visible: (entidad) => entidad.estado !== 'REALIZADO' && entidad.estado !== 'EJECUTANDO',
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de asignar la tarea?', () => console.log('Proceder'))
      },
    }

    if (!tareaStore.tarea.id)
      notificarAdvertencia('Cree una tarea antes de agregar subtareas.')

    const agregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      accion: () => {
        if (!tareaStore.tarea.id)
          notificarAdvertencia('Cree una tarea antes de agregar subtareas.')
        tareaStore.resetearSubtarea()
        tareaStore.subtarea.tarea_id = tareaStore.tarea.id
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

    function aplicarFiltro(tabSeleccionado) {
      if (tareaStore.tarea.id) listar({ tarea_id: tareaStore.tarea.id, estado: tabSeleccionado })
    }

    return {
      configuracionColumnas,
      configuracionColumnasSubtareas,
      listado,
      botonEditarSubtarea,
      botonFinalizar,
      modales,
      agregarSubtarea,
      tabOptions,
      aplicarFiltro,
      verControlAvance,
      botonCancelar,
      botonAsignar,
    }
  },
})
