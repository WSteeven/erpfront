import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';
import { rolesSistema } from 'config/utils';
import EventEmitter from 'events';

export class PedidoPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    //suscripcion al canal del pedido creado
    const pedidoCreado = pusher.subscribe('pedidos-tracker-' + this.store.user.id)
    pedidoCreado.bind('pedido-event', function (e) {
      // notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      notificarCorrecto('Tienes un pedido esperando ser atendido')
    })

    //suscripcion al canal del pedido aprobado
    if (this.store.esBodeguero) {
      const pedidoAutorizado = pusher.subscribe('pedidos-aprobados-' + rolesSistema.bodega)
      pedidoAutorizado.bind('pedido-event', function (e) {
        // notificacionStore.agregar(e.notificacion)
        notificacionStore.actualizar()
        notificarCorrecto('Tienes un pedido esperando ser despachado')
      })
    }

    //suscripcion al canal general del service worker 
    const canalGeneral = pusher.subscribe('mi-canal')
    canalGeneral.bind('eventoPersonalizado', function (e) {
      console.log(e)
      notificarCorrecto('ServiceWorker evento: '+e)
    })

  }

}

