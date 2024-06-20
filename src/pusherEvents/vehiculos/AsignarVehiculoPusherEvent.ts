import { useNotificaciones } from 'shared/notificaciones';
import { pushEventMesaggeServiceWorker } from 'shared/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';

export class AsignarVehiculoPusherEvent {
    store = useAuthenticationStore()
    notificaciones = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificaciones
        const pusher = notificacionStore.pusher

        //suscripcion al canal
        const asignacionCreada = pusher.subscribe('asignacion-vehiculo-' + this.store.user.id)
        asignacionCreada.bind('asignacion-vehiculo-event', function (e) {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Se ha realizado una asignación de vehículo')

            pushEventMesaggeServiceWorker({
                titulo: 'Asignación de vehículo',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link
            })
        })
    }
}