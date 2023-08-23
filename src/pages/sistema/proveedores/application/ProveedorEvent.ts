import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class ProveedorEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal
        const proveedorCreado = pusher.subscribe('proveedores-tracker-' + this.store.user.id)
        proveedorCreado.bind('proveedor-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Tienes un Proveedor nuevo por calificar');
        })
    }
}