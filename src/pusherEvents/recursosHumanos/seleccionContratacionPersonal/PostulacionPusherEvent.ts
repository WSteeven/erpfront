import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class PostulacionPusherEvent {
  store = useAuthenticationStore()
  notificaciones = useNotificationRealtimeStore()

  start() {
    const { notificarCorrecto, notificarInformacion } = useNotificaciones()
    const notificacionStore = this.notificaciones
    const pusher = notificacionStore.pusher

    const postulanteSeleccionado = pusher.subscribe('postulante-seleccionado-' + this.store.user.id)
    postulanteSeleccionado.bind('postulante-seleccionado-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarInformacion('Hay un nuevo postulante seleccionado, por favor realiza los exámenes médicos')

      pushEventMesaggeServiceWorker({
        titulo: "Examenes medicos para el personal",
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

  }
}
