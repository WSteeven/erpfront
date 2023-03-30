import Pusher from 'pusher-js'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { Ref } from 'vue'

export class TransferenciaSaldoPusherEvent {
   authenticationStore = useAuthenticationStore()
   notificacionesPusherStore = useNotificationRealtimeStore()
   usuario = this.authenticationStore.user
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher
    pusher.subscribe('transferencia-saldo-'+this.usuario.id)
    pusher.bind('transferencia-saldo-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Tienes una transferencia esperando ser aceptada')
   })

  }
}


