import { useNotificaciones } from 'shared/notificaciones';
import { pushEventMesaggeServiceWorker } from 'shared/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';

export class MultaConductorPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal 
        const multaCreada = pusher.subscribe('multas-choferes-' + this.store.user.id)
        multaCreada.bind('multas-choferes-event', function (e) {
            notificacionStore.actualizar()
            notificarCorrecto('Se ha registrado una multa de un conductor de JPConstrucred')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Nuevo pedido creado',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })
    }
}