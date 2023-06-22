// Dependencias
import { configuracionColumnasTrabajoAsignado } from '../domain/configuracionColumnasTrabajoAsignado'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, estadosTrabajos } from 'config/utils'
import { tabTrabajoAsignado } from 'config/tareas.utils'
import { computed, defineComponent, ref } from 'vue'
import { date, useQuasar } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { MotivoSuspendidoController } from 'pages/gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { TrabajoAsignadoController } from 'gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { SubtareaListadoPusherEvent } from '../application/SubtareaPusherEvent'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
    ConfirmarDialog,
  },
  setup() {
    /***********
    * Stores
    ***********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /*******
    * Mixin
    ********/
    const mixin = new ContenedorSimpleMixin(Subtarea, new TrabajoAsignadoController())
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        motivosPausas: new MotivoPausaController(),
        motivosSuspendidos: new MotivoSuspendidoController(),
      })
    })

    /************
     * Variables
     ************/
    const mostrarDialogPlantilla = ref(false)
    const modales = new ComportamientoModalesTrabajoAsignado()
    const tabActual = ref()
    const { btnIniciar, btnPausar, btnReanudar, btnRealizar, btnSeguimiento, btnSuspender, setFiltrarTrabajoAsignado } = useBotonesTablaSubtarea(listado, modales, listadosAuxiliares)
    setFiltrarTrabajoAsignado(filtrarTrabajoAsignado)

    /*********
     * Pusher
     *********/
    const puedeEjecutar = computed(() => tabActual.value === estadosTrabajos.AGENDADO)

    const subtareaPusherEvent = new SubtareaListadoPusherEvent(filtrarTrabajoAsignado, puedeEjecutar)
    subtareaPusherEvent.start()

    /***************
     * Botones tabla
     ***************/
    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
        modales.abrirModalEntidad('DetalleTrabajoAsignadoPage')
      },
    }

    /************
    * Funciones
    *************/
    async function filtrarTrabajoAsignado(tabSeleccionado) {
      listar({ estado: tabSeleccionado })
      tabActual.value = tabSeleccionado
    }

    filtrarTrabajoAsignado(estadosTrabajos.AGENDADO)

    // - Mostrar formulario modal de acuerdo a su tipo de trabajo
    const listadoModales = modales.getModales()

    function plantillaSeleccionada(plantilla: keyof typeof listadoModales) {
      mostrarDialogPlantilla.value = false
      modales.abrirModalEntidad(plantilla)
    }

    function abrirGuia() {
      modales.abrirModalEntidad('GuiaSubtareasPage')
    }

    return {
      mixin,
      listado,
      configuracionColumnasTrabajoAsignado,
      btnIniciar,
      botonVer,
      tabTrabajoAsignado,
      filtrarTrabajoAsignado,
      accionesTabla,
      modales,
      mostrarDialogPlantilla,
      plantillaSeleccionada,
      btnPausar,
      btnReanudar,
      btnSeguimiento,
      btnSuspender,
      btnRealizar,
      tabActual,
      abrirGuia,
      // botonCorregir,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      authenticationStore,
    }
  }
})
