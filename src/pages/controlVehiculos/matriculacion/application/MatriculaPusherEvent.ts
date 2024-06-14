import { rolesSistema } from "config/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class MatriculaPusherEvent{

    store = useAuthenticationStore()
    notificacionPusherStore = useNotificationRealtimeStore()

    start(){
        const notificacionStore = this.notificacionPusherStore

        //suscripcion al canal
        if(this.store.esAdministradorVehiculos){
            const tracker = notificacionStore.pusher.subscribe('matriculas-vehiculos')
            tracker.bind('matricula-event', function(e){
                notificacionStore.agregar(e.notificacion)
            })
        }
    }
}