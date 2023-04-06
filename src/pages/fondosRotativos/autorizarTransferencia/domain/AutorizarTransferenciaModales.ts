// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import VisualizarTransferenciaPage from 'pages/fondosRotativos/transferencias/view/VisualizarTransferenciaPage.vue'

import { markRaw } from 'vue'

// Paginas


export class AutorizarTransferenciaModales {
  VisualizarTransferenciaPage: ComponenteModal

  constructor() {
    this.VisualizarTransferenciaPage = markRaw(
      new ComponenteModal('VisualizarTransferencia', VisualizarTransferenciaPage)
    )
  }
}
