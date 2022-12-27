// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RegistroTendidoPage from 'tareas/tendidos/controlTendidos/modules/registrosTendidos/view/RegistroTendidoPage.vue'

export class ProgresivaModales {
  RegistroTendidoPage: ComponenteModal

  constructor() {
    this.RegistroTendidoPage = markRaw(
      new ComponenteModal('Agregar elemento', RegistroTendidoPage)
    )
  }
}
