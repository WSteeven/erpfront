import { useNotificaciones } from 'shared/notificaciones'
import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class BitacoraVehicularPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const {  notificarAdvertencia } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        const bitacoraActualizada = pusher.subscribe('bitacora-vehiculo-' + this.store.user.id)
        bitacoraActualizada.bind('bajo-nivel-combustible', function (e) {
            notificacionStore.actualizar()

            notificarAdvertencia('Un vehículo ha finalizado su jornada con poco combustible en su tanque')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Vehículo con bajo nivel de combustible',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        const bitacoraAdvertencia = pusher.subscribe('bitacora-vehiculo-advertencia-' + this.store.user.id)
        bitacoraAdvertencia.bind('bitacora-vehiculo-advertencia', function (e) {
            notificacionStore.actualizar()
            notificarAdvertencia('Un vehículo ha finalizado su jornada con advertencias')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Vehículo con señales de advertencia',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
                icono: 'bi-exclamation-triangle-fill'
            })
        })
    }
}