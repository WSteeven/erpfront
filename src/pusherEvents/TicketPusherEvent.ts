import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

export class TicketPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()
  accion?: (estadoTicket: string) => void
  // tabActual: Ref<string>

  constructor(accion?: (estadoTicket: string) => void) {//}, tabActual: Ref<string>) {
    if (accion) this.accion = accion
    // this.tabActual = tabActual
  }

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher
    const accion = this.accion
    // console.log(accion)
    // console.log(accion)
    // const tabActual = computed(() => this.tabActual.value)

    // Suscripcion al canal del pedido creado
    pusher.subscribe('tickets-tracker-' + this.store.user.id)
    pusher.bind('ticket-event', function (e) {
      // notificacionStore.agregar(e.notificacion)
      console.log(accion)
      console.log(e)
      console.log('Se agrega una notificacion')
      // console.log(tabActual.value)

      if (accion) accion(e.ticket.estado)

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: e.notificacion.tipo_notificacion,
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }

}

