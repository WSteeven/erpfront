import { rolesSistema } from "config/utils";
import { useNotificaciones } from "shared/notificaciones";
import { pushEventMesaggeServiceWorker } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useNotificationRealtimeStore } from "stores/notificationRealtime";

export class OrdenCompraEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    //suscripcion al canal
    const ordenCreada = pusher.subscribe('ordenes-tracker-' + this.store.user.id)
    ordenCreada.bind('orden-event', (e) => {
      notificacionStore.agregar(e.notificacion);
      notificarCorrecto('Tienes una order de compra pendiente de aprobación');

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: 'Orden de compra creada',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

    const ordenActualizada = pusher.subscribe('ordenes-actualizadas-tracker-' + this.store.user.id)
    ordenActualizada.bind('orden-event', (e) => {
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Se ha actualizado la orden de compra que generaste')

      //lanzamos la notificación push en el navegador del destinatario
      pushEventMesaggeServiceWorker({
        titulo: 'Orden de compra actualizada',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
    })

    // notificar orden de compra pagada al solicitante
    const notificarOrdenPagada = pusher.subscribe('notificar-ordenes-pagadas-'+this.store.user.id)
      notificarOrdenPagada.bind('notificar-orden-pagada', (e)=>{
        notificacionStore.agregar(e.notificacion)
        notificarCorrecto('La Orden de Compra que solicitaste ha sido pagada')

        pushEventMesaggeServiceWorker({
          titulo: 'Orden de compra pagada',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      })

    if (this.store.esContabilidad) {
      const notificarOrdenRealizada = pusher.subscribe('notificar-ordenes-realizadas-' + rolesSistema.contabilidad)
      notificarOrdenRealizada.bind('notificar-orden-realizada', (e) => {
        notificacionStore.agregar(e.notificacion)
        notificarCorrecto('Se ha marcada como realizada una Orden de Compra')

        pushEventMesaggeServiceWorker({
          titulo: 'Orden de compra realizada',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      })
    }

    if (this.store.esCompras) {
      const notificarOrdenActualizada = pusher.subscribe('notificar-ordenes-compras-aprobadas-' + rolesSistema.compras)
      notificarOrdenActualizada.bind('notificar-orden-compra-event', (e) => {
        notificacionStore.agregar(e.notificacion)
        notificarCorrecto('Se ha aprobado una Orden de Compra')

        //lanzamos la notificación push en el navegador del destinatario
        pushEventMesaggeServiceWorker({
          titulo: 'Orden de compra actualizada',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      })

      const notificarOrdenPagada = pusher.subscribe('notificar-ordenes-pagadas-compras-'+rolesSistema.compras)
      notificarOrdenPagada.bind('notificar-orden-pagada', (e)=>{
        notificacionStore.agregar(e.notificacion)
        notificarCorrecto('Contabilidad ha pagado una Orden de Compra')

        pushEventMesaggeServiceWorker({
          titulo: 'Orden de compra pagada',
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      })
    }
  }
}
