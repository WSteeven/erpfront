import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class ActualizarNotificacionesPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const notificacionesPusherStore = useNotificationRealtimeStore()
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    pusher.subscribe('actualizar-notificaciones-tracker')
    pusher.bind('actualizar-notificaciones-event', function () {
      // notificacionStore.agregar(e.notificacion)
      notificacionesPusherStore.listar() //cargar las notificaciones de la base de datos
    })
  }

}

