// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import MovilizacionSubtareaPage from 'gestionTrabajos/movilizacionSubtareas/view/MovilizacionSubtareaPage.vue'

export class MainLayoutModales {
  MovilizacionSubtareaPage: ComponenteModal

  constructor() {
    this.MovilizacionSubtareaPage = markRaw(
      new ComponenteModal('Movilización entre trabajos', MovilizacionSubtareaPage)
    )
  }
}
