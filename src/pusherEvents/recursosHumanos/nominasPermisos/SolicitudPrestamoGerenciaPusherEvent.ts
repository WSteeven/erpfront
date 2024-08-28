import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class SolicitudPrestamoGerenciaPusherEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to the management channel and listens for events.
   */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe('solicitud-prestamo-empresarial-gerencia-' + this.store.user.id)
    pusher.bind('solicitud-prestamo-empresarial-gerencia-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      pushEventMesaggeServiceWorker({
        titulo: 'Solicitud de Prestamo Empresarial (Gerencia)',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link
      })
    })
  }
}
