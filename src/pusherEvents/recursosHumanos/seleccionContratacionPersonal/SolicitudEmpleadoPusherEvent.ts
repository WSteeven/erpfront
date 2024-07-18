import { useAuthenticationStore } from '../../../stores/authentication';
import { useNotificationRealtimeStore } from '../../../stores/notificationRealtime';
import { useNotificaciones } from '../../../shared/notificaciones';
import { pushEventMesaggeServiceWorker } from '../../../shared/utils';
export class
SolicitudEmpleadoPusherEvent
{
  store = useAuthenticationStore()
  notificaciones = useNotificationRealtimeStore()

  start(){
    const { notificarInformacion } = useNotificaciones()
    const notificacionStore = this.notificaciones
    const pusher = notificacionStore.pusher

    //suscripcion al canal
    const solicitudCreada = pusher.subscribe('solicitud-personal-' + this.store.user.id)
    solicitudCreada.bind('solicitud-personal-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarInformacion('Se ha actualizado una solicitud de contratación de empleado')

      pushEventMesaggeServiceWorker({
        titulo: 'Solicitud de nuevo empleado',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

    //suscripcion al canal para RRHH
    const solicitudAprobada = pusher.subscribe('solicitud-personal-aprobada-'+this.store.user.id)
    solicitudAprobada.bind('solicitud-personal-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarInformacion('Se ha aprobado una solicitud de contratación de empleado')

      pushEventMesaggeServiceWorker({
        titulo: 'Crea nueva vacante de empleado',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}
