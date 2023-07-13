import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class GastoCoordinadorPusherEvent {
  authenticationStore = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()
  usuario = this.authenticationStore.user
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe('solicitud-fondos-' + this.usuario.usuario_id)
    pusher.bind('solicitud-fondos-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Tienes una solicitud de fondos pendiente')

    })
  }
}
