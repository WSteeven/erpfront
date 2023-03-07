// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import GastoPage from 'pages/fondosRotativos/gasto/view/GastoPage.vue'

export class FondoRotativoContabilidadModales {
  GastoPage: ComponenteModal

  constructor() {
    this.GastoPage = markRaw(
      new ComponenteModal('Gastos', GastoPage)
    )
  }
}
