import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'stores/authentication'
import { PusherEventsEnum } from '../config/PusherEventsEnum'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

export class SolicitudExamenPusherEvent {
  // Stores
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  // Start
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe(`${PusherEventsEnum.SOLICITUD_EXAMEN}-tracker-${this.store.user.id}`)
    pusher.bind(`${PusherEventsEnum.SOLICITUD_EXAMEN}-event`, function (e: { notificacion: Notificacion }) {
      console.log(e)
      console.log('notificacion...')
      notificacionStore.agregar(e.notificacion)

      pushEventMesaggeServiceWorker({
        titulo: e.notificacion.tipo_notificacion,
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}

