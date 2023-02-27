import { useNotificaciones } from 'shared/notificaciones';
import Pusher from 'pusher-js'
import { Ref } from 'vue'

export class PedidoPageEvent {
  accion: string
  puedeEjecutar: boolean


  constructor(accion: string, puedeEjecutar: boolean) {
    this.accion = accion
    this.puedeEjecutar = puedeEjecutar
  }

  /**
   * It subscribes to a channel and listens for events.
   */
  start() {
    const { notificarCorrecto } = useNotificaciones()
    const pusher = new Pusher('0df833686e4616dd7444', {
      cluster: 'sa1',
    })

    const accion = this.accion
    const puedeEjecutar = this.puedeEjecutar

    const channel = pusher.subscribe('pedidos-tracker')
    channel.bind('pedido-event', function (e) {
      console.log(e)
      // notificarCorrecto('Tienes un pedido esperando ser atendido')
      new Event('notificar', e.mensaje)//se crea el evento
      // console.log('Mensaje',e.mensaje)
    })
  }

}

