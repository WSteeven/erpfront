import { useNotificaciones } from 'shared/notificaciones';
import Pusher from 'pusher-js'
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';

export class PedidoPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()
  // const emits=defineEmits(['notificar'])

  /**
   * It subscribes to a channel and listens for events.
  */
 start() {
   const { notificarCorrecto } = useNotificaciones()
   const notificacionStore = this.notificacionesPusherStore
   const pusher = notificacionStore.pusher
  //  console.log('se inicio el servicio de pusher', this.store.user.id)

    const channel = pusher.subscribe('pedidos-tracker-'+this.store.user.id)
    channel.bind('pedido-event', function (e) {
      console.log(e)
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Tienes un pedido esperando ser atendido')
      // new Event('notificar', e.mensaje)
      // new Event('notificar', 'Tienes un pedido pendiente de autorizar')//se crea el evento
      // console.log('Mensaje',e.mensaje)
    })
  }

}

