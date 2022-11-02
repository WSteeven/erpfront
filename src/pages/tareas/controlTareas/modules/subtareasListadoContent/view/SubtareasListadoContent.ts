// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { tabOptions, accionesTabla, estadosSubtareas } from 'config/utils'
import { useTareaStore } from 'stores/tarea'
import { defineComponent } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
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

    const agregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      accion: () => {
        tareaStore.resetearSubtarea()
        tareaStore.subtarea.tarea_id = tareaStore.tarea.id
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

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
      accion: ({ entidad }) => modales.abrirModalEntidad('GestionarAvancesPage'),
    }

    const botonFinalizar: CustomActionTable = {
      titulo: 'Realizado',
      color: 'positive',
      visible: (entidad) => entidad.estado !== 'REALIZADO' && entidad.estado !== 'CREADO',
      accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como realizada la tarea?', () => {
        new CambiarEstadoSubtarea().realizar(entidad.id)
        entidad.estado = estadosSubtareas.REALIZADO
        actualizarElemento(posicion, entidad)
      }),
    }

    const botonAsignar: CustomActionTable = {
      titulo: 'Asignar',
      color: 'indigo',
      visible: (entidad) => entidad.estado !== estadosSubtareas.REALIZADO && entidad.estado !== estadosSubtareas.EJECUTANDO && entidad.estado !== estadosSubtareas.ASIGNADO,
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de asignar la tarea?', () => {
          new CambiarEstadoSubtarea().asignar(entidad.id)
          entidad.estado = estadosSubtareas.ASIGNADO
          actualizarElemento(posicion, entidad)
        })
      },
    }

    function aplicarFiltro(tabSeleccionado) {
      if (tareaStore.tarea.id) listar({ tarea_id: tareaStore.tarea.id, estado: tabSeleccionado })
    }

    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad);
        listado.value = [...listado.value];
      }
    }

    return {
      configuracionColumnasSubtareas,
      configuracionColumnas,
      botonEditarSubtarea,
      verControlAvance,
      agregarSubtarea,
      botonFinalizar,
      aplicarFiltro,
      botonAsignar,
      tabOptions,
      listado,
      modales,
    }
  },
})
