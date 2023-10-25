import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class ProformaEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //Cuando se crea una nueva proforma le avisa a la persona que autoriza para que apruebe o cancele la misma.
        const proformaCreada = pusher.subscribe('proformas-tracker-' + this.store.user.id)
        proformaCreada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Tienes una proforma pendiente de aprobación')
            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Proforma creada',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        // Cuando la persona que autoriza aprueba o anula una proforma se lanza esta notificación
        const proformaActualizada = pusher.subscribe('proformas-actualizadas-tracker-' + this.store.user.id)
        proformaActualizada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Se ha actualizado la proforma que generaste')
            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Proforma actualizada',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        // Cuando la persona que crea una proforma la modifica, se dispara la notificación a la persona que autorice
        const proformaModificada = pusher.subscribe('proformas-modificadas-tracker-' + this.store.user.id)
        proformaModificada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto(e.notificacion.mensaje)
        })

        // Avisa a la persona solicitante que ha pasado un tiempo y la proforma se anulará automaticamente
        const proformaAnulada = pusher.subscribe('proformas-vencidas-tracker-' + this.store.user.id)
        proformaAnulada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarAdvertencia('Tienes una proforma apunto de caducar')
            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Proforma vencida',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

    }
}