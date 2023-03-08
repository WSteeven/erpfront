import { estadosTrabajos } from 'config/utils'
import Pusher from 'pusher-js'
import { Ref } from 'vue'

export class SubtareaPusherEvent {
  accion: (param: string) => void
  puedeEjecutar: Ref<boolean>

  constructor(accion: (param: string) => void, puedeEjecutar: Ref<boolean>) {
    this.accion = accion
    this.puedeEjecutar = puedeEjecutar
  }

  start() {
    //Pusher.logToConsole = true

    const pusher = new Pusher('0df833686e4616dd7444', {
      cluster: 'sa1',
    })

    const accion = this.accion
    const puedeEjecutar = this.puedeEjecutar

    pusher.subscribe('subtareas-tracker')
    pusher.bind('subtarea-event', function (e) {
      if (puedeEjecutar.value) accion(estadosTrabajos.AGENDADO)
    })
  }
}
