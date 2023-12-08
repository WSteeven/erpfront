// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import  ValorAcreditarPage  from 'pages/fondosRotativos/valorAcreditar/view/ValorAcreditarPage.vue'

export class AcreditacionSemanaModales {
  ValorAcreditarPage: ComponenteModal

  constructor() {
    this.ValorAcreditarPage = markRaw(
      new ComponenteModal('ValorAcreditarPage', ValorAcreditarPage)
    )
  }
}
