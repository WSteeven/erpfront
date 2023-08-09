import { rolesSistema } from "config/utils";
import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificacionStore } from "stores/notificacion";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class PreordenCompraEvent{
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start(){
        const {notificarCorrecto} = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal de preorden creada
        const preordenCreada = pusher.subscribe('preordenes-generadas-'+rolesSistema.compras)
        preordenCreada.bind('preorden-event', function(e){
            // notificacionStore.agregar(e.notificacion)
            notificacionStore.actualizar()
            notificarCorrecto('Tienes una preorden de compra esperando ser atendida')
        })
    }
}