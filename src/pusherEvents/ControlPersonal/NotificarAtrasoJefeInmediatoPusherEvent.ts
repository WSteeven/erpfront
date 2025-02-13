import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useNotificaciones } from 'shared/notificaciones'
import { pushEventMesaggeServiceWorker } from 'shared/utils'

export  class NotificarAtrasoJefeInmediatoPusherEvent{
  // Store
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  start(){
  const { notificarAdvertencia } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    const notificarAJefeInmediato = pusher.subscribe(`atrasos-tracker-${this.store.user.id}`)
    notificarAJefeInmediato.bind('atrasos-event', (e)=>{
      notificacionStore.actualizar()
      notificarAdvertencia('Se ha obtenido un registro de atraso ')

      pushEventMesaggeServiceWorker({
        titulo: 'Atraso de empleado',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link
      })
    })
  }
}
