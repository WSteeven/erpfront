// Dependencias
import { configuracionColumnasTicketAsignado } from '../domain/configuracionColumnasTicketAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, estadosTrabajos } from 'config/utils'
import { tabOptionsEstadosTicketsAsignados, estadosTickets } from 'config/tickets.utils'
import { computed, defineComponent, ref } from 'vue'
import { useTicketStore } from 'stores/ticket'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ComportamientoModalesTicketAsignado } from '../application/ComportamientoModalesTicketAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtareaListadoPusherEvent } from '../application/SubtareaPusherEvent'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { MotivoPausaTicketController } from 'pages/gestionTickets/motivosPausasTickets/infraestructure/MotivoPausaTicketController'
import { TicketModales } from 'pages/gestionTickets/tickets/domain/TicketModales'

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
    const ticketStore = useTicketStore()
    const authenticationStore = useAuthenticationStore()

    /*******
    * Mixin
    ********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { listado } = mixin.useReferencias()
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
    const { btnTransferir, btnEjecutar, btnPausar, btnReanudar, btnFinalizar, btnSeguimiento, setFiltrarTickets, btnRechazar, btnCalificar } = useBotonesTablaTicket(mixin, modales)
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
        ticketStore.filaTicket = entidad
        modales.abrirModalEntidad('DetalleTicketAsignadoPage')
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

    async function guardado(paginaModal: keyof TicketModales) {
      switch (paginaModal) {
        case 'CalificarTicketPage':
          if (!ticketStore.filaTicket.calificaciones.length) {
            const entidad = listado.value[ticketStore.posicionFilaTicket]
            entidad.pendiente_calificar = false
            listado.value.splice(ticketStore.posicionFilaTicket, 1, entidad)
          } else {
            filtrarTrabajoAsignado(estadosTickets.CALIFICADO)
          }
          break
      }
      modales.cerrarModalEntidad()
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
      botonVer,
      btnTransferir,
      btnEjecutar,
      btnPausar,
      btnReanudar,
      btnSeguimiento,
      btnFinalizar,
      btnRechazar,
      btnCalificar,
      tabActual,
      estadosTickets,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      authenticationStore,
      guardado,
    }
  }
})
