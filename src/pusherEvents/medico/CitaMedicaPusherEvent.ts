import {useAuthenticationStore} from 'stores/authentication';
import {useNotificationRealtimeStore} from 'stores/notificationRealtime';
import {PusherEventsEnum} from '../config/PusherEventsEnum';
import {pushEventMesaggeServiceWorker} from 'shared/utils';

export class CitaMedicaPusherEvent{
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    // Start
    start(){
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        pusher.subscribe(`${PusherEventsEnum.CITA_MEDICA}-tracker-${this.store.user.id}`)
        pusher.bind(`${PusherEventsEnum.CITA_MEDICA}-event`, function (e: { notificacion: Notificacion }) {
            notificacionStore.agregar(e.notificacion)
            pushEventMesaggeServiceWorker({
                titulo: e.notificacion.tipo_notificacion,
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })
    }
}