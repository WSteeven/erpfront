import { rolesSistema } from "config/utils";
import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class PreordenCompraEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal de preorden creada
        if (this.store.esCoordinadorBodega) {
            const preordenCreada = pusher.subscribe('preordenes-generadas-' + rolesSistema.bodega)
            preordenCreada.bind('preorden-event', function (e) {
                // notificacionStore.agregar(e.notificacion)
                notificacionStore.actualizar()
                notificarCorrecto('Tienes una preorden de compra esperando ser atendida')

                //lanzamos la notificación push en el navegador del destinatario
                pushEventMesaggeServiceWorker({
                    titulo: 'Preorden de compra nueva',
                    mensaje: e.notificacion.mensaje,
                    link: e.notificacion.link,
                })
            })
        }
    }
}