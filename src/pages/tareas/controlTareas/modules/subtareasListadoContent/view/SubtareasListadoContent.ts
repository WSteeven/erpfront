// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabOptions, accionesTabla, estadosSubtareas, acciones } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent } from 'vue'
import { useTareaStore } from 'stores/tarea'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesSubtareaContent } from '../application/ComportamientoModalesSubtareaContent'
import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { Subtarea } from 'subtareas/domain/Subtarea'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'

export default defineComponent({
  components: { EssentialTableTabs, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const { confirmar, notificarCorrecto, prompt } = useNotificaciones()

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
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        subtareaListadoStore.idSubtareaSeleccionada = null
        tareaStore.accionSubtarea = acciones.nuevo
        modales.abrirModalEntidad('SubtareasPage')
      },
    }

    const imprimirListado: CustomActionTable = {
      titulo: 'Imprimir listado',
      icono: 'bi-printer',
      color: 'grey-8',
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

    const botonVerPausas: CustomActionTable = {
      titulo: 'Ver pausas',
      icono: 'bi-list',
      color: 'grey-8',
      visible: ({ entidad }) => true,
      accion: ({ entidad }) => {
        subtareaListadoStore.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('PausasRealizadasPage')
      }
    }

    /* const botonFinalizar: CustomActionTable = {
      titulo: 'Realizado',
      color: 'positive',
      icono: 'bi-check',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO,
      accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como realizada la subtarea?', () => {
        new CambiarEstadoSubtarea().realizar(entidad.id)
        entidad.estado = estadosSubtareas.REALIZADO
        actualizarElemento(posicion, entidad)
      }),
    } */

    const botonAsignar: CustomActionTable = {
      titulo: 'Asignar',
      color: 'indigo',
      icono: 'bi-person-fill-check',
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
      icono: 'bi-x-circle-fill',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
      accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
        const config: CustomActionPrompt = {
          mensaje: 'Ingrese el motivo de la cancelación',
          accion: async (data) => {
            const { result } = await new CambiarEstadoSubtarea().cancelar(entidad.id, data)
            entidad.estado = estadosSubtareas.CANCELADO
            entidad.fecha_hora_cancelacion = result.fecha_hora_cancelacion
            entidad.causa_cancelacion = result.causa_cancelacion
            notificarCorrecto('Trabajo cancelado exitosamente!')
            actualizarElemento(posicion, entidad)
          }
        }

        prompt(config)
      }),
    }

    const botonReagendar: CustomActionTable = {
      titulo: 'Reagendar',
      color: 'info',
      icono: 'bi-calendar-check',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
      accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
        const config: CustomActionPrompt = {
          mensaje: 'Ingrese la nueva fecha',
          tipo: 'date',
          accion: async (data) => {
            const { result } = await new CambiarEstadoSubtarea().reagendar(entidad.id, data)
            entidad.estado = estadosSubtareas.CREADO
            entidad.fecha_hora_creacion = result.fecha_hora_creacion
            notificarCorrecto('Trabajo reagendado exitosamente!')
            actualizarElemento(posicion, entidad)
          }
        }

        prompt(config)
      }),
    }

    const botonSubirArchivos: CustomActionTable = {
      titulo: 'Archivos',
      color: 'yellow-9',
      icono: 'bi-folder-fill',
      visible: () => true,
      accion: async ({ entidad, posicion }) => {
        subtareaListadoStore.idSubtareaSeleccionada = entidad.id
        subtareaListadoStore.posicionSubtareaSeleccionada = posicion
        modales.abrirModalEntidad('ArchivoSubtarea')
      }
    }

    function aplicarFiltro(tabSeleccionado) {
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
      imprimirListado,
      // botonFinalizar,
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
      botonVerPausas,
    }
  },
})
