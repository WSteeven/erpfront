// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import MovilizacionSubtareaPage from 'gestionTrabajos/movilizacionSubtareas/view/MovilizacionSubtareaPage.vue'
import TranferirTareaPage from 'gestionTrabajos/tareas/modules/transferirTareas/TranferirTareaPage.vue'
import ModoNoDisponiblePage from 'recursosHumanos/empleados/modules/modoNoDisponible/view/ModoNoDisponiblePage.vue'

export class MainLayoutModales {
  MovilizacionSubtareaPage: ComponenteModal
  TranferirTareaPage: ComponenteModal
  ModoNoDisponiblePage: ComponenteModal

  constructor() {
    this.MovilizacionSubtareaPage = markRaw(
      new ComponenteModal(
        'Movilización entre trabajos',
        MovilizacionSubtareaPage
      )
    )

    this.TranferirTareaPage = markRaw(
      new ComponenteModal('Transferir tareas activas', TranferirTareaPage)
    )

    this.ModoNoDisponiblePage = markRaw(
      new ComponenteModal('Configurar modo No Disponible', ModoNoDisponiblePage)
    )
  }
}
