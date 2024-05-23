import { useNotificaciones } from "shared/notificaciones"
import { pushEventMesaggeServiceWorker } from "shared/utils"
import { useAuthenticationStore } from "stores/authentication"
import { useNotificationRealtimeStore } from "stores/notificationRealtime"

export class MantenimientoVehiculoPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        const nuevoMantenimiento = pusher.subscribe('nuevo-mantenimiento-vehiculo-' + this.store.user.id)
        nuevoMantenimiento.bind('mantenimiento-event', function (e) {
            notificacionStore.actualizar()

            notificarAdvertencia('Tienes un mantenimiento de vehículo que gestionar')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Mantenimiento de Vehículo',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
            })
        })

        const mantenimientoPendienteRetrasado = pusher.subscribe('mantenimientos-vehiculos-' + this.store.user.id)
        mantenimientoPendienteRetrasado.bind('mantenimiento-event', function (e) {
            notificacionStore.actualizar()

            notificarAdvertencia('Tienes un mantenimiento de vehículo que gestionar')

            //lanzamos la notificación push en el navegador del destinatario
            pushEventMesaggeServiceWorker({
                titulo: 'Mantenimiento de Vehículo',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link,
                icono: 'bi-exclamation-triangle-fill'
            })
        })

    }
}