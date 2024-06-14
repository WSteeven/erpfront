import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class OrdenReparacionPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        const ordenReparacion = pusher.subscribe('ordenes-reparaciones-' + this.store.user.id)
        ordenReparacion.bind('ordenes-creadas', function (e) {
            notificacionStore.actualizar()

            notificarCorrecto('Tienes una orden de reparación de vehículo esperando ser atendida')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Orden de reparación de vehículo creada',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        ordenReparacion.bind('ordenes-actualizadas', function (e) {
            notificacionStore.actualizar()
            if (e.orden.autorizacion_id == 2) notificarCorrecto('Se ha aprobado tu orden de reparación')
            else notificarAdvertencia('Se ha cancelado tu orden de reparación')

            pushEventMesaggeServiceWorker({
                titulo: 'Orden de reparación de vehículo actualizada',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })
    }
}