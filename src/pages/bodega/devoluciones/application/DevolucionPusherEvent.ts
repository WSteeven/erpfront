import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { useNotificationRealtimeStore } from 'stores/notificationRealtime';
import { rolesSistema } from 'config/utils';
import { pushEventMesaggeServiceWorker } from 'shared/utils';

export class DevolucionPusherEvent {

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
    const devolucionCreada = pusher.subscribe('devoluciones-tracker-' + this.store.user.id)
    devolucionCreada.bind('devolucion-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      notificarCorrecto('Tienes una devolución esperando ser atendido')

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: 'Devolución creada',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
    })
    })

    
    //suscripcion al canal de devolucion actualizada
    const devolucionActualizada = pusher.subscribe('devoluciones-actualizadas-' + this.store.user.id)
    devolucionActualizada.bind('devolucion-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificacionStore.actualizar()
      notificarCorrecto('Tu devolución ha sido actualizada')

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: 'Devolución actualizada',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
    })
    })


    //suscripcion al canal del pedido aprobado
    if (this.store.esBodeguero) {
      const devolucionAutorizada = pusher.subscribe('devoluciones-aprobadas-' + rolesSistema.bodega)
      devolucionAutorizada.bind('devolucion-event', function (e) {
        notificacionStore.agregar(e.notificacion)
        notificacionStore.actualizar()
        notificarCorrecto('Tienes una devolución esperando ser atendida')
        //lanzamos la notificación push en el navegador del destinatario
        pushEventMesaggeServiceWorker({
          titulo: 'Devolución pendiente de ingresar a bodega',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
      })
      })
    }
  }

}

