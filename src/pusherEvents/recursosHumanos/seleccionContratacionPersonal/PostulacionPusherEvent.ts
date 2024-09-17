import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class PostulacionPusherEvent {
  store = useAuthenticationStore()
  notificaciones = useNotificationRealtimeStore()

  start() {
    const { notificarInformacion } = useNotificaciones()
    const notificacionStore = this.notificaciones
    const pusher = notificacionStore.pusher

    console.log(this.store.user.id)
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

    postulanteSeleccionado.bind('postulante-examenes-agendados-event', function(e){
      notificacionStore.agregar(e.notificacion)
      notificarInformacion('Se han agendado exámenes médicos para un postulante')

      pushEventMesaggeServiceWorker({
        titulo: "Agendamiento de exámenes médicos para un postulante",
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

    postulanteSeleccionado.bind('resultados-examenes-postulante-event', function(e){
      notificacionStore.agregar(e.notificacion)
      notificarInformacion('Se han actualizado los exámenes médicos de un postulante')

      pushEventMesaggeServiceWorker({
        titulo: "Resultados de exámenes médicos de un postulante",
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }
}
