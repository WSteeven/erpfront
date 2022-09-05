// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
// import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { useTareaStore } from 'stores/tarea'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { EssentialTable, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    // const router = useRouter()
    const { notificarAdvertencia } = useNotificaciones()

    const tareaStore = useTareaStore()
    if (tareaStore.tarea.id) listar({ tarea: tareaStore.tarea.id })

    const configuracionColumnas = [
      ...configuracionColumnasSubtareas,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const modales = new ComportamientoModalesSubtareaContent()

    const botonEditarSubtarea: CustomActionTable = {
      titulo: 'Gestionar',
      accion: (entidad) => {
        tareaStore.consultarSubtarea(entidad.id)
        modales.abrirModalEntidad('SubtareasPage')
        // router.replace({ name: 'Subtareas' })
      },
    }

    if (!tareaStore.tarea.id)
      notificarAdvertencia('Cree una tarea antes de agregar subtareas.')

    function agregarSubtarea() {
      if (!tareaStore.tarea.id)
        notificarAdvertencia('Cree una tarea antes de agregar subtareas.')
    }

    return {
      configuracionColumnas,
      configuracionColumnasSubtareas,
      listado,
      botonEditarSubtarea,
      modales,
      agregarSubtarea,
    }
  },
})
