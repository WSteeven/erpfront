import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';

export class EgresoPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore

        const egresoRealizado = notificacionStore.pusher.subscribe('egreso-' + this.store.user.id)
        // console.log(egresoRealizado)
        egresoRealizado.bind('egreso-event', function (e) {
            // console.log('egreso-event')
            notificacionStore.agregar(e.notificacion)
            notificacionStore.actualizar()
            notificarCorrecto('Te despacharon material de bodega')
        })
    }
}
