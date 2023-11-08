import { rolesSistema } from "config/utils";
import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class IngresoPusherEvent {
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start() {
        const { notificarCorrecto } = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore

        //suscripcion al canal de transaccion-ingreso creado
        const ingresoCreado = this.notificacionesPusherStore.pusher.subscribe('ingresos-compras-proveedores-' + rolesSistema.contabilidad)
        ingresoCreado.bind('ingreso-event', function (e) {
            notificacionStore.actualizar()
            notificarCorrecto('Se ha realizado un ingreso por compra en bodega')
            pushEventMesaggeServiceWorker({
                titulo: 'Nuevo ingreso por compra en bodega',
                mensaje: e.notificacion.mensaje,
                link: e.notificacion.link
            })
        })
    }
}

