// Dependencias
import { configuracionColumnasTrabajoAsignado } from '../domain/configuracionColumnasTrabajoAsignado'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, estadosTrabajos } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { tabTrabajoAsignado } from 'config/tareas.utils'
import { computed, defineComponent, reactive, Ref, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { TrabajoAsignadoController } from 'gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CambiarEstadoSubtarea } from 'pages/gestionTrabajos/subtareas/application/CambiarEstadoSubtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtareaPusherEvent } from '../application/SubtareaPusherEvent'
import { ObtenerPlantilla } from '../application/ObtenerPlantilla'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { MotivoPausa } from 'pages/gestionTrabajos/motivosPausas/domain/MotivoPausa'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'
import { MotivoPendienteController } from 'pages/gestionTrabajos/motivosPendientes/infraestructure/MotivoPausaController'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { MotivoSuspendidoController } from 'pages/gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
    ConfirmarDialog,
  },
  setup() {
    const mostrarDialogPlantilla = ref(false)
    const { confirmar, promptItems, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const modales = new ComportamientoModalesTrabajoAsignado()
    const tabActual = ref()

    /***********
    * Variables
    ************/
    const mixin = new ContenedorSimpleMixin(Subtarea, new TrabajoAsignadoController())
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        motivosPausas: new MotivoPausaController(),
        motivosPendientes: new MotivoPendienteController(),
        motivosSuspendidos: new MotivoSuspendidoController(),
      })
    })

    /*********
     * Pusher
     *********/
    const puedeEjecutar = computed(() => tabActual.value === estadosTrabajos.AGENDADO)

    const subtareaPusherEvent = new SubtareaPusherEvent(filtrarTrabajoAsignado, puedeEjecutar)
    subtareaPusherEvent.start()

    /***********
     * Stores
     ***********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()

    /***************
     * Botones tabla
     ***************/
    const botonVer: CustomActionTable = {
      titulo: 'Ver trabajo',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('DetalleTrabajoAsignadoPage')
      },
    }

    const botonIniciar: CustomActionTable = {
      titulo: 'Ejecutar',
      icono: 'bi-play-fill',
      color: 'positive',
      visible: ({ entidad }) => [estadosTrabajos.AGENDADO].includes(entidad.estado) && entidad.es_responsable && entidad.puede_ejecutar,
      accion: ({ entidad }) => {
        confirmar('¿Está seguro de iniciar el trabajo?', async () => {
          if (entidad.es_dependiente) {
            const { result: subtareaDependiente } = await new SubtareaController().consultar(entidad.subtarea_dependiente_id)
            if (subtareaDependiente.estado !== estadosTrabajos.REALIZADO) {
              notificarAdvertencia('No puedes proceder. Primero debes finalizar con el trabajo ' + subtareaDependiente.codigo_subtarea)
              return
            }
          }

          const { result } = await new CambiarEstadoSubtarea().ejecutar(entidad.id)
          entidad.estado = estadosTrabajos.EJECUTANDO
          entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
          notificarCorrecto('Trabajo iniciado exitosamente!')
          filtrarTrabajoAsignado(estadosTrabajos.AGENDADO)
        })
      }
    }

    const botonPausar: CustomActionTable = {
      titulo: 'Pausar',
      icono: 'bi-pause-circle',
      color: 'blue-6',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de pausar el trabajo?', () => {
          const config: CustomActionPrompt = reactive({
            mensaje: 'Seleccione el motivo de la pausa',
            accion: (idMotivoPausa) => {
              console.log(idMotivoPausa)
              new CambiarEstadoSubtarea().pausar(entidad.id, idMotivoPausa)
              entidad.estado = estadosTrabajos.PAUSADO
              notificarCorrecto('Trabajo pausado exitosamente!')
              eliminarElemento(posicion, entidad)
            },
            tipo: 'radio',
            items: listadosAuxiliares.motivosPausas.map((motivo: MotivoPausa) => {
              return {
                label: motivo.motivo,
                value: motivo.id
              }
            })
          })

          promptItems(config)
        })
      },
    }

    const botonReanudar: CustomActionTable = {
      titulo: 'Reanudar',
      icono: 'bi-play-circle',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.PAUSADO && entidad.es_responsable,
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de reanudar el trabajo?', () => {
          new CambiarEstadoSubtarea().reanudar(entidad.id)
          entidad.estado = estadosTrabajos.EJECUTANDO
          notificarCorrecto('Trabajo ha sido reanudado exitosamente!')
          eliminarElemento(posicion, entidad)
        })
      }
    }

    const botonFormulario: CustomActionTable = {
      titulo: 'Formulario',
      icono: 'bi-check2-square',
      color: 'indigo',
      visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO].includes(entidad.estado) && entidad.es_responsable,
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de abrir el formulario?', () => {
          trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id

          const obtenerPlantilla = new ObtenerPlantilla()
          modales.abrirModalEntidad(obtenerPlantilla.obtener(entidad.tipo_trabajo))
        })
      }
    }

    const botonSuspender: CustomActionTable = {
      titulo: 'Suspender',
      icono: 'bi-power',
      color: 'negative',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.AGENDADO && entidad.es_responsable && entidad.puede_ejecutar,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de suspender el trabajo?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Seleccione el motivo de la suspención del trabajo',
            accion: async (data) => {
              const { result } = await new CambiarEstadoSubtarea().suspender(entidad.id, data)
              entidad.estado = estadosTrabajos.SUSPENDIDO
              entidad.fecha_hora_suspendido = result.fecha_hora_suspendido
              notificarCorrecto('Trabajo suspendido exitosamente!')
              eliminarElemento(posicion, entidad)
            },
            tipo: 'radio',
            items: listadosAuxiliares.motivosSuspendidos.map((motivo: MotivoSuspendido) => {
              return {
                label: motivo.motivo,
                value: motivo.id
              }
            })
          }

          promptItems(config)
        })
      },
    }

    const btnPendiente: CustomActionTable = {
      titulo: 'Pendiente',
      icono: 'bi-clock',
      color: 'orange-8',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.AGENDADO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de marcar como pendiente el trabajo?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Seleccione el motivo por el que se marca el trabajo como pendiente',
            accion: async (idMotivoPendiente) => {
              const { response, result } = await new CambiarEstadoSubtarea().pendiente(entidad.id, idMotivoPendiente)
              entidad.estado = estadosTrabajos.PENDIENTE
              entidad.fecha_hora_pendiente = result.fecha_hora_pendiente
              notificarCorrecto(response.data.mensaje)
              eliminarElemento(posicion, entidad)
            },
            tipo: 'radio',
            items: listadosAuxiliares.motivosPendientes.map((motivo: MotivoPausa) => {
              return {
                label: motivo.motivo,
                value: motivo.id
              }
            })
          }

          promptItems(config)
        })
      },
    }

    const botonRealizar: CustomActionTable = {
      titulo: 'Realizado',
      icono: 'bi-check-circle',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de que completó el trabajo?', async () => {
          const { result } = await new CambiarEstadoSubtarea().realizar(entidad.id)
          entidad.estado = estadosTrabajos.REALIZADO
          entidad.fecha_hora_realizado = result.fecha_hora_realizado
          eliminarElemento(posicion, entidad)
          notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
        })
      }
    }

    /************
    * Funciones
    *************/
    // - Actualizar un elemento del listado de trabajo asignado
    function eliminarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1)
        // listado.value = [...listado.value]
      }
    }

    // - Filtrar trabajo asignado
    // const trabajoAsignadoController = new TrabajoAsignadoController()

    async function filtrarTrabajoAsignado(tabSeleccionado) {
      listar({ estado: tabSeleccionado })
      tabActual.value = tabSeleccionado
      //  const cargando = new StatusEssentialLoading()

      // cargando.activar()

      // const { result } = await trabajoAsignadoController.
      //listado.value = result

      // cargando.desactivar()
    }

    filtrarTrabajoAsignado(estadosTrabajos.AGENDADO)

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
      btnPendiente,
      botonReanudar,
      botonFormulario,
      botonSuspender,
      botonRealizar,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      authenticationStore,
    }
  }
})
