import { useNotificaciones } from 'shared/notificaciones'
import { pushEventMesaggeServiceWorker } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { computed } from 'vue'

export class TransferenciaContabilidadPusherEvent {
   authenticationStore = useAuthenticationStore()
   notificacionesPusherStore = useNotificationRealtimeStore()
   usuario = this.authenticationStore.user
   esContabilidad = computed(() => {
    return this.usuario.roles.findIndex((rol) => rol === 'CONTABILIDAD') > -1 ? true : false
  })
  rol = this.esContabilidad.value === true ? 6 : 0
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher
    // console.log('transferencia-saldo-contabilidad-'+this.rol);

    pusher.subscribe('transferencia-saldo-contabilidad-'+this.rol)
    pusher.bind('transferencia-saldo-contabilidad-event', function (e) {
      notificacionStore.agregar(e.notificacion)
      notificarCorrecto('Han realizado  o aprobado una transferencia de saldo')
      pushEventMesaggeServiceWorker({
        titulo: 'Informacion de Transferencias de Saldos',
        mensaje: e.notificacion.mensaje,
        link: e.notificacion.link,
      })
   })

  }
}


