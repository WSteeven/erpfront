import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';
import { rolesSistema } from 'config/utils';

export class PedidoPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
 async start() {
    console.log('iniciado el start en pedidopusherevent')
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher
    const user = this.store.user
    
    //suscripcion al canal del pedido creado
    const pedidoCreado = pusher.subscribe('pedidos-tracker-' + this.store.user.id)
    pedidoCreado.bind('pedido-event', function (e) {
      console.log(e)
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Tienes un pedido esperando ser atendido')
    })
    
    console.log(this.store.esBodeguero)
    //suscripcion al canal del pedido aprobado
    if(this.store.esBodeguero){
      console.log('Este usuario es bodeguero!!!!')
      const pedidoAutorizado = pusher.subscribe('pedidos-aprobados-'+rolesSistema.bodega) 
      console.log(pedidoAutorizado)
      pedidoAutorizado.bind('pedido-event', function(e){
        console.log('0000000')
        notificacionStore.agregar(e.notificacion)
        notificarCorrecto('Tienes un pedido esperando ser despachado')
      })
    }
  }

}

