import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'

export class PermisoEmpleadoPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    // console.log('permiso-empleado-' + this.store.user.id);

    pusher.subscribe('permiso-empleado-' + this.store.user.id)
    pusher.bind('permiso-empleado-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      pushEventMesaggeServiceWorker({
        titulo: 'Permisos de Empleados',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })
  }

}

