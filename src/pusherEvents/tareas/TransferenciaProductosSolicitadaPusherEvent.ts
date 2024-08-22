import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'stores/authentication'
import { PusherEventsEnum } from '../config/PusherEventsEnum'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

export class TransferenciaProductoSolicitadaPusherEvent {
  // Stores
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  // Start
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe(`${PusherEventsEnum.TRANSFERENCIA_PRODUCTOS_SOLICITADA}-tracker-${this.store.user.id}`)
    pusher.bind(`${PusherEventsEnum.TRANSFERENCIA_PRODUCTOS_SOLICITADA}-event`, function (e: { notificacion: Notificacion }) {
      notificacionStore.agregar(e.notificacion)

      pushEventMesaggeServiceWorker({
        titulo: e.notificacion.tipo_notificacion,
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}

