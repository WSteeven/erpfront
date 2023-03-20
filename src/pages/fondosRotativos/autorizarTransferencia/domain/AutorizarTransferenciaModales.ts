// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import TransferenciaPage from 'pages/fondosRotativos/transferencias/view/TransferenciaPage.vue'
import { markRaw } from 'vue'

// Paginas


export class AutorizarTransferenciaModales {
  TransferenciaPage: ComponenteModal

  constructor() {
    this.TransferenciaPage = markRaw(
      new ComponenteModal('Transferencia', TransferenciaPage)
    )
  }
}
