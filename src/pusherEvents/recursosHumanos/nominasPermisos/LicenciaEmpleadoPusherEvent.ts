import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class LicenciaPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    console.log('licencia-empleado-' + this.store.user.id);

    pusher.subscribe('licencia-empleado-' + this.store.user.id)
    pusher.bind('licencia-empleado-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
    })
  }

}

