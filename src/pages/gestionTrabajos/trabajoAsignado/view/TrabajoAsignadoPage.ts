// Dependencias
import { configuracionColumnasTrabajoAsignado } from '../domain/configuracionColumnasTrabajoAsignado'
import { tabTrabajoAsignado, accionesTabla, estadosTrabajos } from 'config/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { TrabajoAsignadoController } from 'gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CambiarEstadoTrabajo } from 'trabajos/application/CambiarEstadoTrabajo'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TrabajoController } from 'trabajos/infraestructure/TrabajoController'
import { SubtareaPusherEvent } from '../application/SubtareaPusherEvent'
import { ObtenerPlantilla } from '../application/ObtenerPlantilla'
import { obtenerTiempoActual } from 'shared/utils'
import { Trabajo } from 'trabajos/domain/Trabajo'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
    ConfirmarDialog,
  },
  setup() {
    const controller = new TrabajoController()
    const mostrarDialogPlantilla = ref(false)
    const { confirmar, prompt, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const modales = new ComportamientoModalesTrabajoAsignado()
    const tabActual = ref()

    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Trabajo, controller)
    const { listado } = mixin.useReferencias()

    /*********
     * Pusher
     *********/
    const puedeEjecutar = computed(() => tabActual.value === estadosTrabajos.ASIGNADO)

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
        trabajoAsignadoStore.idTrabajoSeleccionado = entidad.id
        modales.abrirModalEntidad('DetalleTrabajoAsignadoPage')
      },
    }

    const botonIniciar: CustomActionTable = {
      titulo: 'Iniciar',
      icono: 'bi-play-fill',
      color: 'positive',
      visible: ({ entidad }) => [estadosTrabajos.ASIGNADO].includes(entidad.estado) && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de iniciar el trabajo?', async () => {
          const { fecha, hora } = await obtenerTiempoActual()
          if (entidad.es_ventana) {
            if (fecha < entidad.fecha_agendado) {
              notificarAdvertencia('No puedes proceder. La ejecución del trabajo empieza el ' + entidad.fecha_agendado)
              return
            }

            if (hora < entidad.hora_inicio_agendado) {
              notificarAdvertencia('No puedes proceder. La ejecución del trabajo empieza a las ' + entidad.hora_inicio_agendado)
              return
            }
          }

          if (entidad.es_dependiente) {
            const { result: trabajoDependiente } = await controller.consultar(entidad.trabajo_dependiente_id)
            if (trabajoDependiente.estado !== estadosTrabajos.REALIZADO) {
              notificarAdvertencia('No puedes proceder. Primero debes finalizar con el trabajo ' + entidad.trabajo_dependiente)
              return
            }
          }

          const { result } = await new CambiarEstadoTrabajo().ejecutar(entidad.id)
          entidad.estado = estadosTrabajos.EJECUTANDO
          entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
          notificarCorrecto('Trabajo iniciado exitosamente!')
          actualizarElemento(posicion, entidad)
        })
      }
    }

    const botonPausar: CustomActionTable = {
      titulo: 'Pausar',
      icono: 'bi-pause',
      color: 'blue-6',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de pausar el trabajo?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Ingrese el motivo de la pausa',
            accion: (data) => {
              new CambiarEstadoTrabajo().pausar(entidad.id, data)
              entidad.estado = estadosTrabajos.PAUSADO
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
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.PAUSADO && entidad.es_responsable,
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de reanudar el trabajo?', () => {
          new CambiarEstadoTrabajo().reanudar(entidad.id)
          entidad.estado = estadosTrabajos.EJECUTANDO
          notificarCorrecto('Trabajo ha sido reanudado exitosamente!')
          actualizarElemento(posicion, entidad)
        })
      }
    }

    const botonFormulario: CustomActionTable = {
      titulo: 'Formulario',
      icono: 'bi-check2-square',
      color: 'indigo',
      visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO, estadosTrabajos.REALIZADO].includes(entidad.estado) && entidad.es_responsable,
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de abrir el formulario?', () => {
          trabajoAsignadoStore.idTrabajoSeleccionado = entidad.id

          const obtenerPlantilla = new ObtenerPlantilla()
          modales.abrirModalEntidad(obtenerPlantilla.obtener(entidad.tipo_trabajo))
        })
      }
    }

    const botonSuspender: CustomActionTable = {
      titulo: 'Suspender',
      icono: 'bi-x-diamond',
      color: 'negative',
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.ASIGNADO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de suspender el trabajo?', () => {
          const config: CustomActionPrompt = {
            mensaje: 'Ingrese el motivo de la suspención',
            accion: async (data) => {
              const { result } = await new CambiarEstadoTrabajo().suspender(entidad.id, data)
              entidad.estado = estadosTrabajos.SUSPENDIDO
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
      visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && entidad.es_responsable,
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de que completó el trabajo?', async () => {
          const { result } = await new CambiarEstadoTrabajo().realizar(entidad.id)
          entidad.estado = estadosTrabajos.REALIZADO
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
        listado.value.splice(posicion, 1, entidad)
        listado.value = [...listado.value]
      }
    }

    // - Filtrar trabajo asignado
    const trabajoAsignadoController = new TrabajoAsignadoController()

    async function filtrarTrabajoAsignado(tabSeleccionado) {
      const cargando = new StatusEssentialLoading()

      cargando.activar()

      const { result } = await trabajoAsignadoController.listar({ estado: tabSeleccionado })
      listado.value = result
      tabActual.value = tabSeleccionado

      cargando.desactivar()
    }

    filtrarTrabajoAsignado(estadosTrabajos.ASIGNADO)

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
