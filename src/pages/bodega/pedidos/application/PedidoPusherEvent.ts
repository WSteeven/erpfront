import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';
import { rolesSistema } from 'config/utils';
import { pushEventMesaggeServiceWorker } from 'shared/utils';

export class PedidoPusherEvent {

  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
  */
  start() {
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    //suscripcion al canal del pedido creado
    const pedidoCreado = pusher.subscribe('pedidos-tracker-' + this.store.user.id)
    pedidoCreado.bind('pedido-event', function (e) {
      console.log(e)
      // notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      notificarCorrecto('Tienes un pedido esperando ser atendido')

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: 'Nuevo pedido creado',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

    //suscripcion al canal del pedido aprobado
    if (this.store.esBodeguero) {
      const pedidoAutorizado = pusher.subscribe('pedidos-aprobados-' + rolesSistema.bodega)
      pedidoAutorizado.bind('pedido-event', function (e) {
        // notificacionStore.agregar(e.notificacion)
        notificacionStore.actualizar()
        notificarCorrecto('Tienes un pedido esperando ser despachado')
        //lanzamos la notificación push en el navegador del destinatario
        pushEventMesaggeServiceWorker({
          titulo: 'Pedido aprobado',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      })
    }
    if (this.store.esBodegueroTelconet) {
      const pedidoAutorizado = pusher.subscribe('pedidos-aprobados-BODEGA_TELCONET')
      pedidoAutorizado.bind('pedido-event', function () {
        notificacionStore.actualizar()
        notificarCorrecto('Tienes un pedido esperando ser despachado')
      })
    }
    
    if(this.store.esCoordinadorBodega || this.store.esBodeguero){
      const pedidoParcial = pusher.subscribe('pedidos-parciales-BODEGA')
      pedidoParcial.bind('pedido-event', function (e) {
        console.log(e)
        notificacionStore.agregar(e.notificacion)
        notificarAdvertencia('Tienes varios pedidos parciales pendiente de despacho')
      })
    }
        
    
    // //suscripcion al canal general del service worker
    // const canalGeneral = pusher.subscribe('mi-canal')
    // canalGeneral.bind('eventoPersonalizado', function (e) {
    //   console.log(e)
    //   notificarCorrecto('ServiceWorker evento: '+e)
    // })

  }

}

