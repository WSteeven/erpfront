import Pusher from 'pusher-js'
import { useAuthenticationStore } from 'stores/authentication'
import { Ref } from 'vue'

export class GastoPusherEvent {
   authenticationStore = useAuthenticationStore()
   usuario = this.authenticationStore.user
  start() {
    Pusher.logToConsole = true

    const pusher = new Pusher('0df833686e4616dd7444', {
      cluster: 'sa1',
    })
    pusher.subscribe('fondo-rotativo-'+this.usuario.id)
    pusher.bind('fondo-rotativo-event', function (e) {
      console.log('fondo-rotativo-event', e);

    })
  }
}
