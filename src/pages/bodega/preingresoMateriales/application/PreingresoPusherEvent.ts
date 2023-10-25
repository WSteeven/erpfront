import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class PreingresoMaterialPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal
        const preingresoCreado = pusher.subscribe('preingresos-tracker-' + this.store.user.id)
        preingresoCreado.bind('preingreso-event', (e) => {
            notificacionStore.agregar(e.notificacion);
            notificarCorrecto('Tienes un preingreso de materiales por antender')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Preingreso de materiales recién creado',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        const preingresoActualizado = pusher.subscribe('preingresos-actualizados-tracker-' + this.store.user.id)
        preingresoActualizado.bind('preingreso-event', (e) => {
            notificacionStore.agregar(e.notificacion);
            notificarCorrecto('Se ha actualizado tu preingreso de materiales')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Preingreso de materiales actualizado',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })
    }
}