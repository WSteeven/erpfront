import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class OrdenCompraEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal
        const ordenCreada = pusher.subscribe('ordenes-tracker-' + this.store.user.id)
        ordenCreada.bind('orden-event', (e) => {
            notificacionStore.agregar(e.notificacion);
            notificarCorrecto('Tienes una order de compra pendiente de aprobación');
        })

        const ordenActualizada = pusher.subscribe('ordenes-actualizadas-tracker-' + this.store.user.id)
        ordenActualizada.bind('orden-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Se ha actualizado la orden de compra que generaste')
        })
    }
}