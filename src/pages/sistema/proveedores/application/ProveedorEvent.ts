import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
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

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Calificación de proveedor',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        //se ejecuta cuando se actualiza a calificado un proveedor
        const proveedorCalificado = pusher.subscribe('proveedores-tracker-' + this.store.user.id)
        proveedorCalificado.bind('proveedor-calificado-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Un proveedor ha sido calificado, por favor revisa la notificación');
        })
    }
}