// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import TipoTareaPage from 'pages/tareas/tiposTareas/view/TipoTareaPage.vue'
import TipoElementoPage from 'pages/tareas/progresivas/tiposElementos/view/TipoElementoPage.vue'

export class ProgresivaModales {
  TipoTareaPage: ComponenteModal
  TipoElementoPage: ComponenteModal

  constructor() {
    this.TipoTareaPage = markRaw(
      new ComponenteModal('CONSTRUCRED', TipoTareaPage)
    )
    this.TipoElementoPage = markRaw(
      new ComponenteModal('CONSTRUCRED', TipoElementoPage)
    )
  }
}
