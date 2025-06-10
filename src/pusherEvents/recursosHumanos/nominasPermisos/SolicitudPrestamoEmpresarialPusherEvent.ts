import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class SolicitudPrestamoEmpresarialPusherEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
   */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    // console.log('solicitud-prestamo-empresarial-' + this.store.user.id);

    pusher.subscribe('solicitud-prestamo-empresarial-' + this.store.user.id)
    pusher.bind('solicitud-prestamo-empresarial-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      pushEventMesaggeServiceWorker({
        titulo: 'Solicitud de Prestamo Empresarial',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link
      })
    })
  }
}
