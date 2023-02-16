// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import TipoTareaPage from 'pages/tareas/tiposTareas/view/TipoTrabajoPage.vue'
import EmergenciasPage from 'tareas/controlTareas/modules/subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'

export class SubtareaModales {
  TipoTareaPage: ComponenteModal
  EmergenciasPage: ComponenteModal

  constructor() {
    this.TipoTareaPage = markRaw(
      new ComponenteModal('CONSTRUCRED', TipoTareaPage)
    )
    this.EmergenciasPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciasPage)
    )
  }
}
