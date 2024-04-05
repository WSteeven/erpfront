import Pusher from 'pusher-js'
import { useNotificaciones } from 'shared/notificaciones'
import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { Ref } from 'vue'

export class GastoPusherEvent {
  authenticationStore = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()
  usuario = this.authenticationStore.user
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher
    pusher.subscribe('fondo-rotativo-' + this.usuario.id)
    pusher.bind('fondo-rotativo-event', function (e) {
      // console.log('pusher', e);
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      notificarCorrecto(e.notificacion.mensaje)
      pushEventMesaggeServiceWorker({
        titulo: 'Aprobacion de Gastos',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}
