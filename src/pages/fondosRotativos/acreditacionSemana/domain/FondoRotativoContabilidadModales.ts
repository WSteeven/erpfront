// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import VisualizarGastoPage from 'pages/fondosRotativos/gasto/view/VisualizarGastoPage.vue'
import { markRaw } from 'vue'

// Paginas


export class FondoRotativoContabilidadModales {
  VisualizarGastoPage: ComponenteModal

  constructor() {
    this.VisualizarGastoPage = markRaw(
      new ComponenteModal('Gastos', VisualizarGastoPage)
    )
  }
}
