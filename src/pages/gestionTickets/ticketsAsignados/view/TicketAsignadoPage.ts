// Dependencias
import { configuracionColumnasTicketAsignado } from '../domain/configuracionColumnasTicketAsignado'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, estadosTrabajos } from 'config/utils'
import { tabOptionsEstadosTicketsAsignados, estadosTickets } from 'config/tickets.utils'
import { computed, defineComponent, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { MotivoSuspendidoController } from 'pages/gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { TrabajoAsignadoController } from 'gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'
import { ComportamientoModalesTicketAsignado } from '../application/ComportamientoModalesTicketAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { SubtareaListadoPusherEvent } from '../application/SubtareaPusherEvent'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { MotivoPausaTicketController } from 'pages/gestionTickets/motivosPausasTickets/infraestructure/MotivoPausaTicketController'

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

    /*******
    * Mixin
    ********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        motivosPausas: {
          controller: new MotivoPausaTicketController(),
          params: { activo: 1 },
        },
      })
    })

    /************
     * Variables
     ************/
    const mostrarDialogPlantilla = ref(false)
    const modales = new ComportamientoModalesTicketAsignado()
    const tabActual = ref()
    const { btnTransferir, btnEjecutar, btnPausar, btnReanudar, btnFinalizar, btnSeguimiento, setFiltrarTickets, btnRechazar } = useBotonesTablaTicket(mixin, modales)
    setFiltrarTickets(filtrarTrabajoAsignado)

    /*********
     * Pusher
     *********/
    const puedeEjecutar = computed(() => tabActual.value === estadosTickets.ASIGNADO)

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
        // modales.abrirModalEntidad('DetalleTrabajoAsignadoPage')
      },
    }

    /************
    * Funciones
    *************/
    async function filtrarTrabajoAsignado(tabSeleccionado) {
      listar({ responsable_id: authenticationStore.user.id, estado: tabSeleccionado })
      tabActual.value = tabSeleccionado
    }

    filtrarTrabajoAsignado(estadosTrabajos.ASIGNADO)

    // - Mostrar formulario modal de acuerdo a su tipo de trabajo
    const listadoModales = modales.getModales()

    function plantillaSeleccionada(plantilla: keyof typeof listadoModales) {
      mostrarDialogPlantilla.value = false
      modales.abrirModalEntidad(plantilla)
    }

    function abrirGuia() {
      modales.abrirModalEntidad('SeguimientoTicketPage')
    }

    return {
      mixin,
      listado,
      configuracionColumnasTicketAsignado,
      tabOptionsEstadosTicketsAsignados,
      filtrarTrabajoAsignado,
      accionesTabla,
      modales,
      mostrarDialogPlantilla,
      plantillaSeleccionada,
      botonVer,
      btnTransferir,
      btnEjecutar,
      btnPausar,
      btnReanudar,
      btnSeguimiento,
      btnFinalizar,
      btnRechazar,
      tabActual,
      abrirGuia,
      estadosTickets,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      authenticationStore,
    }
  }
})
