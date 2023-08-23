import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class ProformaEvent{
    store = useAuthenticationStore()
    notificacionesPusherStore = useNotificationRealtimeStore()

    start(){
        const {notificarCorrecto, notificarAdvertencia} = useNotificaciones()
        const notificacionStore = this.notificacionesPusherStore
        const pusher = notificacionStore.pusher

        //suscripcion al canal
        const proformaCreada = pusher.subscribe('proformas-tracker-'+this.store.user.id)
        proformaCreada.bind('proforma-event', (e)=>{
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Tienes una proforma pendiente de aprobación')
        })
        
        const proformaActualizada = pusher.subscribe('proformas-actualizadas-tracker-' + this.store.user.id)
        proformaActualizada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarCorrecto('Se ha actualizado la proforma que generaste')
        })
        
        const proformaAnulada = pusher.subscribe('proformas-vencidas-tracker-'+this.store.user.id)
        proformaAnulada.bind('proforma-event', (e) => {
            notificacionStore.agregar(e.notificacion)
            notificarAdvertencia('Tienes una proforma apunto de caducar')
        })

    }
}