// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareasPage from 'pages/tareas/subtareas/view/SubtareaPage.vue'

export class SubtareaContentModales {
  SubtareasPage: ComponenteModal

  constructor() {
    this.SubtareasPage = markRaw(
      new ComponenteModal('CONSTRUCRED', SubtareasPage)
    )
  }
}
