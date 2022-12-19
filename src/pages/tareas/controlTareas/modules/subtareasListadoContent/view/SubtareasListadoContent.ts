// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabOptions, accionesTabla, estadosSubtareas, acciones } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent } from 'vue'
import { useTareaStore } from 'stores/tarea'
import { offset } from 'config/utils_tablas'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { useSubtareaListadoStore } from 'stores/subtareaListado'

export default defineComponent({
  components: { EssentialTableTabs, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado, currentPageListado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const { confirmar, notificarCorrecto } = useNotificaciones()

    const tareaStore = useTareaStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const estado = computed(() => tareaStore.tarea.estado)

    if (tareaStore.tarea.id) aplicarFiltro('CREADO')

    const configuracionColumnas = [
      ...configuracionColumnasSubtareas,
      accionesTabla,
    ]

    const modales = new ComportamientoModalesSubtareaContent()

    const agregarSubtarea: CustomActionTable = {
      titulo: 'Crear una subtarea',
      accion: () => {
        subtareaListadoStore.idSubtareaSeleccionada = null
        tareaStore.accionSubtarea = acciones.nuevo
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

    const botonEditarSubtarea: CustomActionTable = {
      titulo: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO ? 'Editar' : 'Visualizar',
      icono: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO ? 'bi-pencil' : 'bi-eye',
      accion: async ({ entidad, posicion }) => {
        tareaStore.accionSubtarea = entidad.estado === estadosSubtareas.CREADO ? acciones.editar : acciones.consultar

        modales.abrirModalEntidad('SubtareasPage')
        subtareaListadoStore.posicionSubtareaSeleccionada = posicion
        subtareaListadoStore.idSubtareaSeleccionada = entidad.id
      },
    }

    const botonControlAvance: CustomActionTable = {
      titulo: 'Control de avances',
      icono: 'bi-journal-text',
      color: 'indigo',
      visible: ({ entidad }) => [estadosSubtareas.EJECUTANDO, estadosSubtareas.REALIZADO, estadosSubtareas.PAUSADO].includes(entidad.estado),
      accion: ({ entidad }) => {
        subtareaListadoStore.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('GestionarAvancesPage')
      }
    }

    const botonFinalizar: CustomActionTable = {
      titulo: 'Realizado',
      color: 'positive',
      icono: 'bi-check',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO,
      accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como realizada la subtarea?', () => {
        new CambiarEstadoSubtarea().realizar(entidad.id)
        entidad.estado = estadosSubtareas.REALIZADO
        actualizarElemento(posicion, entidad)
      }),
    }

    const botonAsignar: CustomActionTable = {
      titulo: 'Asignar',
      color: 'indigo',
      icono: 'bi-person',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de asignar la subtarea?', async () => {
          const { result } = await new CambiarEstadoSubtarea().asignar(entidad.id)
          entidad.estado = estadosSubtareas.ASIGNADO
          entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
          actualizarElemento(posicion, entidad)
          notificarCorrecto('Subtarea asignada correctamente!')
        })
      },
    }

    const botonSolicitarMaterial: CustomActionTable = {
      titulo: 'Solicitar material',
      icono: 'bi-list',
      visible: ({ entidad }) => entidad.estado !== estadosSubtareas.REALIZADO,
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de asignar la subtarea?', () => {
          new CambiarEstadoSubtarea().asignar(entidad.id)
          entidad.estado = estadosSubtareas.ASIGNADO
          actualizarElemento(posicion, entidad)
        })
      },
    }

    const botonCancelar: CustomActionTable = {
      titulo: 'Cancelar',
      color: 'negative',
      icono: 'bi-x-octagon',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
      accion: async ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
        const { result } = await new CambiarEstadoSubtarea().cancelar(entidad.id)
        entidad.estado = estadosSubtareas.CANCELADO
        entidad.fecha_hora_cancelacion = result.fecha_hora_cancelacion
        actualizarElemento(posicion, entidad)
        notificarCorrecto('Subtarea cancelada correctamente!')
      }),
    }

    const botonReagendar: CustomActionTable = {
      titulo: 'Reagendar',
      color: 'info',
      icono: 'bi-calendar-check',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
      accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
        new CambiarEstadoSubtarea().realizar(entidad.id)
        entidad.estado = estadosSubtareas.REALIZADO
        actualizarElemento(posicion, entidad)
      }),
    }

    const botonSubirArchivos: CustomActionTable = {
      titulo: 'Archivos',
      color: 'yellow-9',
      icono: 'bi-folder-fill',
      visible: () => true,
      accion: async ({ entidad, posicion }) => {
        subtareaListadoStore.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('GestorArchivoSubtareaPage')
      }
    }

    function aplicarFiltro(tabSeleccionado) {
      console.log(tabSeleccionado)
      subtareaListadoStore.filtroEstadoSeleccionado = tabSeleccionado
      if (tareaStore.tarea.id) listar({ tarea_id: tareaStore.tarea.id, estado: tabSeleccionado })
    }

    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad);
        listado.value = [...listado.value];
      }
    }

    return {
      mixin,
      configuracionColumnasSubtareas,
      configuracionColumnas,
      botonEditarSubtarea,
      botonControlAvance,
      botonSubirArchivos,
      agregarSubtarea,
      botonFinalizar,
      aplicarFiltro,
      botonAsignar,
      botonSolicitarMaterial,
      tabOptions,
      listado,
      modales,
      botonCancelar,
      botonReagendar,
      estado,
      estadosSubtareas,
    }
  },
})
