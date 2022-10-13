// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'
import { defineComponent } from 'vue'
import { tabOptions, accionesTabla } from 'config/utils'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { TabOption } from 'components/tables/domain/TabOption'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { EssentialTableTabs, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const { notificarAdvertencia } = useNotificaciones()

    const router = useRouter()

    const tareaStore = useTareaStore()
    if (tareaStore.tarea.id) listar({ tarea: tareaStore.tarea.id })

    const configuracionColumnas = [
      ...configuracionColumnasSubtareas,
      accionesTabla,
    ]

    const modales = new ComportamientoModalesSubtareaContent()

    const botonEditarSubtarea: CustomActionTable = {
      titulo: 'Ver/Editar',
      accion: ({ entidad }) => {
        tareaStore.consultarSubtarea(entidad.id)
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

    const verControlAvance: CustomActionTable = {
      titulo: 'Ver avances',
      accion: ({ entidad }) => {
        // router.push({ name: 'gestionar_avances' })
        // tareaStore.consultarSubtarea(entidad.id)
        modales.abrirModalEntidad('GestionarAvancesPage')
      },
    }

    if (!tareaStore.tarea.id)
      notificarAdvertencia('Cree una tarea antes de agregar subtareas.')

    const agregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      accion: () => {
        if (!tareaStore.tarea.id)
          notificarAdvertencia('Cree una tarea antes de agregar subtareas.')
        modales.abrirModalEntidad('SubtareasPage')

      },
    }

    function aplicarFiltro(tabSeleccionado) {
      console.log(tabSeleccionado)
      if (tareaStore.tarea.id) listar({ tarea: tareaStore.tarea.id, estado: tabSeleccionado })
    }

    return {
      configuracionColumnas,
      configuracionColumnasSubtareas,
      listado,
      botonEditarSubtarea,
      modales,
      agregarSubtarea,
      tabOptions,
      aplicarFiltro,
      verControlAvance,
    }
  },
})
