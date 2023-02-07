// Dependencias
import { configuracionColumnasTrabajoAsignado } from '../domain/configuracionColumnasTrabajoAsignado'
import { tabTrabajoAsignado, accionesTabla, estadosSubtareas } from 'config/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'pages/tareas/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { CambiarEstadoSubtarea } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/application/CambiarEstadoSubtarea'
import { SubtareaController } from 'pages/tareas/controlTareas/modules/subtareas/infraestructure/SubtareaController'
import { TrabajoAsignadoController } from '../modules/subtareasAsignadas/infraestructure/TipoTrabajoController'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Subtarea } from 'pages/tareas/controlTareas/modules/subtareas/domain/Subtarea'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtareaPusherEvent } from '../application/SubtareaPusherEvent'
import { obtenerTiempoActual } from 'shared/utils'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
    ConfirmarDialog,
  },
  setup() {
    const controller = new SubtareaController()
    const mostrarDialogPlantilla = ref(false)
    const { confirmar, prompt, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const modales = new ComportamientoModalesTrabajoAsignado()
    const tabActual = ref()

    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Subtarea, controller)
    const { listado } = mixin.useReferencias()

    /*********
     * Pusher
     *********/
    const puedeEjecutar = computed(() => tabActual.value === estadosSubtareas.ASIGNADO)

    const subtareaPusherEvent = new SubtareaPusherEvent(filtrarTrabajoAsignado, puedeEjecutar)
    subtareaPusherEvent.start()

    /***********
     * Stores
     ***********/
    const store = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()

    /***************
     * Botones tabla
     ***************/
    const botonVer: CustomActionTable = {
      titulo: 'Visualizar',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        store.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('SubtareaAsignadaPage')
      },
    }

    const botonIniciar: CustomActionTable = {
      titulo: 'Iniciar',
      icono: 'bi-play-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => [estadosSubtareas.ASIGNADO].includes(entidad.estado) && entidad.responsable,//(entidad.estado === estadosSubtareas.SUSPENDIDO && entidad.es_primera_asignacion),
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de iniciar el trabajo?', async () => {
          const { fecha, hora } = await obtenerTiempoActual()
          if (entidad.es_ventana) {
            if (fecha < entidad.fecha_ventana) {
              notificarAdvertencia('No puedes proceder. La ejecución del trabajo empieza el ' + entidad.fecha_ventana)
              return
            }

            if (hora < entidad.hora_inicio_ventana) {
              notificarAdvertencia('No puedes proceder. La ejecución del trabajo empieza a las ' + entidad.hora_inicio_ventana)
              return
            }
          }

          if (entidad.es_dependiente) {
            const { result: subtareaDependiente } = await controller.consultar(entidad.subtarea_dependiente_id)
            if (subtareaDependiente.estado !== estadosSubtareas.REALIZADO) {
              notificarAdvertencia('No puedes proceder. Primero debes finalizar con el trabajo ' + entidad.subtarea_dependiente)
              return
            }
          }

          const { result } = await new CambiarEstadoSubtarea().ejecutar(entidad.id)
          entidad.estado = estadosSubtareas.EJECUTANDO
          entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
          notificarCorrecto('Trabajo iniciado exitosamente!')
          actualizarElemento(posicion, entidad)
        })
      }
    }

    const botonPausar: CustomActionTable = {
      titulo: 'Pausar',
      icono: 'bi-pause',
      color: 'grey-8',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO && entidad.responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de pausar la subtarea?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Ingrese el motivo de la pausa',
            accion: (data) => {
              new CambiarEstadoSubtarea().pausar(entidad.id, data)
              entidad.estado = estadosSubtareas.PAUSADO
              notificarCorrecto('Trabajo pausado exitosamente!')
              actualizarElemento(posicion, entidad)
            }
          }

          prompt(config)
        })
      },
    }

    const botonReanudar: CustomActionTable = {
      titulo: 'Reanudar',
      icono: 'bi-play-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.PAUSADO && entidad.responsable,
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de reanudar el trabajo?', () => {
          new CambiarEstadoSubtarea().reanudar(entidad.id)
          entidad.estado = estadosSubtareas.EJECUTANDO
          notificarCorrecto('Trabajo ha sido reanudado exitosamente!')
          actualizarElemento(posicion, entidad)
        })
      }
    }

    const botonFormulario: CustomActionTable = {
      titulo: 'Formulario',
      icono: 'bi-textarea-t',
      color: 'secondary',
      visible: ({ entidad }) => [estadosSubtareas.EJECUTANDO, estadosSubtareas.REALIZADO].includes(entidad.estado) && entidad.responsable,
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de abrir el formulario?', () => {
          store.idSubtareaSeleccionada = entidad.id
          // modales.abrirModalEntidad('SeleccionFormularioPage')
          // modales.abrirModalEntidad('ControlTendido')
          // router.push({ name: 'control_tendidos' })
          modales.abrirModalEntidad('EmergenciaPage')
        })
      }
    }

    const botonSuspender: CustomActionTable = {
      titulo: 'Suspender',
      icono: 'bi-x-diamond',
      color: 'negative',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.ASIGNADO && entidad.responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de suspender el trabajo?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Ingrese el motivo de la suspención',
            accion: async (data) => {
              const { result } = await new CambiarEstadoSubtarea().suspender(entidad.id, data)
              entidad.estado = estadosSubtareas.SUSPENDIDO
              entidad.fecha_hora_suspendido = result.fecha_hora_suspendido
              notificarCorrecto('Trabajo suspendido exitosamente!')
              actualizarElemento(posicion, entidad)
            }
          }

          prompt(config)
        })
      },
    }

    const botonRealizar: CustomActionTable = {
      titulo: 'Realizado',
      icono: 'bi-check',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO && entidad.responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de que completó el trabajo?', async () => {
          const { result } = await new CambiarEstadoSubtarea().realizar(entidad.id)
          entidad.estado = estadosSubtareas.REALIZADO
          entidad.fecha_hora_realizado = result.fecha_hora_realizado
          actualizarElemento(posicion, entidad)
          notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
        })
      }
    }

    /************
    * Funciones
    *************/
    // - Actualizar un elemento del listado de trabajo asignado
    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad);
        listado.value = [...listado.value];
      }
    }

    // - Filtrar trabajo asignado
    const trabajoAsignadoController = new TrabajoAsignadoController()

    async function filtrarTrabajoAsignado(tabSeleccionado) {
      const { result } = await trabajoAsignadoController.listar({ estado: tabSeleccionado }) //grupo_id: grupo_id,
      listado.value = result
      tabActual.value = tabSeleccionado
    }

    filtrarTrabajoAsignado(estadosSubtareas.ASIGNADO)

    // - Mostrar formulario modal de acuerdo a su tipo de trabajo
    const listadoModales = modales.getModales()

    function plantillaSeleccionada(plantilla: keyof typeof listadoModales) {
      mostrarDialogPlantilla.value = false
      modales.abrirModalEntidad(plantilla)
    }

    return {
      listado,
      configuracionColumnasTrabajoAsignado,
      botonIniciar,
      botonVer,
      tabTrabajoAsignado,
      filtrarTrabajoAsignado,
      accionesTabla,
      modales,
      mostrarDialogPlantilla,
      plantillaSeleccionada,
      botonPausar,
      botonReanudar,
      botonFormulario,
      botonSuspender,
      botonRealizar,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      authenticationStore,
    }
  }
})
