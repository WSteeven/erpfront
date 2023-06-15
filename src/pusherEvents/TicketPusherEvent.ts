import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class TicketPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    pusher.subscribe('tickets-tracker-' + this.store.user.id)
    pusher.bind('ticket-event', function (e) {
      notificacionStore.agregar(e.notificacion)
    })
  }

}

