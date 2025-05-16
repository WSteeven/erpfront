import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'stores/authentication'
import { PusherEventsEnum } from '../config/PusherEventsEnum'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

export class NotificarEntregaActivoFijoPusherEvent {
  // Stores
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  // Start
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe(`${PusherEventsEnum.ENTREGA_ACTIVO_FIJO}-tracker-${this.store.user.id}`)
    pusher.bind(`${PusherEventsEnum.ENTREGA_ACTIVO_FIJO}-event`, function (e: { notificacion: Notificacion }) {
      notificacionStore.agregar(e.notificacion)

      pushEventMesaggeServiceWorker({
        titulo: e.notificacion.tipo_notificacion,
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}

