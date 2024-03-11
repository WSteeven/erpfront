import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { estadosTrabajos } from 'config/utils'
import { Ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'

export class SubtareaListadoPusherEvent {
  store = useAuthenticationStore()
  accion: (param: string) => void
  puedeEjecutar: Ref<boolean>

  constructor(accion: (param: string) => void, puedeEjecutar: Ref<boolean>) {
    this.accion = accion
    this.puedeEjecutar = puedeEjecutar
  }

  start() {
    const pusher = useNotificationRealtimeStore().pusher
    const accion = this.accion
    const puedeEjecutar = this.puedeEjecutar

    pusher.subscribe('subtareas-tracker-' + this.store.user.id)
    pusher.bind('subtarea-event', function (e) {
      if (puedeEjecutar.value) accion(estadosTrabajos.AGENDADO)
    })
  }
}
