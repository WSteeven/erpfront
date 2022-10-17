// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RegistroTendidoPage from 'pages/tareas/progresivas/controlProgresivas/modules/registrosTendidos/view/RegistroTendidoPage.vue'

export class ProgresivaModales {
  RegistroTendidoPage: ComponenteModal

  constructor() {
    this.RegistroTendidoPage = markRaw(
      new ComponenteModal('CONSTRUCRED', RegistroTendidoPage)
    )
  }
}
