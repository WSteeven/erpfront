// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RegistroTendidoPage from 'formulariosTrabajos/tendidos/controlTendidos/modules/registrosTendidos/view/RegistroTendidoPage.vue'

export class TendidoModales {
  RegistroTendidoPage: ComponenteModal

  constructor() {
    this.RegistroTendidoPage = markRaw(
      new ComponenteModal('Agregar elemento', RegistroTendidoPage)
    )
  }
}
