// Dependencias
import { configuracionColumnasTicketAsignado } from '../domain/configuracionColumnasTicketAsignado'
import { tabOptionsEstadosTicketsAsignados, estadosTickets } from 'config/tickets.utils'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, estadosTrabajos } from 'config/utils'
import { useTicketStore } from 'stores/ticket'
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import Callout from 'components/CalloutComponent.vue'

// Logica y controladores
import { ComportamientoModalesTicketAsignado } from '../application/ComportamientoModalesTicketAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { MotivoPausaTicketController } from 'pages/gestionTickets/motivosPausasTickets/infraestructure/MotivoPausaTicketController'
import { TicketModales } from 'pages/gestionTickets/tickets/domain/TicketModales'
import { TicketPusherEvent } from 'src/pusherEvents/TicketPusherEvent'

export default defineComponent({
  components: {
    EssentialTableTabs,
    EssentialTable,
    ModalesEntidad,
    ConfirmarDialog,
    Callout,
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
    const { listado, filtros } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        motivosPausas: {
          controller: new MotivoPausaTicketController(),
          params: { activo: 1 }
        }
      })
    })

    /************
     * Variables
     ************/
    const modales = new ComportamientoModalesTicketAsignado()
    const tabActual = ref()
    const {
      btnTransferir,
      btnEjecutar,
      btnPausar,
      btnReanudar,
      btnFinalizar,
      btnSeguimiento,
      setFiltrarTickets,
      btnRechazar,
      btnCalificarResponsable
    } = useBotonesTablaTicket(mixin, modales)
    setFiltrarTickets(filtrarTrabajoAsignado)
    const opcionesFiltrado = {
      listado: 'listado',
      individual: 'individual'
    }
    const tabsOpcionesFiltrado = ref(opcionesFiltrado.listado)
    /*********
     * Pusher
     *********/
    const ticketPusherEvent = new TicketPusherEvent(filtrarTrabajoAsignado)
    ticketPusherEvent.start()

    /***************
     * Botones tabla
     ***************/
    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        ticketStore.filaTicket = entidad
        modales.abrirModalEntidad('DetalleTicketAsignadoPage')
      }
    }

    /************
     * Funciones
     *************/
    async function filtrarTrabajoAsignado(tabSeleccionado: string) {
      filtros.fields = {estado: tabSeleccionado, responsable_id: authenticationStore.user.id, para_mi: true}
      await listar({responsable_id: authenticationStore.user.id, estado: tabSeleccionado, paginate: true, para_mi: true})
      tabActual.value = tabSeleccionado
    }

    filtrarTrabajoAsignado(estadosTrabajos.ASIGNADO)

    async function guardado(paginaModal: keyof TicketModales) {
      switch (paginaModal) {
        case 'CalificarTicketPage':
          await filtrarTrabajoAsignado(tabActual.value)
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
      botonVer,
      btnTransferir,
      btnEjecutar,
      btnPausar,
      btnReanudar,
      btnSeguimiento,
      btnFinalizar,
      btnRechazar,
      btnCalificarResponsable,
      tabActual,
      estadosTickets,
      fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
      guardado,
      tabsOpcionesFiltrado,
      opcionesFiltrado
    }
  }
})
