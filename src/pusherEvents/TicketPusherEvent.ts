import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

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
      // notificacionStore.agregar(e.notificacion)
      console.log('Se agrega una notificacion')

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: e.notificacion.tipo_notificacion,
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }

}

