// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareasPage from 'pages/tareas/subtareas/view/SubtareaPage.vue'
import GestionarAvancesPage from 'pages/tareas/subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'

export class SubtareaListadoContentModales {
  SubtareasPage: ComponenteModal
  GestionarAvancesPage: ComponenteModal

  constructor() {
    this.SubtareasPage = markRaw(
      new ComponenteModal('CONSTRUCRED', SubtareasPage)
    ),
      this.GestionarAvancesPage = markRaw(
        new ComponenteModal('CONSTRUCRED', GestionarAvancesPage)
      )
  }
}
