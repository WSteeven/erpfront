// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RegistroTendidoPage from 'tareas/tendidos/controlTendidos/modules/registrosTendidos/view/RegistroTendidoPage.vue'
import ResumenTendidoPage from 'tareas/tendidos/controlTendidos/modules/resumenTendido/view/ResumenTendidoPage.vue'

export class TendidoModales {
  RegistroTendidoPage: ComponenteModal
  ResumenTendidoPage: ComponenteModal

  constructor() {
    this.RegistroTendidoPage = markRaw(
      new ComponenteModal('Agregar elemento', RegistroTendidoPage)
    )
    this.ResumenTendidoPage = markRaw(
      new ComponenteModal('Resumen del tendido', ResumenTendidoPage)
    )
  }
}
