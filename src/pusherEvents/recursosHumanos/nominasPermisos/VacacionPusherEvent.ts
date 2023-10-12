import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class VacacionPusherEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
   */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    pusher.subscribe('vacacion-' + this.store.user.id)
    pusher.bind('vacacion-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      pushEventMesaggeServiceWorker({
        titulo: 'Vacaciones',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}
