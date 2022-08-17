import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import TipoTareaPage from 'pages/tareas/modules/tiposTareas/view/TipoTareaPage.vue'
import { markRaw } from 'vue'

export class ProgresivaModales {
  TipoTareaPage: ComponenteModal

  constructor() {
    this.TipoTareaPage = markRaw(
      new ComponenteModal('Categoría de productos', TipoTareaPage)
    )
  }
}
